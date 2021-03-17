/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable arrow-body-style */
/* eslint-disable object-curly-newline */
/* eslint-disable no-param-reassign */
/* eslint-disable react/state-in-constructor */
/* eslint-disable arrow-parens */
import React from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { reqDeleteImg } from '../../../../api';
import { BASE_IMG_URL } from '../../../../utils/constants';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  constructor(props) {
    super(props);
    let fileList = [];
    const { imgs } = this.props;

    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_URL + img,
      }));
    }

    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList,
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  getImgs = () => {
    return this.state.fileList.map(file => file.name);
  }

  handleChange = async ({ file, fileList }) => {
    // image uploaded successfully
    if (file.status === 'done') {
      const result = file.response;
      if (result.status === 0) {
        message.success('Uploaded picture successfully');
        const { name, url } = result.data;
        file = fileList[fileList.length - 1];
        file.name = name;
        file.url = url;
      } else {
        message.error('Image upload failed');
      }
    } else if (file.status === 'removed') {
      // remove image from the server'
      const result = await reqDeleteImg(file.name);
      if (result.status === 0) {
        message.success('image deleted successfully');
      } else {
        message.error('image deleted failed');
      }
    }

    this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action="/manage/img/add"
          accept="image/*"
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
