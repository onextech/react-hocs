import React from 'react'
import PropTypes from 'prop-types'

/**
 * Fix issues with SSR
 * (Require Editor JS files)
 * @link https://github.com/froala/react-froala-wysiwyg/issues/35
 */
let FroalaEditorView
if (typeof window !== 'undefined') {
  /* eslint-disable global-require */
  FroalaEditorView = require('react-froala-wysiwyg/FroalaEditorView').default
  /* eslint-enable global-require */
}

const EditorView = (props) => {
  if (FroalaEditorView) {
    return (
      <FroalaEditorView {...props} />
    )
  }
  // SSR render
  return (
    <div dangerouslySetInnerHTML={{ __html: props.model }} />
  )
}

EditorView.propTypes = {
  model: PropTypes.string, // The value of the editor
}

export default EditorView
