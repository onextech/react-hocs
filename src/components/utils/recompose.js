import { withState, withHandlers } from 'recompose'

/**
 * Recompose's setState callback
 * Note that we have to use withState for this to work
 * Because withStateHanders does not support callbacks
 * @issue Can't call setState callback withStateHandlers
 * @link https://github.com/acdlite/recompose/issues/512
 */
const withSetState = (initialState) => {
  return [
    withState('state', 'setState', initialState),
    withHandlers({
      updateState: ({ setState, state }) => (patch) => setState({ ...state, ...patch }),
      resetState: ({ setState }) => () => setState(initialState),
    }),
  ]
}

export default withSetState
