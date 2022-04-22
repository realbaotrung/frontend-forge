import {useCallback, useEffect, useMemo, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Typography, Space, Select} from 'antd';
import {
  selectCategoryNamesFromDA,
} from '../../../../../../../../../slices/designAutomation/selectors';
import {getCategoryKeyName} from '../../../../../../../../../slices/designAutomation/designAutomationSlice';

const {Text} = Typography;
const {Option} = Select;

export default function CategorySelector() {
  const [names, setNames] = useState([]);

  const categoryNames = useSelector(selectCategoryNamesFromDA);

  useEffect(() => {
    if (categoryNames) {
      setNames(categoryNames);
    }
  }, []);

  const dispatch = useDispatch();

  const optionCategoryNames = names.map((name) => (
    <Option key={name} value={name}>
      {name}
    </Option>
  ));

  const handleOnSelect = useCallback((value) => {
    dispatch(getCategoryKeyName(value));
  }, []);

  const selectProps = useMemo(() => {
    return {
      showSearch: true,
      autoFocus: true,
      style: {width: 256},
      placeholder: 'Search or select a category',
      optionFilterProp: 'children',
      filterOption: (input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
      filterSort: (optionA, optionB) =>
        optionA.children
          .toLowerCase()
          .localeCompare(optionB.children.toLowerCase()),
    };
  }, []);

  return (
    <Space size={[0, 8]} direction='vertical'>
      <Text>Categories</Text>
      <Select {...selectProps} onSelect={handleOnSelect}>
        {optionCategoryNames}
      </Select>
    </Space>
  );
}
