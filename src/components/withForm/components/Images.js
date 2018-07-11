import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd'
import { TYPENAME_FILE } from '../constants/typename'
import { MESSAGE_UPLOAD_SUCCESS, MESSAGE_UPLOAD_FAILURE } from '../constants/message'

class Images extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: (() => {
      const { value } = this.props
      const fileList = value && Array.isArray(value) && value.map(({ id, src }) => {
        return {
          uid: id,
          status: 'done',
          url: src,
        }
      })
      return fileList
    })(),
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleChange = ({ file: { status, response }, fileList, event: e }) => {
    const { name, onChange: handleChange } = this.props
    switch (status) {
      case 'uploading': {
        return this.setState({ loading: true, src: null })
      }
      case 'done': {
        // Send data back to upstream to set state
        handleChange(e, { name, value: { ...response, __typename: TYPENAME_FILE } })

        // Update fileList in local state
        return this.setState({ loading: false, src: response.src, fileList }, () => {
          message.success(MESSAGE_UPLOAD_SUCCESS)
        })
      }
      case 'error': {
        return message.error(MESSAGE_UPLOAD_FAILURE)
      }
      default: {
        break
      }
    }
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const { upload, uploadConfig } = this.props

    const defaultProps = {}

    if (uploadConfig) {
      const { url, token } = uploadConfig
      defaultProps.url = url
      defaultProps.token = token
    }

    return (
      <div>
        <Upload
          listType='picture-card'
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          {...defaultProps}
          {...upload}
        >
          {
            (fileList && fileList.length >= 3) ?
            null :
            <div>
              <Icon type='plus' />
              <div className='ant-upload-text'>Upload</div>
            </div>
          }
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt='example' style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

Images.propTypes = {
  name: PropTypes.string.isRequired,
  upload: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    src: PropTypes.string.isRequired,
  })),
  uploadConfig: PropTypes.shape({
    url: PropTypes.string.isRequired,
    token: PropTypes.string,
  }),
}

Images.defaultProps = {
  value: undefined,
  uploadConfig: undefined,
}

export default Images
