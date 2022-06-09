import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {
  Typography,
  Modal,
  message,
  Button,
  Alert,
  Form,
  Input,
  Space,
  Steps,
} from 'antd';

import {
  resetAllFromDesignAutomation,
  usePostJsonCheckDoorsFormDataToServerMutation,
} from '../../../../../../../../../slices/designAutomation/designAutomationSlice';
import {selectIdFromDA} from '../../../../../../../../../slices/designAutomation/selectors';

import RefreshToGetJsonData from './RefreshToGetJsonData';
import {selectIsLoadingJsonCheckDoorsDataFromFsCheckDoors} from '../../../../../../../../../slices/forgeStandard/checkDoors';
import {resetAllFromForgeViewerSlice} from '../../../../../../../../../slices/forgeViewer';
import {
  resetAllFromOssSlice,
  ossApi,
} from '../../../../../../../../../slices/oss';

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

const handleOnSendToGetCheckStandardData = async (formObject, callback) => {
  try {
    const formValues = await formObject?.validateFields();
    callback(formValues);
  } catch (error) {
    console.log(error);
  }
};

export default function FormCheckDoors() {
  const [designIdCheckDoors, setDesignIdCheckDoors] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingJsonCheckDoorsData, setIsLoadingJsonCheckDoorsData] =
    useState(false);
  const [step, setStep] = useState(0);

  // const [formDataToUpload, setFormDataToUpload] = useState(null);

  const [form] = Form.useForm();
  // ==========================================================================
  // Needed to post to server...
  // ==========================================================================
  const designInfoId = useSelector(selectIdFromDA);
  const isLoadingJsonCheckDoorsDataFromFsCheckDoors = useSelector(
    selectIsLoadingJsonCheckDoorsDataFromFsCheckDoors,
  );

  const [postJsonCheckDoorsFormDataToServer, {isError, isSuccess}] =
    usePostJsonCheckDoorsFormDataToServerMutation();

  const dispatch = useDispatch();

  // TODO: Get data from server (save Design Id) to get data.
  /**
   * After successfully sent data to server, Make a pull request
   * 15 seconds / request to get json data from server.
   * ============================================================
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
        // =======================================================
        // close form
        // =======================================================
        // setIsOpen(false);
        console.log('from FormCheckDoors', jsonString);
        console.log('from postJsonCheckDoorsFormDataToServer', data);
        const response = await postJsonCheckDoorsFormDataToServer(
          data,
        ).unwrap();

        // =======================================================
        // Set design id check door for Refresh components
        // =======================================================
        setDesignIdCheckDoors(response?.result.id);
        setIsLoadingJsonCheckDoorsData(true);
        setStep(1);
      } catch (error) {
        console.log(error);
      }
    },
    [designInfoId],
  );

  const handleOnDone = useCallback(() => {
    dispatch(resetAllFromOssSlice());
    dispatch(resetAllFromForgeViewerSlice());
    dispatch(ossApi.endpoints.getOssBuckets.initiate()).refetch();
    setIsOpen(false);
  }, []);

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

  useEffect(async () => {
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

      // dispatch(resetAllFromOssSlice());
      // dispatch(resetAllFromForgeViewerSlice());
      // dispatch(ossApi.endpoints.getOssBuckets.initiate()).refetch();
      // dispatch(resetAllFromDesignAutomation());
    }
  }, [isError, isSuccess]);

  useEffect(() => {
    if (!isLoadingJsonCheckDoorsDataFromFsCheckDoors) {
      setStep(2);
    }
  }, [isLoadingJsonCheckDoorsDataFromFsCheckDoors]);

  return (
    <>
      <ButtonShowCheckDoorsForm onOpen={handleOnOpen} title='Add check doors' />

      <Modal
        centered
        visible={isOpen}
        onCancel={handleOnCancel}
        onOk={() => {
          if (step !== 2) {
            return handleOnSendToGetCheckStandardData(form, handleOnSend);
          }
          return handleOnDone();
        }}
        okText={step !== 2 ? <span>Send</span> : <span>Done</span>}
        width='600px'
        bodyStyle={{height: 'auto', width: '100%'}}
        maskClosable={false}
        title={[
          <Text key='check-doors' style={{fontSize: '20px', fontWeight: '300'}}>
            Check doors
          </Text>,
        ]}
      >
        <Space
          direction='vertical'
          size={[0, 16]}
          align='center'
          style={{width: '100%'}}
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
            style={{width: '400px'}}
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
              rules={[
                {required: true, message: 'Please input Epsilon center!'},
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
          <Steps size='small' current={step} style={{width: '450px'}}>
            <Steps.Step title='Enter Inputs' />
            <Steps.Step
              title='In Progress'
              icon={
                isLoadingJsonCheckDoorsDataFromFsCheckDoors &&
                isLoadingJsonCheckDoorsData ? (
                  <RefreshToGetJsonData
                    designInfoId={designIdCheckDoors}
                    interval={15000}
                  />
                ) : null
              }
            />
            <Steps.Step title='Finish' />
          </Steps>
        </Space>
      </Modal>
    </>
  );
}

/*
eslint
  dot-notation: 0
*/
