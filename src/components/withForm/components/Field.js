import React from 'react'
import PropTypes from 'prop-types'
import startCase from 'lodash/startCase'
import get from 'lodash/get'
import { Form, Input } from 'semantic-ui-react'

/**
 * Return Semantic UI Field
 * @link https://react.semantic-ui.com/collections/form#shorthand-field-control
 */
const Field = ({ form, onChange: handleChange, name, path, isInRecord, required, hidden, ...rest }) => {
  const hide = typeof hidden === 'boolean' ? hidden : (!isInRecord && !required) // hide optional fields on create
  const value = get(form, path || name) || ''
  return (
    <Form.Field
      value={value}
      onChange={handleChange}
      name={name}
      placeholder={startCase(name)}
      type='text'
      control={Input}
      label={hide ? null : startCase(name)}
      hidden={hide}
      required={required}
      path={path}
      {...rest}
    />
  )
}

Field.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  isInRecord: PropTypes.bool.isRequired,
  name: PropTypes.string,
  path: PropTypes.string,
  required: PropTypes.bool,
  hidden: PropTypes.bool,
}

Field.defaultProps = {
  name: undefined,
  path: undefined,
  required: undefined,
  hidden: undefined,
}

export default Field
