import { compose } from 'recompose'
import { graphql } from 'react-apollo'

const withFormCRUD = (model, actions) => (Component) => {
  const defaultVariables = { filter: null, sort: '-createdAt' }
  const variables = { ...defaultVariables, ...actions.variables }

  // Add refetch if list query provided
  const mutateOptions = {}
  if (actions.LIST) {
    const refetchModel = { query: actions.LIST, variables }
    mutateOptions.refetchQueries = [refetchModel]
  }

  const crudActions = []
  if (actions.UPDATE) {
    const updateAction = graphql(actions.UPDATE, {
      props: ({ mutate }) => {
        return ({
          onUpdate: (variables) => mutate({
            variables,
            ...mutateOptions,
          }),
        })
      },
    })
    crudActions.push(updateAction)
  }

  if (actions.CREATE) {
    const createAction = graphql(actions.CREATE, {
      props: ({ mutate }) => {
        return ({
          onCreate: (variables) => mutate({
            variables,
            ...mutateOptions,
          }),
        })
      },
    })
    crudActions.push(createAction)
  }

  return compose(
    ...crudActions,
  )(Component)
}

export default withFormCRUD
