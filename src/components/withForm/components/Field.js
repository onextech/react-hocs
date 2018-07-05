import React from 'react'
import PropTypes from 'prop-types'
import startCase from 'lodash/startCase'
import { Form, Input } from 'semantic-ui-react'

/**
 * Return Semantic UI Field
 * @link https://react.semantic-ui.com/collections/form#shorthand-field-control
 */
const Field = ({ form, onChange: handleChange, name, required, hidden, ...rest }) => {
  const record = Object.hasOwnProperty.call(form, name) // form must contain this key
  const hide = typeof hidden === 'boolean' ? hidden : (!record && !required) // hide optional fields on create
  return (
    <Form.Field
      value={form[name] || ''}
      onChange={handleChange}
      name={name}
      placeholder={startCase(name)}
      type='text'
      control={Input}
      label={hide ? null : startCase(name)}
      hidden={hide}
      required={required}
      {...rest}
    />
  )
}

Field.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  required: PropTypes.bool,
  hidden: PropTypes.bool,
}

Field.defaultProps = {
  name: undefined,
  required: undefined,
  hidden: undefined,
}

export default Field
