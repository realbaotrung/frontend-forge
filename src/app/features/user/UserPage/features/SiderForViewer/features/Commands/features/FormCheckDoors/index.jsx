import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Typography, Modal, message, Button, Alert, Form, Input} from 'antd';

import {
  resetAllFromDesignAutomation,
  usePostJsonCheckDoorsFormDataToServerMutation,
} from '../../../../../../../../../slices/designAutomation/designAutomationSlice';
import {selectIdFromDA} from '../../../../../../../../../slices/designAutomation/selectors';

import {
  ossApi,
  resetAllFromOssSlice,
} from '../../../../../../../../../slices/oss/ossSlice';
import {resetAllFromForgeViewerSlice} from '../../../../../../../../../slices/forgeViewer/forgeViewerSlice';

const {Text} = Typography;

function ButtonShowCheckDoorsForm({title, onOpen}) {
  return (
    <Button onClick={onOpen} type='ghost'>
      {title}
    </Button>
  );
}

ButtonShowCheckDoorsForm.propTypes = {
  onOpen: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

const formItemLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 15},
};

export default function FormCheckDoors() {
  const [isOpen, setIsOpen] = useState(false);
  // const [formDataToUpload, setFormDataToUpload] = useState(null);

  const [form] = Form.useForm();

  // ==========================================================================
  // Needed to post to server...
  // ==========================================================================
  const designInfoId = useSelector(selectIdFromDA);

  const [postJsonCheckDoorsFormDataToServer, {isError, isSuccess}] =
    usePostJsonCheckDoorsFormDataToServerMutation();

  const dispatch = useDispatch();

  // TODO: Get data from server (save Design Id) to get data.
  /**
   * After successfully sent data to server, Make a pull request
   * 15 seconds / request to get json data from server.
   * ===========================================
   * Using getDesignAutomationInfoByIdQuery with (designId)
   */
  const handleOnSend = useCallback(
    async (formDataToUpload) => {
      try {
        const dataToUpload = {
          DataDoor: {
            ...formDataToUpload,
          },
        };
        const jsonString = JSON.stringify(dataToUpload);
        const data = {
          designInfoId,
          clientId: 'randomClientId',
          data: jsonString,
        };
        setIsOpen(false);
        console.log('from FormCheckDoors', jsonString);
        console.log('from postJsonCheckDoorsFormDataToServer', data);
        await postJsonCheckDoorsFormDataToServer(data).unwrap();
      } catch (error) {
        console.log(error);
      }
    },
    [designInfoId],
  );

  const handleOnCancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOnOpen = useCallback(() => {
    setIsOpen(true);
  }, [isOpen]);

  // const isVisibleButton = useCallback(() => {
  //   if (jsonTargetCategoryData) {
  //     return false;
  //   }
  //   return true;
  // }, [jsonTargetCategoryData]);

  useEffect(() => {
    let content;
    if (isError) {
      content = (
        <Alert
          description='Fail to send options to server!'
          type='error'
          closeable
          showIcon
        />
      );
      message.open({
        content,
        duration: 5,
        className: 'my-message',
      });
      dispatch(resetAllFromDesignAutomation());
    }
    if (isSuccess) {
      content = (
        <Alert
          description='You options were sent successfully!'
          type='success'
          closeable
          showIcon
        />
      );
      message.open({
        content,
        duration: 5,
        className: 'my-message',
      });

      dispatch(resetAllFromOssSlice());
      dispatch(resetAllFromForgeViewerSlice());
      dispatch(resetAllFromDesignAutomation());
      dispatch(ossApi.endpoints.getOssBuckets.initiate()).refetch();
    }
  }, [isError, isSuccess]);

  return (
    <>
      <ButtonShowCheckDoorsForm onOpen={handleOnOpen} title='Add check doors' />

      <Modal
        centered
        visible={isOpen}
        onCancel={handleOnCancel}
        onOk={async () => {
          try {
            const value = await form.validateFields();
            handleOnSend(value);
          } catch (error) {
            console.log(error);
          }
        }}
        okText='Send'
        width='400px'
        bodyStyle={{height: 'auto'}}
        maskClosable={false}
        title={[
          <Text key='check-doors' style={{fontSize: '20px', fontWeight: '300'}}>
            Check doors
          </Text>,
        ]}
      >
        <Form
          form={form}
          {...formItemLayout}
          onFinish={handleOnSend}
          initialValues={{
            MaxLength: '5.0',
            EpsilonCenter: '0.5',
          }}
          autoComplete='off'
        >
          <Form.Item
            label='Max length'
            name='MaxLength'
            rules={[{required: true, message: 'Please input Max length!'}]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Epsilon center'
            name='EpsilonCenter'
            rules={[{required: true, message: 'Please input Epsilon center!'}]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

/*
eslint
  dot-notation: 0
*/
