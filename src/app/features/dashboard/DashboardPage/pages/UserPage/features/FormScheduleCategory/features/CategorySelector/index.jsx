import {Typography, Space, Select } from "antd";
import React from "react";

const {Text} = Typography
const {Option} = Select;

// eslint-disable-next-line react/prop-types
export default function CategorySelector({data}) {
  const keys = Object.keys(data)
  return (
    <Space size={[0, 8]} direction='vertical'>
      <Text>Categories</Text>
      <Select
        mode="multiple"
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
        {keys.map((value) => {
          return (
            <Select.Option key={value} value={value}>
              {value}
            </Select.Option>
          );
        })}
      </Select>
    </Space>
  );
}
