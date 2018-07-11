import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'
import { DatePicker } from 'antd'

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`

const DATE_FORMAT = 'YYYY-MM-DD'

const WrappedDatePicker = (props) => {
  const { onChange: handleChange, value, ...rest } = props

  const handleDateChange = (date, dateString) => {
    const { name } = props

    const dateValue = date.toISOString()

    const data = { name, date, dateString, value: dateValue }

    // Send data back to upstream to set state
    return handleChange(null, data)
  }

  /**
   * Set defaultValue of date-related components
   * with values extracted from graphql responses.
   * Note that we have to set initialise a new JS date object
   * before passing it to moment for ant design's consumption
   * @param {string} value
   * @param {*} fallbackValue
   * @return {Moment|*}
   */
  const setDefaultValue = (value, fallbackValue = null) => (value ? moment(new Date(value)) : fallbackValue)

  return (
    <StyledDatePicker
      size='large'
      format={DATE_FORMAT}
      onChange={handleDateChange}
      defaultValue={setDefaultValue(value)}
      {...rest}
    />
  )
}

WrappedDatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

WrappedDatePicker.defaultProps = {
  value: undefined,
}

export default WrappedDatePicker
