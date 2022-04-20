import {Typography, Space, Select } from "antd";

const {Text} = Typography
const {Option} = Select;

export default function CategorySelector() {
  return (
    <Space size={[0, 8]} direction='vertical'>
      <Text>Categories</Text>
      <Select
        showSearch
        autoFocus
        style={{width: 256}}
        placeholder='Search or select a category'
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
        <Option value='1'>a</Option>
        <Option value='2'>b</Option>
        <Option value='3'>d</Option>
        <Option value='4'>e</Option>
        <Option value='5'>f</Option>
        <Option value='6'>g</Option>
        <Option value='7'>h</Option>
        <Option value='8'>y</Option>
      </Select>
    </Space>
  );
}
