import {Button, useDisclosure} from '@chakra-ui/react';
import {Typography ,Space, Modal} from 'antd';
import PropTypes from 'prop-types';
import TransferProperties from './features/TransferProperties';
import CategorySelector from './features/CategorySelector';

const {Text} = Typography
function ButtonShowCategoryForm({onOpen}) {
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
      Category
    </Button>
  );
}

ButtonShowCategoryForm.propTypes = {
  onOpen: PropTypes.func.isRequired,
};

export default function FormScheduleCategory() {
  const {onClose, onOpen, isOpen} = useDisclosure();

  const handleOnDone = () => {
    onClose();
  };

  return (
    <>
      <ButtonShowCategoryForm onOpen={onOpen} />
      <Modal
        centered
        visible={isOpen}
        onCancel={onClose}
        okText='Done'
        onOk={() => handleOnDone()}
        title={[
          <Text style={{fontSize: '20px', fontWeight: '300'}}>Schedule</Text>
        ]}
        width='600px'
        bodyStyle={{height: '400px'}}
      >
        <Space direction='vertical' size={[0, 16]} align='start'>
          <CategorySelector />
          <TransferProperties />
        </Space>
      </Modal>
    </>
  );
}
