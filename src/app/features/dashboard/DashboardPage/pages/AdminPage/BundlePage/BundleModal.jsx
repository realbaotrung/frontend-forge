/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Button, Form, Modal, Input, Upload, Select, Spin} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {
  getVersionRevit,
  postBundle,
  putBundle,
  selectVersion,
  selectSuccess,
} from '../../../../../../slices/bundle/bundleSlice';
import {
  getBundleCategory,
  selectBundleCategory,
} from '../../../../../../slices/bundleCategory/bundleCategorySlice';

export default function BundleModal({resetEditing, isEditing, editingBundle}) {
  const [form] = Form.useForm();
  const [uploadFile, setUploadFile] = useState();
  const dispatch = useDispatch();

  const bundleCategories = useSelector(selectBundleCategory);
  const versionrevits = useSelector(selectVersion);
  const isSuccess = useSelector(selectSuccess);

  useEffect(() => {
    dispatch(getBundleCategory());
  }, []);

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(editingBundle);
  }, [editingBundle]);

  useEffect(() => {
    dispatch(getVersionRevit());
    dispatch(getBundleCategory());
  }, []);

  useEffect(() => {
    if(isSuccess) {
      resetEditing(true)
    }
  }, [isSuccess]);

  const onFinish = (value) => {
    const formData = new FormData();
    formData.append('Description', value.description);
    formData.append('VersionRevit', value.versionRevit);
    formData.append('BundleCategoryId', value.bundleCategoryId);
    if(uploadFile) {
      formData.append('File', uploadFile);
    }
    if (editingBundle.id === undefined) {
      dispatch(postBundle(formData));
    } else {
      dispatch(putBundle({data: formData, id: editingBundle.id}));
    }
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
      getContainer={false} 
      onCancel={() => {
        resetEditing();
      }} 
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onFinish(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form} 
        name='basic'
        labelCol={{span: 8}}
        wrapperCol={{span: 16}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed} 
        initialValues={{
          description : editingBundle?.description,
          bundleCategoryId :editingBundle?.bundleCategoryId,
          versionRevit: editingBundle?.versionRevit
        }}
        autoComplete='off'
      >
        <Form.Item
          label='Description'
          name='description' 
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
          <Select >
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
        </Form.Item>

        {/* <Form.Item wrapperCol={{offset: 8, span: 16}}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item> */}
      </Form>
    </Modal>
  );
}
