import React from 'react'
import { compose, mapProps } from 'recompose'
import { Button, Checkbox, Form, Message, Dimmer, Loader } from 'semantic-ui-react'
import startCase from 'lodash/startCase'
import has from 'lodash/has'
import Field from '../components/Field'
import Wysiwyg from '../components/Wysiwyg'
import DateRangePicker from '../components/DateRangePicker'
import DatePicker from '../components/DatePicker'
import {
  FIELD_UPLOAD,
  FIELD_WYSIWYG,
  FIELD_DATERANGEPICKER,
  FIELD_DATEPICKER,
  FIELD_CHECKBOX,
  CLASS_FIELD_CHECKBOX,
  CLASS_LABEL_CHECKBOX,
} from '../constants/field'

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
              path,
              value,
              onChange: handleChange,
              component: Component,
              form,
              required,
              props,
              label,
              ...rest
            } = fieldProps
            const isInRecord = has(form, path || name) // form must contain this key
            const show = isInRecord || required // show optional fields only on update
            const Label = (wrappedLabelProps) => {
              return (
                <label htmlFor={name} {...wrappedLabelProps}>
                  {label || startCase(name)}
                </label>
              )
            }
            if (show) {
              switch (type) {
                case FIELD_WYSIWYG: {
                  return (
                    <Form.Field key={key} required={required}>
                      <Label />
                      <Wysiwyg name={name} initialValue={form[name]} onChange={handleChange} {...props} />
                    </Form.Field>
                  )
                }
                case FIELD_UPLOAD: {
                  const { field, ...upload } = rest
                  return (
                    <Form.Field key={key} required={required} {...field}>
                      <Label />
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
                  const { dateFields, dateRangePicker } = rest
                  return (
                    <Form.Field key={key} required={required}>
                      <Label />
                      <DateRangePicker
                        onChange={handleChange}
                        dateFields={dateFields}
                        {...dateRangePicker}
                        {...props}
                      />
                    </Form.Field>
                  )
                }
                case FIELD_DATEPICKER: {
                  return (
                    <Form.Field key={key} required={required}>
                      <Label />
                      <DatePicker
                        id={name} // Add id for htmlFor from label
                        name={name} // Add name to set key in form state
                        onChange={handleChange}
                        value={value} // To set defaultValue
                        {...props} />
                    </Form.Field>
                  )
                }
                case FIELD_CHECKBOX: {
                  const { hidden } = rest
                  return (
                    <Form.Field className={CLASS_FIELD_CHECKBOX} key={key} hidden={hidden} required={required}>
                      <Label className={CLASS_LABEL_CHECKBOX} />
                      <Checkbox
                        toggle
                        id={name}
                        name={name}
                        onChange={handleChange}
                        checked={Boolean(value)}
                        path={path}
                      />
                    </Form.Field>
                  )
                }
                default: {
                  const { initialValue, ...inputProps } = fieldProps
                  return <Field isInRecord={isInRecord} {...inputProps} />
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

