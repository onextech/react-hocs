// @flow
import type { ComponentType } from 'react'
import { compose, lifecycle, withHandlers, mapProps } from 'recompose'
import qs from 'query-string'
import { message } from 'antd'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import set from 'lodash/set'
import has from 'lodash/has'
import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import withSetState from '../../utils/recompose'
import withFormComponents from './withFormComponents'
import { TYPENAME_FILE } from '../constants/typename'
import { MESSAGE_SAVE_FAILURE, MESSAGE_SAVE_SUCCESS } from '../constants/message'

type FieldsType = Array<{
  name: string,
  path: string,
  value: any,
  required: (boolean | Function),
  initialValue: any,
  dateFields: Object,
}>

type OptionsType = {
  props?: Object,
  preSubmit?: Function,
}

/**
 * Build a form
 * @param {Object[]} fields
 * @param {{}} options
 * @return {function(*=)}
 */
const withForm = (fields: FieldsType, options: OptionsType = {}) => (Component: ComponentType<*>) => {
  /**
   * Define form state and handlers
   * @param {Object[]} fields
   * @return {function(*=)}
   */
  const withFormHandlers = compose(
    ...withSetState({
      form: {},
      savedRecord: {},
      pristine: true,
      success: false,
      failure: false,
      loading: false,
      errors: [],
    }),
    lifecycle({
      // Set form values if available
      componentDidMount() {
        const { updateState, record, match, location } = this.props

        if (record) {
          const setInitialForm = (record) => {
            const initialForm = cloneDeep(record)
            fields.forEach((field) => {
              const { initialValue, name, path } = field
              const key = path || name
              if (initialValue) {
                set(initialForm, key, initialValue(this.props))
              }
            })
            return initialForm
          }
          const initialForm = setInitialForm(record)
          return updateState({ form: initialForm, savedRecord: record })
        }

        // set values of fields if they're already set when the component first mounted
        const fieldsWithDefaultValues = {}
        fields.forEach((field) => {
          const { name, value } = field
          if (value) {
            fieldsWithDefaultValues[name] = typeof value === 'function' ? value(this.props) : value
          }
        })
        if (Object.keys(fieldsWithDefaultValues).length) {
          return updateState({ form: { ...fieldsWithDefaultValues }, savedRecord: { ...fieldsWithDefaultValues } })
        }

        /**
         * Return object with prefilled data
         * @param {{}} prefilledData
         * @return {{}}
         */
        const getPrefilledRecord = (prefilledData) => {
          const prefilledRecord = {}
          Object.keys(prefilledData).forEach((key) => {
            const found = find(fields, { name: key })
            if (found) prefilledRecord[key] = prefilledData[key]
          })
          return prefilledRecord
        }
        if (match && !isEmpty(match.params)) {
          const prefilledRecord = getPrefilledRecord(match.params)
          return updateState({ form: prefilledRecord, savedRecord: prefilledRecord })
        }
        if (location && !isEmpty(location.search)) {
          const query = qs.parse(location.search)
          const prefilledRecord = getPrefilledRecord(query)
          return updateState({ form: prefilledRecord, savedRecord: prefilledRecord })
        }
      },
    }),
    withHandlers({
      handleChange: (props) => (e, data) => {
        const { state: { form, savedRecord }, updateState } = props
        const { name, value, path, checked, start, end } = data
        // value can be string or checked boolean
        const nextValue = typeof checked === 'boolean' ? checked : value
        // check for daterangepicker onchange to diverge onchange behaviour
        if (typeof nextValue === 'undefined' && start && end) {
          let pristine = true
          const records = { start, end }
          Object.entries(records).forEach(([name, value]) => {
            pristine = pristine && savedRecord[name] === value
          })
          return updateState({ pristine, form: { ...form, ...records } })
        }
        // check if form is pristine
        const pristine = savedRecord[name] === nextValue
        // check if value to set is nested
        const prevForm = path ? cloneDeep(form) : { ...form }
        const nextForm = set(prevForm, path || name, nextValue)
        // update state with next value
        updateState({ pristine, form: nextForm })
      },
      handleFailure: (props) => (errors) => {
        const { updateState } = props
        message.error(MESSAGE_SAVE_FAILURE)
        updateState({ success: false, failure: true, loading: false, errors })
      },
      handleSuccess: (props) => (data) => {
        const { node: record = {} } = data
        const { setState, state, onSuccess, closeModal, closeModalKey: key } = props
        const nextState = {
          ...state,
          form: record, // Either the `node` key or by default: {}
          savedRecord: record,
          pristine: true,
          success: true,
          failure: false,
          loading: false,
        }
        const setStateCallback = () => {
          message.success(MESSAGE_SAVE_SUCCESS)
          if (onSuccess) onSuccess(record, props, data)
          if (closeModal && key) closeModal({ key })
        }
        setState(nextState, setStateCallback)
      },
    }),
    withHandlers({
      handleSubmit: (props) => async () => {
        const {
          state: { form: rawForm },
          updateState,
          onSubmit: handleSubmit,
          onCreate: handleCreate,
          onUpdate: handleUpdate,
          handleFailure,
          handleSuccess,
          record,
        } = props
        try {
          const getCleanForm = (form) => {
            const cleanedForm = { ...form }
            Object.keys(form).forEach((key) => {
              const value = form[key]

              // Strip empty strings
              if (value === '') delete cleanedForm[key]

              // Save File types as path {string} instead of {object}
              if (value && typeof value === 'object' && value.__typename === TYPENAME_FILE) {
                cleanedForm[key] = value.path
              }
            })
            return cleanedForm
          }
          const getRequiredFields = (fields) => {
            const requiredFields = []
            fields.forEach((field) => {
              const {
                required,
                name,
                path,
                dateFields,
              } = field
              const isFunction = typeof required === 'function'
              // $FlowFixMe
              const isRequired = isFunction ? required(props) : required
              if (dateFields && dateFields.start && dateFields.end) {
                const { start, end } = dateFields
                return isRequired && requiredFields.push(start.name, end.name)
              }
              return isRequired && requiredFields.push(path || name)
            })
            return requiredFields
          }

          let form = getCleanForm(rawForm)
          const requiredFields = getRequiredFields(fields)
          const isFormCompleted = requiredFields.every((requiredField) => has(form, requiredField))

          if (isFormCompleted) {
            updateState({ loading: true })
            // Enable dynamic submit actions
            const submit = handleSubmit || (record ? handleUpdate : handleCreate)
            if (options.preSubmit) form = options.preSubmit(form)
            const onSubmit = await submit(form)
            const result = onSubmit.data[Object.keys(onSubmit.data)[0]]
            const { ok, validationErrors } = result
            return ok ? handleSuccess(result) : handleFailure(validationErrors)
          }
        } catch (err) {
          const networkError = [{
            key: 'networkError',
            title: `[${err.name}] ${err.message}`,
            message: 'Please check the network connection',
          }]
          return handleFailure(networkError)
        }
      },
    }),
  )

  /**
   * Define field props in an array of objects for form to render later
   */
  const withFormFields = compose(
    mapProps((props) => {
      const { state: { form }, handleChange } = props
      const enhancedFields = []
      fields.map((field) => {
        /**
         * Pass props to field properties if they are a function
         * @param {{}} field
         * @param {{}} props
         * @return {{}} resolvedProps
         */
        const getResolvedProps = (field, props) => {
          const resolvedProps = {}
          const isKeylessFunction = (v) => Object.keys(v).length === 0
          Object.keys(field).forEach((key) => {
            const value = field[key]
            if (typeof value === 'function' && isKeylessFunction(value)) {
              resolvedProps[key] = value(props)
            }
          })
          return { ...field, ...resolvedProps }
        }

        const getValue = (props) => {
          const { name, path } = props
          const key = path || name
          return get(form, key, '')
        }

        const resolvedProps = getResolvedProps(field, props)

        const value = getValue(resolvedProps)

        const enhancedField = {
          key: field.name,
          form,
          onChange: handleChange,
          value,
          ...resolvedProps,
        }

        return enhancedFields.push(enhancedField)
      })
      return { ...props, fields: enhancedFields, ...options.props }
    }),
  )

  return withFormHandlers(withFormFields(withFormComponents(Component)))
}

export default withForm
