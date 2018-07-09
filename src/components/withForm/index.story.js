import React from 'react'
import moment from 'moment'
import get from 'lodash/get'
import { storiesOf } from '@storybook/react'
import { Select } from 'semantic-ui-react'
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
    name: 'organizations',
    required: true,
    initialValue: ({ record }) => {
      const organizations = get(record, 'teacher.organizations')
      return organizations ? organizations.map(({ id }) => id) : []
    },
    path: 'teacher.organizations',
    control: Select,
    options: () => {
      return [
        { key: 1, text: 'Org 1', value: 1 },
        { key: 2, text: 'Org 2', value: 2 },
      ]
    },
    search: true,
    multiple: true,
  },
  {
    name: 'country',
    required: true,
    path: 'country',
    control: Select,
    options: [
      { key: 1, text: 'Country A', value: 1 },
      { key: 2, text: 'Country B', value: 2 },
    ],
    search: true,
  },
  {
    name: 'content',
    required: true,
    type: FIELD_WYSIWYG,
    props: {
      user: { id: '123' },
      uploadUrl: 'http://example.com',
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

const DemoForm = withForm(fields, {
  preSubmit: (form) => ({ ...form, organizations: form.teacher.organizations }),
})

const demoRecord = {
  id: 1,
  name: 'Joel',
  country: 2,
  user: { id: 1, email: 'hello@meme.com' },
  isPercentage: false,
  content: '<p>hello</p>',
  teacher: {
    id: 1,
    mobile: '1822811',
    organizations: [
      { id: 1, name: 'Org 1' },
      { id: 2, name: 'Org 2' },
    ],
  },
}

storiesOf('withForm', module)
  .add('Update', () => <DemoForm record={demoRecord} />)
  .add('Create', () => <DemoForm />)
