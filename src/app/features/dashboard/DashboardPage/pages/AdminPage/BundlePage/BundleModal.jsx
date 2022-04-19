/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Button, Form, Modal, Input, Upload, Select, Spin} from 'antd';
import {FastBackwardFilled, UploadOutlined} from '@ant-design/icons';
import {
  addBundle,
  getVersionRevit,
  postBundle,
  selectVersion,
  selectLoading,
} from '../../../../../../slices/bundle/bundleSlice';
import {
  getBundleCategory,
  selectBundleCategory,
} from '../../../../../../slices/bundleCategory/bundleCategorySlice';

export default function BundleModal({
  resetEditing,
  isEditing,
  editingStudent,
  closeModal,
}) {
  const [revitVerions, setRevitVerions] = useState([]);

  const [uploadFile, setUploadFile] = useState();
  const dispatch = useDispatch();

  const bundleCategories = useSelector(selectBundleCategory);
  const versionrevits = useSelector(selectVersion);
  const isLoading = useSelector(selectLoading);

  useEffect(() => {
    dispatch(getBundleCategory());
    dispatch(getVersionRevit());
  }, []);

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append('Description', values.description);
    formData.append('VersionRevit', values.versionRevit);
    formData.append('BundleCategoryId', values.bundleCategoryId);
    formData.append('File', uploadFile);
    dispatch(postBundle(formData));
    closeModal(true);
  };
  const onFinishFailed = (errorInfo) => {};

  useEffect(() => {
    dispatch(getBundleCategory());
    dispatch(getVersionRevit());
  }, [isLoading]);

  const props = {
    onRemove: (file) => {
      setUploadFile(null);
    },
    beforeUpload: (file) => {
      return false;
    },
  };

  return (
    
      <Modal
        title={editingStudent != null ? 'Edit' : 'Add'}
        visible={isEditing}
        okText='Save'
        onCancel={() => {
          resetEditing();
        }}
      >
        <Form
          name='basic'
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          initialValues={{remember: true}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            label='Description'
            name='description'
            value={editingStudent?.Description}
            rules={[{required: true, message: 'Please input Description!'}]}
          >
            <Input />
          </Form.Item>

          <Form.Item label='Bundle Category' name='bundleCategoryId'>
            <Select>
              {bundleCategories?.result.map((value) => {
                return (
                  <Select.Option key={value.id} value={value.id}>
                    {value.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item label='Version Revit' name='versionRevit'>
            <Select>
              {versionrevits?.result?.map((value) => {
                return (
                  <Select.Option key={value} value={value}>
                    {value}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item>
            <Upload {...props} onChange={(e) => setUploadFile(e.file)}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {/* <input
              type="file"
              onChange={(e) => setUploadFile(e.target.files[0])}
            /> */}
          </Form.Item>
          <Form.Item wrapperCol={{offset: 8, span: 16}}>
              <Button type='primary' htmlType='submit'>
                Submit
              </Button>
          </Form.Item>
        </Form>
      </Modal>
    
  );
}
