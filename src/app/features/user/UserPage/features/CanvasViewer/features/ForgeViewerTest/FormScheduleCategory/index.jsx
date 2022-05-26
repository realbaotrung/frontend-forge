import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Typography, Space, Modal, message, Button, Alert} from 'antd';
import TransferProperties from './features/TransferProperties';
import CategoryNameHandler from './features/CategoryNameHandler';
import {
  setCategoryNames,
  setCategoryValuesByKeyName,
  setJsonScheduleData,
  setJsonFinalCategoryDataToUpload,
  resetFormScheduleCategory,
  setIsOpenFormScheduleCategory,
  usePostJsonFinalDataToServerMutation,
  setCategoryData,
  resetAllFromDesignAutomation,
  selectIsSheetFromDA,
  selectScheduleNameFromDA,
  selectCategoryKeyNameFromDA,
  selectCategoryNamesFromDA,
  selectIdFromDA,
  selectJsonDataFromServerFromDA,
  selectJsonFinalCategoryDataToUploadFromDA,
  selectJsonTargetCategoryDataFromDA,
  selectIsOpenFormScheduleCategoryFromDA,
  selectCategoryDataFromDA,
  setIsOpenFormCheckDoors,
} from '../../../../../../../../slices/designAutomation';
import './formScheduleCategory.css';
import ScheduleNameHandler from './features/ScheduleNameHandler';
import SheetNameHandler from './features/SheetNameHandler';

import {ossApi, resetAllFromOssSlice} from '../../../../../../../../slices/oss';
import {resetAllFromForgeViewerSlice} from '../../../../../../../../slices/forgeViewer';

const {Text} = Typography;

export function ButtonShowCheckDoorsForm({title}) {
  const dispatch = useDispatch();
  return (
    <Button onClick={() => dispatch(setIsOpenFormCheckDoors(true))}>
      {title}
    </Button>
  );
}

ButtonShowCheckDoorsForm.propTypes = {
  title: PropTypes.string.isRequired,
};

export default function FormCheckDoors() {
  const jsonDataFromServer = useSelector(selectJsonDataFromServerFromDA);
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
  const isOpenFormScheduleCategory = useSelector(
    selectIsOpenFormScheduleCategoryFromDA,
  );

  const designInfoId = useSelector(selectIdFromDA);
  const [postJsonFinalCategoryDataToServer, {isError, isSuccess}] =
    usePostJsonFinalDataToServerMutation();

  const dispatch = useDispatch();

  // TODO: should delete when connect again to Server...
  // useEffect(() => {
  //   if (!jsonScheduleData) {
  //     dispatch(setJsonScheduleData(categoryInfo));
  //   }
  // }, [jsonScheduleData]);

  useEffect(() => {
    if (!categoryData && jsonDataFromServer) {
      dispatch(setCategoryData(jsonDataFromServer['DataCategory']));
    }
  }, [categoryData, jsonDataFromServer]);

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
        dispatch(setIsOpenFormScheduleCategory(false));
        console.log('from FormScheduleCategory', jsonString);
        console.log('from postJsonFinalCategoryDataToServer', data);
        await postJsonFinalCategoryDataToServer(data)
          .unwrap()
          .then(() => {
            dispatch(resetFormScheduleCategory());
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [jsonFinalCategoryDataToUpload]);

  const handleOnCancel = () => {
    dispatch(resetFormScheduleCategory());
    dispatch(setIsOpenFormScheduleCategory(false));
  };

  const isVisibleButton = () => {
    if (categoryKeyName && jsonTargetCategoryData) {
      return false;
    }
    return true;
  };

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
    <div>
      <Modal
        centered
        visible={isOpenFormScheduleCategory}
        onCancel={() => handleOnCancel()}
        onOk={() => handleOnSend()}
        okText='Send'
        width='600px'
        bodyStyle={{height: 'auto'}}
        title={[
          <Text key='schedule' style={{fontSize: '20px', fontWeight: '300'}}>
            Schedule
          </Text>,
        ]}
        footer={[
          <Button key='buttonCancel' onClick={() => handleOnCancel()}>
            Cancel
          </Button>,
          <Button
            key='buttonSend'
            type='primary'
            onClick={() => handleOnSend()}
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
    </div>
  );
}

/*
eslint
  dot-notation: 0
*/
