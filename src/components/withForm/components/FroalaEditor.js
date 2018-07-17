import React from 'react'
import PropTypes from 'prop-types'
/* eslint-disable no-unused-vars */
import window from 'global'

import 'froala-editor/js/froala_editor.pkgd.min'
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'font-awesome/css/font-awesome.css'
import FroalaEditor from 'react-froala-wysiwyg'

class Editor extends React.Component {
  state = {
    model: this.props.value || '',
  }

  config = {
    toolbarButtons: [
      'fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', '|',
      'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|',
      'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-',
      'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|',
      'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|',
      'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo',
    ],
  }

  handleModelChange = (model) => {
    const { onChange: handleChange, name } = this.props
    this.setState({ model })
    handleChange(null, { name, value: model })
  }

  render() {
    return (
      <div>
        <FroalaEditor
          tag='textarea'
          config={this.config}
          model={this.state.model}
          onModelChange={this.handleModelChange}
        />
      </div>
    )
  }
}

Editor.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

Editor.defaultProps = {
  value: '',
}

// Render Froala Editor component.
export default Editor
