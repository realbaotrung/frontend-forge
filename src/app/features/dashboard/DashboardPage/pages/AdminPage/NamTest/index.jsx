import {useCallback, useEffect, useState} from 'react';
import {Button, useDisclosure} from '@chakra-ui/react';
import {Typography, Space, Modal} from 'antd';
import PropTypes from 'prop-types';
import TransferProperties from './TransferProperties';
import CategorySelector from './CategorySelector';
import ResultData from './ResultData';
import datajson from './test.json';


const {Text} = Typography;
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

export default function NamTest() {
  const {onClose, onOpen, isOpen} = useDisclosure();
  const [ data, setData]=useState([]);
  const [ target, setTarget]=useState([]);
  const handleOnDone = () => {
    onClose();
  };

  // const getData = () =>{
  //   fetch('/test.json'
  //   ,{
  //     headers : { 
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json'
  //      }
  //   }).then((response)=>{
  //       return response.json();
  //     })
  //     .then((myJson) => {
  //       setData(myJson)
  //     });
  // };

  useEffect(()=>{
    setData(JSON.parse(JSON.stringify(datajson)));
  },[]);

  const getDataTarget = (res) => {
    setTarget(res);
  }

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
          <Text style={{fontSize: '20px', fontWeight: '300'}}>Schedule</Text>,
        ]}
        width='900px'
        bodyStyle={{height: '600px'}}
      >
        <Space direction='vertical' size={[0, 4]} align='start'>
          <CategorySelector data={data} />
          <Space direction='horizontal' size={[20, 4]} align='start'>
            <TransferProperties data={data} getDataTarget={getDataTarget}/>
            <ResultData data={target}/>
          </Space>
        </Space>
      </Modal>
    </>
  );
}
