import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { injectGlobal } from 'styled-components'

/* eslint-disable no-unused-expressions */
injectGlobal`
  .app-wysiwyg-wrapper {
    &.basic {
      .toolbar {
        display: flex;
        margin-bottom: 0;
        padding: 0;
        border: 0;
        > * {
          margin-bottom: 0;
        }
        .rdw-option-wrapper,
        .rdw-block-wrapper {
          margin: 0;
          border: 1px solid lightgray;
          border-bottom: 0;
        }
        .rdw-block-wrapper {
          padding: 0;
        }
      }
      .editor {
        border: 1px solid lightgray;
        padding: .5em 1em;
        min-height: 10em;
        line-height: 1.5;
        background: white;
      }
    }
  }
`
/* eslint-enable no-unused-expressions */

let fetch
let FormData
/* eslint-disable global-require */
if (typeof window !== 'undefined') {
  fetch = require('node-fetch')
  FormData = require('form-data')
}
/* eslint-enable global-require */

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
    const {
      uploadConfig,
      user: { token },
      uploadUrl: UPLOAD_URL,
    } = this.props
    return new Promise(async (resolve, reject) => {
      try {
        const form = new FormData()
        form.append('file', file)
        form.append('model', 'User')
        form.append('field', 'avatar')

        const uploadUrl = uploadConfig ? uploadConfig.url : UPLOAD_URL
        const authHeader = uploadConfig ? uploadConfig.token : token
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: { Authorization: authHeader },
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
  user: PropTypes.object,
  uploadUrl: PropTypes.string,
  uploadConfig: PropTypes.shape({
    url: PropTypes.string.isRequired,
    token: PropTypes.string,
  }),
  initialValue: PropTypes.string,
}

Wysiwyg.defaultProps = {
  initialValue: undefined,
  uploadConfig: undefined,
  uploadUrl: undefined,
  user: undefined,
}

export default Wysiwyg
