import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Button as CButton} from '@chakra-ui/react';
import {Typography, Space, Modal, message, Button, Alert} from 'antd';
import TransferProperties from './features/TransferProperties';
import CategoryNameHandler from './features/CategoryNameHandler';
import {
  setCategoryNames,
  setCategoryValuesByKeyName,
  setJsonScheduleData,
  setJsonFinalCategoryDataToUpload,
  resetFormScheduleCategory,
  usePostJsonScheduleFormDataToServerMutation,
  setCategoryData,
  resetAllFromDesignAutomation,
} from '../../../../../../../../../slices/designAutomation/designAutomationSlice';
import {
  selectIsSheetFromDA,
  selectScheduleNameFromDA,
  selectCategoryKeyNameFromDA,
  selectCategoryNamesFromDA,
  selectIdFromDA,
  selectJsonDataFromServerFromDA,
  selectJsonFinalCategoryDataToUploadFromDA,
  selectJsonTargetCategoryDataFromDA,
  selectCategoryDataFromDA,
} from '../../../../../../../../../slices/designAutomation/selectors';
import './formScheduleCategory.css';
import {categoryInfo} from '../../../../../../share/categoryInfo';
import ScheduleNameHandler from './features/ScheduleNameHandler';
import SheetNameHandler from './features/SheetNameHandler';
import {
  ossApi,
  resetAllFromOssSlice,
} from '../../../../../../../../../slices/oss/ossSlice';
import {resetAllFromForgeViewerSlice} from '../../../../../../../../../slices/forgeViewer/forgeViewerSlice';

const {Text} = Typography;

function ButtonShowCategoryForm({title, onOpen}) {
  return (
    <Button
      onClick={onOpen}
      type='ghost'
    >
      {title}
    </Button>
  );
}

ButtonShowCategoryForm.propTypes = {
  title: PropTypes.string.isRequired,
  onOpen: PropTypes.func.isRequired,
};

export default function FormScheduleCategory() {
  const [isOpen, setIsOpen] = useState(false)

  const jsonScheduleData = useSelector(selectJsonDataFromServerFromDA);
  const categoryData = useSelector(selectCategoryDataFromDA);
  const categoryNames = useSelector(selectCategoryNamesFromDA);
  const categoryKeyName = useSelector(selectCategoryKeyNameFromDA);
  const scheduleName = useSelector(selectScheduleNameFromDA);
  const isSheet = useSelector(selectIsSheetFromDA);
  const jsonTargetCategoryData = useSelector(
    selectJsonTargetCategoryDataFromDA,
  );
  const jsonFinalCategoryDataToUpload = useSelector(
    selectJsonFinalCategoryDataToUploadFromDA,
  );

  const designInfoId = useSelector(selectIdFromDA);
  const [postJsonScheduleFormDataToServer, {isError, isSuccess}] =
    usePostJsonScheduleFormDataToServerMutation();

  const dispatch = useDispatch();

  // TODO: should delete when connect again to Server...
  // useEffect(() => {
  //   if (!jsonScheduleData) {
  //     dispatch(setJsonScheduleData(categoryInfo));
  //   }
  // }, [jsonScheduleData]);

  useEffect(() => {
    if (!categoryData && jsonScheduleData) {
      dispatch(setCategoryData(jsonScheduleData['DataCategory']));
    }
  }, [categoryData, jsonScheduleData]);

  useEffect(() => {
    if (!categoryNames && categoryData) {
      dispatch(setCategoryNames(Object.keys(categoryData)));
    }
  }, [categoryNames, categoryData]);

  useEffect(() => {
    if (categoryKeyName && categoryData) {
      dispatch(setCategoryValuesByKeyName(categoryData[categoryKeyName]));
    }
  }, [categoryKeyName, categoryData]);

  useEffect(() => {
    if (jsonTargetCategoryData && scheduleName && isSheet) {
      const scheduleObject = {
        categoryKeyName,
        jsonTargetCategoryData,
        scheduleName,
        isSheet,
      };
      console.log('scheduleObject: ', scheduleObject);
      dispatch(setJsonFinalCategoryDataToUpload(scheduleObject));
    }
  }, [jsonTargetCategoryData, scheduleName, isSheet]);

  const handleOnSend = useCallback(async () => {
    if (jsonFinalCategoryDataToUpload) {
      try {
        const jsonString = JSON.stringify(jsonFinalCategoryDataToUpload);
        const data = {
          designInfoId,
          clientId: 'randomClientId',
          data: jsonString,
        };
        setIsOpen(false);
        console.log('from FormScheduleCategory', jsonString);
        console.log('from postJsonFinalCategoryDataToServer', data);
        await postJsonScheduleFormDataToServer(data)
          .unwrap()
          .then(() => {
            dispatch(resetFormScheduleCategory());
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [jsonFinalCategoryDataToUpload]);

  const handleOnCancel = useCallback(() => {
    dispatch(resetFormScheduleCategory());
    setIsOpen(false);
  }, []);

  const handleOnOpen = useCallback(() => {
    setIsOpen(true);
  }, [isOpen])

  const isVisibleButton = useCallback(() => {
    if (categoryKeyName && jsonTargetCategoryData) {
      return false;
    }
    return true;
  }, [categoryKeyName, jsonTargetCategoryData]);

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
      <ButtonShowCategoryForm title='Add schedule' onOpen={handleOnOpen}/>

      <Modal
        centered
        visible={isOpen}
        onCancel={handleOnCancel}
        onOk={handleOnSend}
        okText='Send'
        width='600px'
        bodyStyle={{height: 'auto'}}
        maskClosable={false}
        title={[
          <Text key='schedule' style={{fontSize: '20px', fontWeight: '300'}}>
            Schedule
          </Text>,
        ]}
        footer={[
          <Button key='buttonCancel' onClick={handleOnCancel}>
            Cancel
          </Button>,
          <Button
            key='buttonSend'
            type='primary'
            onClick={handleOnSend}
            disabled={isVisibleButton()}
          >
            Send
          </Button>,
        ]}
      >
        <Space direction='vertical' size={[0, 16]} align='start'>
          <div
            style={{
              width: '254px',
              display: 'flex',
              flexFlow: 'column',
              gap: '8px 0',
            }}
          >
            <CategoryNameHandler />
            <ScheduleNameHandler />
            <SheetNameHandler />
          </div>
          <TransferProperties />
        </Space>
      </Modal>
    </>
  );
}

/*
eslint
  dot-notation: 0
*/
