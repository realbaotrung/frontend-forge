import {useCallback, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Typography, Select} from 'antd';
import {selectCategoryNamesFromDA} from '../../../../../../../../../../../slices/designAutomation/selectors';
import {
  setCategoryKeyName,
  setScheduleName,
} from '../../../../../../../../../../../slices/designAutomation/designAutomationSlice';

const {Text} = Typography;
const {Option} = Select;

export default function CategoryNameHandler() {
  const categoryNames = useSelector(selectCategoryNamesFromDA);

  const dispatch = useDispatch();

  const optionCategoryNames = categoryNames?.map((name) => (
    <Option key={name} value={name}>
      {name}
    </Option>
  ));

  const handleOnSelect = useCallback((value) => {
    dispatch(setCategoryKeyName(value));
    const timestamp = new Date().getTime();
    dispatch(setScheduleName(`${value.toString()} ${timestamp.toString()}`));
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
    <>
      <Text>Categories</Text>
      <Select {...selectProps} onSelect={handleOnSelect}>
        {optionCategoryNames}
      </Select>
    </>
  );
}
