// @flow
import * as React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal } from 'antd'

type ValueType = Array<{
  id: number,
  src: string,
}>

type PropsType = {
  name: string,
  onChange: Function,
  value?: Array<Object>,
  upload?: Object,
  uploadConfig?: Object,
}

type StateType = {
  previewVisible: boolean,
  previewImage: string,
  fileList: Array<Object>,
}

const valueToFileList = (value: ValueType) => {
  return value && Array.isArray(value) && value.map(({ id, src }) => {
    return {
      uid: id,
      status: 'done',
      url: src,
      // Return default values for update
      id,
      src,
    }
  })
}

const fileListToValue = (fileList: Array<{ response?: Object }>) => {
  return fileList.map((file, i) => {
    const { response } = file
    const isUploadSuccess = response && response.ok
    // Not nextFile because literally this is a new file to append.
    const newFile = {
      ...response,
      // random number for component-consumption only
      id: i + (fileList.length - 1),
    }
    return isUploadSuccess ? newFile : file
  })
}

class Images extends React.Component<PropsType, StateType> {
  state: StateType = {
    previewVisible: false,
    previewImage: '',
    // $FlowFixMe
    fileList: valueToFileList(this.props.value),
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file: { url: string, thumbUrl: string }) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleChange = (data: { file: Object, fileList: Object, event: Event}) => {
    const { file, fileList, event: e } = data
    const { name, onChange: handleChange } = this.props
    const { status } = file

    if (status === 'done') {
      const { fileList } = this.state
      handleChange(e, {
        name,
        value: fileListToValue(fileList),
      })
    }

    // $FlowFixMe Required to set the component, do not change or condition this
    return this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const { upload, uploadConfig } = this.props

    return (
      <div>
        <Upload
          listType='picture-card'
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          {...uploadConfig}
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
    action: PropTypes.string.isRequired, // upload url
    headers: PropTypes.shape({
      Authorization: PropTypes.string, // user token
    }).isRequired,
  }),
}

// $FlowFixMe
Images.defaultProps = {
  value: undefined,
  uploadConfig: undefined,
}

export default Images
