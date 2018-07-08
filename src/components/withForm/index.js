import AbstractForm from './components/AbstractForm'
import withFormHOC from './abstracts/withForm'

const withForm = (fields, options = {}) => withFormHOC(fields, options)(AbstractForm)

export default withForm
