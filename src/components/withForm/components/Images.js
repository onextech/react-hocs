// @flow
import * as React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal } from 'antd'
// $FlowFixMe
import styled from 'styled-components'

const Wrapper = styled.div`
  // Fix issue where thumbnail does not take up full height
  .ant-upload-list-item-info > span {
    height: 100%;
  }
`

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

type ResponseType = {
  ok: boolean,
  src: string,
  path: string,
}

type ValueType = Array<{
  id: number,
  src: string,
  path: string,
}>

type FileListType = Array<{
  response?: ResponseType
}>

type FileType = {
  id: number,
  path: string,
  src: string,
  status: 'loading' | 'done' | 'error' | 'removed',
  uid: number,
  url: string,
}

/**
 * Convert form `value` to `fileList` component prop
 * @param {[{}]} value
 * @return
 */
const valueToFileList = (value: ValueType) => {
  return value && Array.isArray(value) && value.map(({ id, src, path }) => {
    return {
      uid: id,
      status: 'done',
      url: src,
      // Return default values for update
      id,
      src,
      path,
    }
  })
}

/**
 * Convert `fileList` component prop to form `value`
 * @param {[{}]} fileList
 * @return {any[]}
 */
const fileListToValue = (fileList: FileListType) => {
  return fileList.map((file, i) => {
    const { response }: { response?: ResponseType } = file
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

  updateForm = (fileList: FileListType, e?: Event | null = null) => {
    const { name, onChange: handleChange } = this.props
    const nextValue = fileListToValue(fileList)
    return handleChange(e, { name, value: nextValue })
  }

  handleChange = (data: { file: Object, fileList: Object, event: Event }) => {
    const { file, fileList, event: e } = data
    const { status } = file

    if (status === 'done') {
      const { fileList } = this.state
      this.updateForm(fileList, e)
    }

    // $FlowFixMe Required to set the component, do not change or condition this
    return this.setState({ fileList })
  }

  handleRemove = (file: FileType) => {
    const { id } = file
    const { fileList: prevFileList } = this.state
    const activeFiles = (file) => file.id !== id
    const nextFileList = prevFileList.filter(activeFiles)
    this.updateForm(nextFileList)
    return this.setState({ fileList: nextFileList })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const { upload, uploadConfig } = this.props

    return (
      <Wrapper>
        <Upload
          listType='picture-card'
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
          {...uploadConfig}
          {...upload}
        >
          <Icon type='plus' />
          <div className='ant-upload-text'>Upload</div>
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt='example' style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Wrapper>
    )
  }
}

Images.propTypes = {
  name: PropTypes.string.isRequired,
  upload: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      src: PropTypes.string.isRequired,
    })),
    PropTypes.string,
  ]),
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
