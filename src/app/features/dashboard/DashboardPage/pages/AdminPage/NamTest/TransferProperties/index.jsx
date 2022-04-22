import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Transfer, Space, Row, Col} from 'antd';
import {selectValue, selectDataTree, setTree, deleteNodeTree} from '../../../../../../../slices/testSlice/testSlice';

const initialTargetKeys = [];

// eslint-disable-next-line react/prop-types
export default function TransferProperties({data, getDataTarget}) {
  const idCategory = useSelector(selectValue);
  const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [dataParameter, setDataParameter] = useState([]);
  const dispatch = useDispatch();
 
  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    
  };

  const onScroll = (direction, e) => {
   
  };

  
  const dataTree = useSelector(selectDataTree);
  useEffect(() => {
    if(dataTree.length > 0 && dataTree.filter(x => x.key === idCategory)){
      const dt = dataTree.filter(x => x.key === idCategory);
      if(dt.length > 0){
        console.log(dt[0].children);
        setTargetKeys(dt[0].children.map(x => x.key));
      }
      else{
        setSelectedKeys([]);
        setTargetKeys([]);
      }
    }
    const arr = [];
    // debugger
    if (data[idCategory]) {
      // eslint-disable-next-line react/prop-types
      data[idCategory].forEach((x) => {
        if(targetKeys.indexOf(x) === -1)
        {
            arr.push({
            key: x,
            title: x,
            description: x,
          })
        }
      });
    }
    setDataParameter(arr);
  }, [idCategory]);

  useEffect(() => {
   
  },[dataTree]);

  const getDataTarget2 = () => {
    const arr = [];
    // eslint-disable-next-line react/prop-types
    if(targetKeys.length > 0){
      // eslint-disable-next-line react/prop-types
      targetKeys.forEach(element => {
        arr.push({
          key: element,
          title: element,
        });
      });
      const dt = {
        title: idCategory,
        key: idCategory,
        // eslint-disable-next-line react/prop-types
        children: arr
      }
      dispatch(setTree(dt));
    }
    else{
      dispatch(deleteNodeTree(idCategory));
    }
  }
  const onChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  useEffect(() => {
    getDataTarget2();
  }, [targetKeys])
  
  return (
    <Space direction='vertical' size={[0, 8]}>
      <Row>
        <Col flex='53.6%'>Available fields</Col>
        <Col flex='auto'>Scheduled fields</Col>
      </Row>
      <Transfer
        listStyle={{
          width: 256,
          height: 450,
        }}
        dataSource={dataParameter}
        titles={['Source', 'Target']}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={onChange}
        onSelectChange={onSelectChange}
        onScroll={onScroll}
        render={(item) => item.title}
      />
       {/* <Button type="primary" onClick={getDataTarget2}>Primary Button</Button> */}
    </Space>
  );
}
/*
eslint no-plusplus:0
*/
