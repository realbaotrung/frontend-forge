/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Button, Form, Modal, Input, Switch, Space} from 'antd';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {
  postCheckStandard,
  putCheckStandard,
  selectSuccess,
} from '../../../../slices/checkStandard/checkStandardSlice';
import './style.css';

export default function CheckStandardForm({
  resetEditing,
  isEditing,
  editingStandard,
  isView,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isSuccess = useSelector(selectSuccess);

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(editingStandard);
  }, [editingStandard]);

  const onFinish = (values) => {
    // luu y truong hop check nay
    // xem xet su thay doi trong tuong lai
    if (editingStandard.id === undefined) {
      dispatch(postCheckStandard({...values, status: Number(values.status)}));
    } else {
      dispatch(
        putCheckStandard({
          data: {...values, status: Number(values.status)},
          id: editingStandard.id,
        }),
      );
      console.log(values);
    }
  };
  // let visiable = true
  useEffect(() => {
    if (isSuccess) {
      resetEditing(true);
    }
  }, [isSuccess]);
  // const onFinishFailed = (errorInfo) => {};
  const htmlForm = (
    <Form
      form={form}
      name='basic'
      labelCol={{span: 0}}
      wrapperCol={{span: 19}}
      onFinish={onFinish}
      // onFinishFailed={onFinishFailed}
      initialValues={{
        name: editingStandard?.name,
        description: editingStandard?.description,
        status: editingStandard?.status,
        rules: JSON.parse(
          editingStandard?.value === undefined ? null : editingStandard?.value,
        ),
      }}
      autoComplete='off'
    >
      <Form.Item
        label='Name '
        name='name'
        rules={[{required: true, message: 'Please input name!'}]}
      >
        <Input style={{marginLeft: '33px'}} />
      </Form.Item>

      <Form.Item
        label='Description'
        name='description'
        rules={[{required: true, message: 'Please input Description!'}]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        style={{paddingLeft: '11px'}}
        label='Status'
        name='status'
        value={editingStandard?.status}
      >
        <Switch
          name='status'
          style={{marginLeft: '35px'}}
          defaultChecked={!!editingStandard?.status}
        />
      </Form.Item>
      <div className='custom-list-field'>
        <Form.List name='rules'>
          {(fields, {add, remove}) => (
            <>
              {fields.map(({key, name, ...restField}) => (
                <Space
                  key={key}
                  style={{display: 'flex', justifyContent: 'center'}}
                  align='baseline'
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'RuleName']}
                    rules={[
                      {
                        required: true,
                        message: 'Missing name',
                      },
                    ]}
                  >
                    <Input placeholder='Rule name' style={{width: '210px'}} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'RuleValue']}
                    rules={[
                      {
                        required: true,
                        message: 'Missing value',
                      },
                    ]}
                  >
                    <Input placeholder='Rule value' style={{width: '210px'}} />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
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
      </div>
    </Form>
  );
  let htmlModal = (
    <Modal
      style={{top: '40px'}}
      title={editingStandard.id === undefined ? 'Add' : 'Edit'}
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
      {htmlForm}
    </Modal>
  );
  if (isView) {
    htmlModal = (
      <Modal
        style={{top: '40px'}}
        title='View'
        visible={isEditing}
        forceRender
        onCancel={() => {
          resetEditing();
        }}
        footer={null}
      >
        {htmlForm}
      </Modal>
    );
  }
  return htmlModal;
}
