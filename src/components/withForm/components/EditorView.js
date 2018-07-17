import React from 'react'

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
  return (
    <FroalaEditorView {...props} />
  )
}

export default EditorView
