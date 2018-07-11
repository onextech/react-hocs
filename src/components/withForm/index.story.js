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
  FIELD_DATEPICKER,
  FIELD_IMAGES,
} from './constants/field'

const fields = [
  {
    name: 'name',
    required: true,
  },
  {
    name: 'images',
    label: 'Gallery',
    required: true,
    type: FIELD_IMAGES,
    upload: {
      // action: '//jsonplaceholder.typicode.com/posts/',
      // headers: {
      //   Authorization: 'token',
      // },
      data: {
        model: 'Name',
        field: 'Somewhere',
      },
    },
  },
  {
    name: 'eventDate',
    label: 'Date of Event',
    required: true,
    type: FIELD_DATEPICKER,
  },
  {
    name: 'isModerator',
    required: true,
    path: 'teacher.isModerator',
    type: FIELD_CHECKBOX,
    initialValue: ({ record }) => get(record, 'teacher.isModerator'),
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
  preSubmit: (form) => {
    return {
      ...form,
      organizations: form.teacher.organizations,
      isModerator: form.teacher.isModerator,
      images: form.images.map(({ src }) => src),
    }
  },
})

const demoRecord = {
  id: 1,
  name: null,
  images: [
    {
      id: 1,
      src: '//s3-ap-southeast-1.amazonaws.com/express-graphql-boilerplate-test/banquet/heroImage/5b6193d8c2ba14a0f8e042a84efce2e3.jpg',
      path: 'banquet/heroImage',
    },
  ],
  eventDate: 'Wed Jul 11 2018 13:04:35 GMT+0800 (+08)',
  country: 2,
  user: { id: 1, email: 'hello@meme.com' },
  isPercentage: false,
  content: '<p>hello</p>',
  teacher: {
    id: 1,
    isModerator: true,
    mobile: '1822811',
    organizations: [
      { id: 1, name: 'Org 1' },
      { id: 2, name: 'Org 2' },
    ],
  },
}

const BasicDemoForm = withForm(fields, {
  props: {
    basic: true,
    submitButton: {
      size: null,
      positive: false,
      style: {
        display: 'block',
        marginLeft: 'auto',
      },
      content: 'Reset password and log in',
    },
  },
})

storiesOf('withForm', module)
  .add('Update', () => <DemoForm record={demoRecord} />)
  .add('Create', () => <DemoForm />)
  .add('Basic', () => <BasicDemoForm />)
