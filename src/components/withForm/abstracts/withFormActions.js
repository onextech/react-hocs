import { compose, mapProps } from 'recompose'
import { graphql } from 'react-apollo'

const withFormActions = (actions) => (Component) => {
  const mutations = []
  const { SUBMIT } = actions

  // TODO: Need a way to set variables and refetch
  if (SUBMIT) {
    const submitMutation = graphql(SUBMIT, {
      props: ({ mutate }) => {
        return ({
          onSubmit: (variables) => mutate({
            variables,
            // refetchQueries: [refetchModel],
          }),
        })
      },
    })
    mutations.push(submitMutation)
  }

  return compose(
    ...mutations,
    mapProps((props) => {
      // Stream callback actions down into props
      const callbacks = {}
      if (actions.onSuccess) callbacks.onSuccess = actions.onSuccess
      return { ...callbacks, ...props }
    }),
  )(Component)
}

export default withFormActions
