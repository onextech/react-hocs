import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import fetch from 'fetch-everywhere'
import FormData from 'form-data'

class Wysiwyg extends React.Component {
  state = {
    editorState: '',
    value: '',
  }

  componentWillMount() {
    const { initialValue } = this.props
    if (initialValue) this.setTextareaValue(initialValue)
  }

  static getTextareaValue(editorState) {
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }

  onEditorStateChange = (editorState) => {
    const { onChange: handleChange, name } = this.props
    const value = Wysiwyg.getTextareaValue(editorState)
    this.setState({ editorState, value })
    handleChange(null, { name, value })
  }

  setTextareaValue = (value) => {
    const contentBlock = htmlToDraft(value)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      this.setState({ editorState, value: Wysiwyg.getTextareaValue(editorState) })
    }
  }

  uploadImage = (file) => {
    const { user: { token }, uploadUrl: UPLOAD_URL } = this.props
    return new Promise(async (resolve, reject) => {
      try {
        const form = new FormData()
        form.append('file', file)
        form.append('model', 'User')
        form.append('field', 'avatar')
        const response = await fetch(UPLOAD_URL, {
          method: 'POST',
          headers: { Authorization: token },
          body: form,
        })
        const data = await response.json()
        return data.ok ? resolve({ data: { link: data.src } }) : reject(data)
      } catch (err) {
        reject(err)
      }
    })
  }

  render() {
    const { editorState, value } = this.state

    return (
      <React.Fragment>
        <Editor
          stripPastedStyles
          editorState={editorState}
          onEditorStateChange={this.onEditorStateChange}
          wrapperClassName='app-wysiwyg-wrapper basic'
          editorClassName='editor'
          toolbarClassName='toolbar'
          toolbar={{
            options: ['inline', 'blockType', 'list', 'textAlign', 'history', 'link', 'image', 'emoji'],
            image: {
              uploadCallback: this.uploadImage,
              previewImage: true,
              alignmentEnabled: false,
            },
            inline: { options: ['bold', 'italic', 'underline'] },
            list: { options: ['unordered', 'ordered', 'indent', 'outdent'] },
            textAlign: { options: ['left', 'center', 'right', 'justify'] },
            link: { options: ['link'] },
            blockType: { inDropdown: true, options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'] },
          }}
        />
        <textarea hidden disabled value={value} />
      </React.Fragment>
    )
  }
}

Wysiwyg.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  uploadUrl: PropTypes.string.isRequired,
  initialValue: PropTypes.string,
}

Wysiwyg.defaultProps = {
  initialValue: undefined,
}

export default Wysiwyg
