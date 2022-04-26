import {useState} from 'react';
import {Transfer, Space, Row, Col} from 'antd';


// eslint-disable-next-line react/prop-types
export default function TransferProperties({data, mainKey}) {
  const proData = [];

  // eslint-disable-next-line react/prop-types
  data[mainKey].map((value, index) => (
    proData.push({
      key: index.toString(),
      title: value
    })
  ));

  const initialTargetKeys = [];

  const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const onChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onScroll = (direction, e) => {
    // console.log('direction:', direction);
    // console.log('target:', e.target);
  };

  return (
    <Space direction='vertical' size={[0, 8]}>
    <Row>
      <Col flex='53.6%'>Available fields</Col>
      <Col flex='auto'>Scheduled fields</Col>
    </Row>
    <Transfer
      listStyle={{
        width: 256,
        height: 250,
      }}
      dataSource={proData}
      titles={['Source', 'Target']}
      targetKeys={targetKeys}
      selectedKeys={selectedKeys}
      onChange={onChange}
      onSelectChange={onSelectChange}
      onScroll={onScroll}
      render={(item) => item.title}
    />
    </Space>
  );
}
/*
eslint no-plusplus:0
*/
