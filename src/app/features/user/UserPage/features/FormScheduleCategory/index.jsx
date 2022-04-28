import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Button as CButton, useDisclosure} from '@chakra-ui/react';
import {Typography, Space, Modal, message, Button} from 'antd';
import TransferProperties from './features/TransferProperties';
import CategorySelector from './features/CategorySelector';
import {category} from '../../share/category';
import {
  getCategoryNames,
  getCategoryValuesByKeyName,
  getJsonCategoryData,
  getJsonFinalCategoryDataToUpload,
  resetFormScheduleCategory, usePostJsonFinalCategoryDataToServerMutation
} from '../../../../../slices/designAutomation/designAutomationSlice';
import {
  checkboxSheetFromDA,
  inputScheduleNameFromDA,
  selectCategoryKeyNameFromDA,
  selectCategoryNamesFromDA, selectIdFromDA,
  selectJsonCategoryDataFromDA, selectJsonFinalCategoryDataToUploadFromDA,
  selectJsonTargetCategoryDataFromDA
} from '../../../../../slices/designAutomation/selectors';

const {Text} = Typography;

function ButtonShowCategoryForm({title, onOpen}) {
  return (
    <CButton
      onClick={onOpen}
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
  onOpen: PropTypes.func.isRequired,
};

export default function FormScheduleCategory() {
  const {onClose, onOpen, isOpen} = useDisclosure();
  const categoryNames = useSelector(selectCategoryNamesFromDA);
  const categoryKeyName = useSelector(selectCategoryKeyNameFromDA);
  let scheduleName = useSelector(inputScheduleNameFromDA);
  let isSheet = useSelector(checkboxSheetFromDA);
  const jsonCategoryData = useSelector(selectJsonCategoryDataFromDA);
  const jsonTargetCategoryData = useSelector(selectJsonTargetCategoryDataFromDA);
  const jsonFinalCategoryDataToUpload = useSelector(selectJsonFinalCategoryDataToUploadFromDA);

  const designInfoId = useSelector(selectIdFromDA);
  const [postJsonFinalCategoryDataToServer, {isError, isSuccess}] = usePostJsonFinalCategoryDataToServerMutation();

  const dispatch = useDispatch();

  // TODO: Should Use component RefreshToShowLoadingAndJsonData to get Data (10s per Request)
  // TODO: should delete when connect again to Server...
  useEffect(() => {
    if (!jsonCategoryData) {
      dispatch(getJsonCategoryData(category));
    }
  }, [jsonCategoryData])

  useEffect(() => {
    if (!categoryNames && jsonCategoryData) {
      dispatch(getCategoryNames(Object.keys(jsonCategoryData)))
    }
  }, [categoryNames, jsonCategoryData])

  useEffect(() => {
    if (categoryKeyName && jsonCategoryData) {
      dispatch(getCategoryValuesByKeyName(jsonCategoryData[categoryKeyName]))
    }
  }, [categoryKeyName, jsonCategoryData])

  useEffect(() => {
    if (jsonTargetCategoryData) {
      if(scheduleName === undefined){
        scheduleName = '';
      }
      if(isSheet === undefined){
        isSheet = false;
      }
      const scheduleObject = {categoryKeyName, jsonTargetCategoryData, scheduleName, isSheet};
      dispatch(getJsonFinalCategoryDataToUpload(scheduleObject));
    }
  }, [jsonTargetCategoryData])

  const handleOnSend = useCallback(async() => {
    onClose();

    if (jsonFinalCategoryDataToUpload) {
      try {
        debugger;
        const jsonString = JSON.stringify(jsonFinalCategoryDataToUpload);
        const data = {
          "designInfoId": designInfoId,
          "clientId": "randomClientId",
          "data": jsonString
        }
        console.log('data', data);
        await postJsonFinalCategoryDataToServer(data).unwrap().then(() => {
          dispatch(resetFormScheduleCategory());
        });
      } catch (error) {
        console.log(error)
      }
    }
  }, [jsonFinalCategoryDataToUpload]);

  const handleOnCancel = () => {
    dispatch(resetFormScheduleCategory());
    onClose();
  };

  const handleCheckVisibleButton = () =>{
    if(categoryKeyName && jsonTargetCategoryData?.length >0){
      return "";
    }
    return "disabled";
  };
  useEffect(() => {
    if (isError) {
      message.error("Fail to send options to server!", 2.5)
    }

    if (isSuccess) {
      message.success("You options were sent successfully!", 2.5)
    }
  }, [isError, isSuccess])

  return (
    <>
      <ButtonShowCategoryForm title='Schedule' onOpen={onOpen}/>
      <Modal
        centered
        visible={isOpen}
        onCancel={() => handleOnCancel()}
        onOk={() => handleOnSend()}
        okText='Send'
        width='600px'
        bodyStyle={{height: 'auto'}}
        title={[
          <Text key='schedule' style={{fontSize: '20px', fontWeight: '300'}}>
            Schedule {scheduleName}
          </Text>
        ]}
        footer={[
          <Button key='buttonCancel' onClick={() => handleOnCancel()}>Cancel</Button>,
          <Button key='buttonSend' type='primary' onClick={() => handleOnSend()} disabled={handleCheckVisibleButton()}>Send</Button>
        ]}
        >
        <Space direction='vertical' size={[0, 16]} align='start'>
          <CategorySelector/>
          <TransferProperties/>
        </Space>
      </Modal>
    </>
  );
}
