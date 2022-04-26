import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, useDisclosure} from '@chakra-ui/react';
import {
  Typography,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Divider
} from 'antd';
import PropTypes from 'prop-types';

import TransferProperties from './features/TransferProperties';
import {
  getProperties,
  selectProperties,
} from "../../../../../../../slices/properties/propertiesSlice";

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
  const [keys, setKeys] = useState([]);
  const [parentKey, setParentKey] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProperties());
  }, [dispatch])

  // eslint-disable-next-line no-use-before-define
  const dataProperties = useSelector(selectProperties);

  useEffect(() => {
    if(dataProperties) {
      setKeys(Object.keys(dataProperties));
    }
  }, [dataProperties])

  const {onClose, onOpen, isOpen} = useDisclosure();

  const handleOnDone = () => {
    onClose();
  };

  return (
    <>
      <ButtonShowCategoryForm onOpen={onOpen} />
      <Modal
        style={{minWidth: '600px'}}
        className='modal-category'
        centered
        visible={isOpen}
        onCancel={onClose}
        okText='Done'
        onOk={() => handleOnDone()}
        title={[
          <Text style={{fontSize: '20px', fontWeight: '300'}}>Schedule</Text>
        ]}
        width='auto'
      >
        <Form
          name='basic'
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          autoComplete='off'
        >
          <Form.List name="fields">
          {(fields, { add, remove }) => {
            return (
              <Space size={[0, 8]} direction='vertical'>
                <Text>Categories</Text>
                <Select
                  mode="multiple"
                  showSearch
                  autoFocus
                  style={{width: 256}}
                  placeholder='Search or select a category'
                  onChange={(value) => {setParentKey(value); add() }}
                  rules={[{required: true, message: 'Please must choose a opption'}]}
                  optionFilterProp='children'
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {keys?.map((value) => {
                    return (
                      <Select.Option key={value} value={value} >
                        {value}
                      </Select.Option>
                    );
                  })}
                </Select>
                {parentKey.map((value, index) => (
                  <div key={value.key}>
                    <Divider>{value}</Divider>
                    <Space direction='vertical' size={[0, 16]} align='start'>
                      <TransferProperties data={dataProperties} mainKey={value}/>
                    </Space>
                  </div>
                ))}
              </Space>
            );
          }}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
}
