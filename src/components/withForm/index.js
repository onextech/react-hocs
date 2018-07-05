import AbstractForm from './components/AbstractForm'
import withFormHOC from './abstracts/withForm'

const withForm = (fields) => withFormHOC(fields)(AbstractForm)

export default withForm
