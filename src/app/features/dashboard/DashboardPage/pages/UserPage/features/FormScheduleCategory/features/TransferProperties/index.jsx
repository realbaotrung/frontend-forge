import {useEffect, useMemo, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {produce} from 'immer';
import {Transfer, Space, Row, Col} from 'antd';
import {selectCategoryValuesByKeyNameFromDA} from '../../../../../../../../../slices/designAutomation/selectors';
import { getJsonTargetCategoryData } from '../../../../../../../../../slices/designAutomation/designAutomationSlice';

export default function TransferProperties() {
  const [targetDataChange, setTargetDataChange] = useState(null);
  const [targetKeys, setTargetKeys] = useState('');
  const [selectedKeys, setSelectedKeys] = useState([]);

  // implement choose value by category key name
  const categoryValuesByKeyName = useSelector(selectCategoryValuesByKeyNameFromDA);

  const dispatch = useDispatch();

  const mockData = useMemo(() => {
    const data = [];
    
    if (categoryValuesByKeyName) {
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

  const onChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
    setTargetDataChange(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  useEffect(() => {
    if (targetDataChange) {
      dispatch(getJsonTargetCategoryData(
        produce(targetDataChange, (draft) => {
          draft.pop();
        }),
      ))
    }
  }, [targetDataChange]);

  const transferProps = useMemo(() => {
    return {
      listStyle: {
        width: 256,
        height: 250,
      },
      dataSource: mockData,
      titles: ['Source', 'Target'],
      targetKeys,
      selectedKeys,
      onChange,
      onSelectChange,
      render: (item) => item.title,
      showSelectAll: false,
    };
  }, [onchange, onSelectChange, mockData]);

  return (
    <Space direction='vertical' size={[0, 8]}>
      <Row>
        <Col flex='53.6%'>Available fields</Col>
        <Col flex='auto'>Scheduled fields</Col>
      </Row>
      <Transfer {...transferProps} />
    </Space>
  );
}
/*
eslint
  no-plusplus: 0,
  no-restricted-syntax: 0
*/
