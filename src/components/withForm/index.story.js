import React from 'react'
import moment from 'moment'
import { storiesOf } from '@storybook/react'
import withForm from '.'
import {
  FIELD_WYSIWYG,
  FIELD_CHECKBOX,
  FIELD_DATERANGEPICKER,
} from './constants/field'

const fields = [
  {
    name: 'name', required: true,
  },
  {
    name: 'email',
    path: 'user.email',
    icon: 'user',
    required: true,
  },
  {
    name: 'content',
    required: true,
    type: FIELD_WYSIWYG,
    props: () => {
      return {
        user: { id: '123' },
        uploadUrl: 'http://example.com',
      }
    },
  },
  { name: 'isPercentage', type: FIELD_CHECKBOX, required: true },
  {
    name: 'couponValidity',
    required: true,
    type: FIELD_DATERANGEPICKER,
    dateFields: {
      start: {
        name: 'start',
        defaultValue: moment(),
        formatValue: (date) => moment(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
      },
      end: {
        name: 'end',
        formatValue: (date) => moment(date).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }),
      },
    },
    dateRangePicker: { disabledDate: (current) => current < moment().subtract(1, 'days') },
  },
]

const DemoForm = withForm(fields)

storiesOf('withForm', module)
  .add('Default', () => <DemoForm />)
