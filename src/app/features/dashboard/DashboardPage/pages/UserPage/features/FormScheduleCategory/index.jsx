import {useEffect, useMemo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {Button, useDisclosure} from '@chakra-ui/react';
import {Typography, Space, Modal} from 'antd';
import TransferProperties from './features/TransferProperties';
import CategorySelector from './features/CategorySelector';
import { category } from '../../share/category';
import { getCategoryNames, getCategoryValuesByKeyName, getJsonCategoryData, resetDesignAutomationState } from '../../../../../../../slices/designAutomation/designAutomationSlice';
import { selectCategoryKeyNameFromDA, selectCategoryNamesFromDA, selectJsonCategoryDataFromDA } from '../../../../../../../slices/designAutomation/selectors';

const {Text} = Typography;

function ButtonShowCategoryForm({title, onOpen}) {
  return (
    <Button
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
    </Button>
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
  const jsonCategoryData = useSelector(selectJsonCategoryDataFromDA);

  const dispatch = useDispatch();

  // TODO: should delete when connect again to Server...
  useEffect(() => {
    if (!jsonCategoryData)
    dispatch(getJsonCategoryData(category));
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

  const handleOnDone = () => {

    // TODO: create json target file with category name and children
    dispatch(resetDesignAutomationState());
    onClose();
  };

  const handleOnCancel = () => {
    dispatch(resetDesignAutomationState());
    onClose();
  };

  const modalProps = useMemo(() => {
    return {
      centered: true,
      visible: isOpen,
      onCancel: () => handleOnCancel(),
      onOk: () => handleOnDone(),
      okText: 'Done',
      title: [
        <Text key='schedule' style={{fontSize: '20px', fontWeight: '300'}}>
          Schedule
        </Text>,
      ],
      width: '600px',
      bodyStyle: {height: '400px'},
      destroyOnClose: true,
    };
  }, [isOpen, onClose, handleOnDone]);

  return (
    <>
      <ButtonShowCategoryForm title='Schedule' onOpen={onOpen} />
      <Modal {...modalProps}>
        <Space direction='vertical' size={[0, 16]} align='start'>
          <CategorySelector />
          <TransferProperties />
        </Space>
      </Modal>
    </>
  );
}
