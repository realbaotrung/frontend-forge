/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Button, Form, Modal, Input, Upload, Select, Spin} from 'antd';
import {FastBackwardFilled, UploadOutlined} from '@ant-design/icons';
import {
  getVersionRevit,
  postBundle,
  putBundle,
  selectVersion,
  selectLoading,
} from '../../../../../../slices/bundle/bundleSlice';
import {
  getBundleCategory,
  selectBundleCategory,
} from '../../../../../../slices/bundleCategory/bundleCategorySlice';
import {
  BundleModel
} from '../../../../../../slices/bundle/bundleModel';

export default function BundleModal({
  resetEditing,
  isEditing,
  editingBundle,
  closeModal,
}) {
  const [form] = Form.useForm();
  const [uploadFile, setUploadFile] = useState();
  const dispatch = useDispatch();

  const bundleCategories = useSelector(selectBundleCategory);
  const versionrevits = useSelector(selectVersion);
  const isLoading = useSelector(selectLoading);


  useEffect(() => {
    dispatch(getBundleCategory());
  }, []);

  useEffect(() => {
    form.setFieldsValue(new BundleModel());
    form.resetFields();
  }, [editingBundle]);


  
  useEffect(() => {
    dispatch(getVersionRevit());
  }, [isEditing]);

  useEffect(() => {
    dispatch(getBundleCategory());
    dispatch(getVersionRevit());
  }, [isLoading]);

  const onFinish = (value) => {
    const formData = new FormData();
    formData.append('Description', value.description);
    formData.append('VersionRevit', value.versionRevit);
    formData.append('BundleCategoryId', value.bundleCategoryId);
    formData.append('File', uploadFile);
    if (value.id !== undefined) {
      dispatch(postBundle(formData));
    } else {
      dispatch(putBundle(formData));
    }
    closeModal(true);
  };
  const onFinishFailed = (errorInfo) => {};

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
      title={editingBundle != null ? 'Edit' : 'Add'}
      visible={isEditing}
      okText='Save'
      onCancel={() => {
        resetEditing();
      }}
    >
      <Form
        form={form}   
        name='basic' 
        initialValues={new BundleModel()}
        labelCol={{span: 8}}
        wrapperCol={{span: 16}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item
          label='Description'
          name='description'
          rules={[{required: true, message: 'Please input Description!'}]}
        >
          <Input defaultValue={editingBundle?.description} />
        </Form.Item>

        <Form.Item label='Bundle Category' name='bundleCategoryId'>
          <Select defaultValue={editingBundle?.bundleCategory?.id}>
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
          <Select defaultValue={editingBundle?.versionRevit}>
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


