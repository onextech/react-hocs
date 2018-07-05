import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import intersection from 'lodash/intersection'
import qs from 'query-string'
import { compose, lifecycle, withHandlers, mapProps } from 'recompose'
import { message } from 'antd'
import withSetState from '../../utils/recompose'
import { TYPENAME_FILE } from '../constants/typename'
import { MESSAGE_SAVE_FAILURE, MESSAGE_SAVE_SUCCESS } from '../constants/message'
import { FIELD_DATERANGEPICKER, FIELD_CHECKBOX } from '../constants/field'
import withFormComponents from './withFormComponents'

/**
 * Build a form
 * @param {Object[]} fields
 * @param {{}} options
 * @return {function(*=)}
 */
const withForm = (fields, options = {}) => (Component) => {
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
          return updateState({ form: record, savedRecord: record })
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
      handleChange: (props) => (e, { name, value }) => {
        const { state: { form, savedRecord }, updateState } = props
        const pristine = savedRecord[name] === value
        updateState({ pristine, form: { ...form, [name]: value } })
      },
      handleChanges: (props) =>
        /**
         * does the same as handleChange(), but with an array of { name, value }
         * @param {{}} e
         * @param {[{ name, value }]} records
         */
        (e, records) => {
          const { state: { form, savedRecord }, updateState } = props
          let pristine = true
          Object.entries(records).forEach(([name, value]) => {
            pristine = pristine && savedRecord[name] === value
          })
          updateState({ pristine, form: { ...form, ...records } })
        },
      handleCheckboxChange: (props) => (e, { name, checked }) => {
        const { state: { form, savedRecord }, updateState } = props
        const pristine = savedRecord[name] === checked
        updateState({ pristine, form: { ...form, [name]: checked } })
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
              if (field.type === FIELD_DATERANGEPICKER) {
                const { required: isRequired, dateFields: { start, end } } = field
                if (isRequired) {
                  const { name: startName } = start
                  const { name: endName } = end
                  requiredFields.push(startName, endName)
                }
                return isRequired
              }
              if (field.type !== FIELD_CHECKBOX) {
                const isRequired = typeof field.required === 'function' ? field.required(props) : field.required
                return isRequired && requiredFields.push(field.name)
              }
            })
            return requiredFields
          }

          const form = getCleanForm(rawForm)
          const requiredFields = getRequiredFields(fields)
          const isFormCompleted = intersection(Object.keys(form), requiredFields).length === requiredFields.length

          if (isFormCompleted) {
            updateState({ loading: true })
            const submit = handleSubmit || (record ? handleUpdate : handleCreate) // Enable dynamic submit actions
            const onSubmit = await submit(form)
            const result = onSubmit.data[Object.keys(onSubmit.data)[0]]
            const { ok, validationErrors } = result
            if (!ok) {
              return handleFailure(validationErrors)
            }
            return handleSuccess(result)
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
         * @param field
         * @param props
         * @return {{}}
         */
        const getResolvedProps = (field, props) => {
          const callbackProps = {}
          const isKeylessFunction = (v) => Object.keys(v).length === 0
          Object.keys(field).forEach((key) => {
            const value = field[key]
            if (typeof value === 'function' && isKeylessFunction(value)) {
              callbackProps[key] = value(props)
            }
          })
          return callbackProps
        }
        const resolvedProps = getResolvedProps(field, props)
        const enhancedField = {
          key: field.name,
          form,
          onChange: handleChange,
          ...field,
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
