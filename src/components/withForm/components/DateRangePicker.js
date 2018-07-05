import React from 'react'
import { DatePicker } from 'antd'
import styled from 'styled-components'
import moment from 'moment'
import PropTypes from 'prop-types'

const { RangePicker } = DatePicker

const StyledRangePicker = styled(RangePicker)`
  &.ant-calendar-picker {
    width: 100%;
    font-size: 1em;
    .ant-calendar-picker-input {
      font-size: 1em;
      .ant-calendar-range-picker-input {
        width: 45%;
        border: none;
      }
    }
  }
`

const dateFormat = 'YYYY-MM-DD'
const getFormattedDate = (date, formatValue) => {
  if (formatValue) {
    return formatValue(date).toISOString()
  }
  return date.toISOString()
}

class DateRangePicker extends React.Component {
  state = {
    startValue: (() => {
      const { dateFields: { start: { defaultValue } } } = this.props
      return defaultValue ? moment(defaultValue) : ''
    })(),
    endValue: (() => {
      const { dateFields: { end: { defaultValue } } } = this.props
      return defaultValue ? moment(defaultValue) : ''
    })(),
  }
  handleRangePickerChange = (dates) => {
    const { onChange: handleChanges, dateFields: { start, end } } = this.props
    const { name: startName, formatValue: startFormatValue } = start
    const { name: endName, formatValue: endFormatValue } = end
    const formattedStartValue = getFormattedDate(dates[0], startFormatValue)
    const formattedEndValue = getFormattedDate(dates[1], endFormatValue)
    const records = {
      [startName]: formattedStartValue,
      [endName]: formattedEndValue,
    }
    this.setState({ startValue: formattedStartValue, endValue: formattedEndValue }, () => {
      handleChanges(null, records)
    })
  }
  render() {
    const { startValue, endValue } = this.state
    const { dateFields: { start, end }, onChange, ...rest } = this.props
    const { name: startName } = start
    const { name: endName } = end
    const defaultValue = []
    if (startValue) {
      defaultValue.push(startValue)
    }
    if (endValue) {
      defaultValue.push(endValue)
    }

    return (
      <React.Fragment>
        <StyledRangePicker
          size='large'
          format={dateFormat}
          onChange={this.handleRangePickerChange}
          defaultValue={defaultValue}
          {...rest}
        />
        <input hidden name={startName} value={defaultValue[0] || ''} readOnly />
        <input hidden name={endName} value={defaultValue[1] || ''} readOnly />
      </React.Fragment>
    )
  }
}

DateRangePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  dateFields: PropTypes.object.isRequired,
}

export default DateRangePicker
