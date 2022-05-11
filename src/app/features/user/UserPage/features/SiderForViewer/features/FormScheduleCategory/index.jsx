import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Button as CButton} from '@chakra-ui/react';
import {Typography, Space, Modal, message, Button, Alert} from 'antd';
import TransferProperties from './features/TransferProperties';
import CategorySelector from './features/CategorySelector';
import {
  getCategoryNames,
  getCategoryValuesByKeyName,
  getJsonScheduleData,
  getJsonFinalCategoryDataToUpload,
  resetFormScheduleCategory,
  setIsOpenFormScheduleCategory,
  usePostJsonFinalCategoryDataToServerMutation,
  getCategoryData,
} from '../../../../../../../slices/designAutomation/designAutomationSlice';
import {
  selectIsSheetFromDA,
  selectScheduleNameFromDA,
  selectCategoryKeyNameFromDA,
  selectCategoryNamesFromDA,
  selectIdFromDA,
  selectJsonScheduleDataFromDA,
  selectJsonFinalCategoryDataToUploadFromDA,
  selectJsonTargetCategoryDataFromDA,
  selectIsOpenFormScheduleCategoryFromDA,
  selectCategoryDataFromDA,
} from '../../../../../../../slices/designAutomation/selectors';
import './formScheduleCategory.css';
import {categoryInfo} from '../../../../share/categoryInfo'

const {Text} = Typography;

function ButtonShowCategoryForm({title}) {
  const dispatch = useDispatch();
  return (
    <CButton
      onClick={() => dispatch(setIsOpenFormScheduleCategory(true))}
      variant='primary'
      sx={{
        bg: 'Blue.B400',
        _hover: {
          bg: 'Blue.B300',
          color: 'NeutralLight.N0',
        },
        _active: {
          bg: 'Blue.B400',
        },
        _focus: {
          bg: 'Blue.B400',
        },
      }}
    >
      {title}
    </CButton>
  );
}

ButtonShowCategoryForm.propTypes = {
  title: PropTypes.string.isRequired,
};

export default function FormScheduleCategory() {
  const jsonScheduleData = useSelector(selectJsonScheduleDataFromDA);
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
    usePostJsonFinalCategoryDataToServerMutation();

  const dispatch = useDispatch();

  // TODO: should delete when connect again to Server...
  useEffect(() => {
    if (!jsonScheduleData) {
      dispatch(getJsonScheduleData(categoryInfo));
    }
  }, [jsonScheduleData])

  useEffect(() => {
    if (!categoryData && jsonScheduleData) {
      dispatch(getCategoryData(jsonScheduleData["DataCategory"]));
    }
  }, [categoryData, jsonScheduleData])

  useEffect(() => {
    if (!categoryNames && categoryData) {
      dispatch(getCategoryNames(Object.keys(categoryData)));
    }
  }, [categoryNames, categoryData]);

  useEffect(() => {
    if (categoryKeyName && categoryData) {
      dispatch(getCategoryValuesByKeyName(categoryData[categoryKeyName]));
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
      dispatch(getJsonFinalCategoryDataToUpload(scheduleObject));
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
    }
  }, [isError, isSuccess]);

  return (
    <>
      <ButtonShowCategoryForm title='Schedule' />
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
            Schedule {scheduleName}
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
          <CategorySelector />
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