import React from 'react'
import { storiesOf } from '@storybook/react'
import withForm from '.'
import { FIELD_WYSIWYG } from './constants/field'

const fields = [
  {
    name: 'name',
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
]

const DemoForm = withForm(fields)

storiesOf('withForm', module)
  .add('Default', () => <DemoForm />)
