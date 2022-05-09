import {useEffect, useMemo, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Transfer, Space, Row, Col} from 'antd';
import {
  selectCategoryValuesByKeyNameFromDA,
} from '../../../../../../../../../slices/designAutomation/selectors';
import {
  getJsonTargetCategoryData
} from '../../../../../../../../../slices/designAutomation/designAutomationSlice';

export default function TransferProperties() {
  const [haveTargetData, setHaveTargetData] = useState(false)
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const categoryValuesByKeyName = useSelector(selectCategoryValuesByKeyNameFromDA);

  const dispatch = useDispatch();

  const mockData = useMemo(() => {
    const data = [];
    if (categoryValuesByKeyName) {
      // Reset both SelectedKeys and TargetKeys
      setSelectedKeys([]);
      setTargetKeys([]);
      for (const value of categoryValuesByKeyName) {
        data.push({
          key: value,
          title: value,
          description: `description of ${value}`,
        });
      }
    }
    return data
  }, [categoryValuesByKeyName]);

  useEffect(() => {
    if (haveTargetData) {
      dispatch(getJsonTargetCategoryData(targetKeys));
    }
  }, [targetKeys, haveTargetData])

  const onChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
    setHaveTargetData(true);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
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
        dataSource={mockData}
        titles={['Source', 'Target']}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={(nextTargetKeys) => onChange(nextTargetKeys)}
        onSelectChange={(sourceSelectedKeys, targetSelectedKeys) => onSelectChange(sourceSelectedKeys, targetSelectedKeys)}
        render={item => item?.title}
        showSelectAll={false}
      />
    </Space>
  );
}

/*
eslint
  no-plusplus: 0,
  no-restricted-syntax: 0,
*/
