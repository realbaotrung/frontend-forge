/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Form, Modal, Input, Select} from 'antd';
import {
  postBundleCategory, putBundleCategory, selectSuccess
} from "../../../../../../slices/bundleCategory/bundleCategorySlice";

export default function BundleCategoryModal({
  resetEditing,
  isEditing,
  editingCategory,
}) {

  const dispatch = useDispatch();
  const isSuccess = useSelector(selectSuccess);

  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(editingCategory);
  }, [editingCategory]);

  const onFinish = (values) => {
    // form.resetFields();
    if(editingCategory.id !== undefined){
      dispatch(putBundleCategory({data: {Name: values.Name}, id: editingCategory.id}))
    }
    else {
      dispatch(postBundleCategory(values));
    }
  };

  useEffect(() => {
    if(isSuccess) {
      resetEditing(true)
    }
  }, [isSuccess]);

  const onFinishFailed = (errorInfo) => {};

  const typeCategory = [
    {
      id: 1 ,
      name: "base"
    },
    {
      id: 2,
      name: "function"
    }
  ]

  return (
      <Modal
        forceRender 
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
        title={editingCategory != null ? 'Edit' : 'Add'}
        visible={isEditing}
        okText='Save'
        onCancel={() => {
          resetEditing();
        }
      }
      >
        <Form
          initialValues={{
            Name: editingCategory?.name,
            Type: editingCategory?.type
          }}
          form={form}
          name='basic'
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off' 
        >
          <Form.Item
            label='Name'
            name='Name'
            rules={[{required: true, message: 'Please enter name!'}]}
          >
          <Input />
          </Form.Item>
          <Form.Item label='Type' name='Type' rules={[{required: true, message: 'Please select Type!'}]}>
            <Select>
              {typeCategory.map((value) => {
                return (
                  <Select.Option key={value.id} value={value.id}>
                    {value.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
  );
}
