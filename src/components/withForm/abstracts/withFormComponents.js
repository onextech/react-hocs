import React from 'react'
import { compose, mapProps } from 'recompose'
import { Button, Checkbox, Form, Message, Dimmer, Loader } from 'semantic-ui-react'
import startCase from 'lodash/startCase'
import Field from '../components/Field'
import Wysiwyg from '../components/Wysiwyg'
import DateRangePicker from '../components/DateRangePicker'
import { FIELD_UPLOAD, FIELD_WYSIWYG, FIELD_DATERANGEPICKER, FIELD_CHECKBOX, CLASS_FIELD_CHECKBOX, CLASS_LABEL_CHECKBOX } from '../constants/field'

const withFormComponents = compose(
  mapProps((props) => {
    const { record, handleSubmit, state, fields, submitButton } = props
    const { loading, errors, form, pristine } = state
    const components = {}

    components.renderLoading = () => {
      return (
        <Dimmer inverted active={loading}>
          <Loader inverted content='Loading' />
        </Dimmer>
      )
    }

    components.renderSubmitButton = () => {
      return (
        <Button
          positive
          loading={loading}
          disabled={pristine}
          onClick={handleSubmit}
          style={{ fontSize: '1.1em', padding: '.9em 3.5em' }}
          content={record ? 'Save' : 'Create'}
          {...submitButton}
        />
      )
    }

    components.renderErrors = () => {
      return (
        <React.Fragment>
          {errors.map(({ title, message, key }) => {
            return (
              <Message
                size='tiny'
                key={key}
                error
                header={title}
                content={message}
              />
            )
          })}
        </React.Fragment>
      )
    }

    // Check if form state is ready before rendering fields to prevent double render
    const isFormReady = Object.keys(form).length
    const isNewForm = !record
    components.renderFields = () => {
      return (
        <React.Fragment>
          {(isFormReady || isNewForm) && fields.map((fieldProps) => {
            const {
              key,
              type,
              name,
              onChange: handleChange,
              component: Component,
              form,
              required,
              props,
              ...rest
            } = fieldProps
            const record = Object.hasOwnProperty.call(form, name) // form must contain this key
            const show = record || required // show optional fields only on update
            if (show) {
              switch (type) {
                case FIELD_WYSIWYG: {
                  return (
                    <Form.Field key={key} required={required}>
                      <label htmlFor={name}>
                        {startCase(name)}
                      </label>
                      <Wysiwyg name={name} initialValue={form[name]} onChange={handleChange} {...props} />
                    </Form.Field>
                  )
                }
                case FIELD_UPLOAD: {
                  const { label, field, ...upload } = rest
                  return (
                    <Form.Field key={key} required={required} {...field}>
                      <label htmlFor={name} {...label}>
                        {startCase(name)}
                      </label>
                      <Component
                        style={{ marginBottom: '1.5em' }}
                        field={name}
                        id={name}
                        onUpload={handleChange}
                        src={form[name]}
                        {...upload}
                        {...props}
                      />
                    </Form.Field>
                  )
                }
                case FIELD_DATERANGEPICKER: {
                  const { dateFields, label, dateRangePicker } = rest
                  return (
                    <Form.Field key={key}>
                      <label htmlFor={name} {...label} >{startCase(name)}</label>
                      <DateRangePicker onChange={handleChange} dateFields={dateFields} {...dateRangePicker} />
                    </Form.Field>
                  )
                }
                case FIELD_CHECKBOX: {
                  const { hidden, label } = rest
                  return (
                    <Form.Field className={CLASS_FIELD_CHECKBOX} key={key} hidden={hidden} required={required}>
                      <label htmlFor={name} className={CLASS_LABEL_CHECKBOX} {...label}>{startCase(name)}</label>
                      <Checkbox
                        toggle
                        id={name}
                        name={name}
                        onChange={handleChange}
                        checked={form[name]}
                      />
                    </Form.Field>
                  )
                }
                default: {
                  return <Field {...fieldProps} />
                }
              }
            }
          })}
        </React.Fragment>
      )
    }

    return { ...props, components }
  }),
)

export default withFormComponents

