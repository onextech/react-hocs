import React from 'react'
import PropTypes from 'prop-types'
import startCase from 'lodash/startCase'
import { Form, Input } from 'semantic-ui-react'

/**
 * Return Semantic UI Field
 * @link https://react.semantic-ui.com/collections/form#shorthand-field-control
 */
const Field = ({ onChange: handleChange, name, path, value, isInRecord, required, hidden, props }) => {
  const hide = typeof hidden === 'boolean' ? hidden : (!isInRecord && !required) // hide optional fields on create
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
      {...props}
    />
  )
}

Field.propTypes = {
  onChange: PropTypes.func.isRequired,
  isInRecord: PropTypes.bool.isRequired,
  value: PropTypes.any.isRequired,
  props: PropTypes.object,
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
  props: undefined,
}

export default Field
