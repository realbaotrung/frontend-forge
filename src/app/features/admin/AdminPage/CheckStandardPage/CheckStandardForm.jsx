/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Button, Form, Modal, Input, Switch, Divider} from 'antd';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {
  getVersionRevit,
  selectSuccess,
} from '../../../../slices/bundle/bundleSlice';
import './style.css';
import {getBundleCategoryAll} from '../../../../slices/bundleCategory/bundleCategorySlice';

export default function CheckStandardForm({
  resetEditing,
  isEditing,
  editingBundle,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isSuccess = useSelector(selectSuccess);

  useEffect(() => {
    dispatch(getBundleCategoryAll());
  }, []);

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(editingBundle);
  }, [editingBundle]);

  useEffect(() => {
    dispatch(getVersionRevit());
    dispatch(getBundleCategoryAll());
  }, []);

  useEffect(() => {
    if (isSuccess) {
      resetEditing(true);
    }
  }, [isSuccess]);

  const onFinish = (values) => {
    console.log(values);
  };
  const onFinishFailed = (errorInfo) => {};

  return (
    <Modal
      title={editingBundle != null ? 'Edit' : 'Add'}
      visible={isEditing}
      okText='Save'
      forceRender
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
        wrapperCol={{span: 15}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          name: '',
          description: '',
          status: true,
        }}
        autoComplete='off'
      >
        <Form.Item
          label='Name '
          name='name'
          rules={[{required: true, message: 'Please input name!'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Description'
          name='description'
          rules={[{required: true, message: 'Please input Description!'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item label='Status' name='status'>
          <Switch defaultChecked />
        </Form.Item>

        <Form.List name='data'>
          {(fields, {add, remove}) => (
            <>
              {fields.map(({key, name, ...restField}) => (
                <div key={key} className='group-custom-field'>
                  <Form.Item
                    {...restField}
                    label='Rule name '
                    name={[name, 'ruleName']}
                    rules={[
                      {
                        required: true,
                        message: 'Missing name',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label='Rule value '
                    name={[name, 'ruleValue']}
                    rules={[
                      {
                        required: true,
                        message: 'Missing value',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <div className='remove-custom-field'>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                  <Divider />
                </div>
              ))}
              <Form.Item
                style={{justifyContent: 'center', textAlign: 'center'}}
              >
                <Button
                  type='dashed'
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Add rule
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
