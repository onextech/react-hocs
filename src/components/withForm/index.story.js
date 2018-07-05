import React from 'react'
import { storiesOf } from '@storybook/react'
import withForm from '.'

const fields = [
  {
    name: 'name',
  },
]

const DemoForm = withForm(fields)

storiesOf('withForm', module)
  .add('Default', () => <DemoForm />)
