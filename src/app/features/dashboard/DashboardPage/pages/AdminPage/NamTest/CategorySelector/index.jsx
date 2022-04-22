import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Typography, Space, Select } from "antd";

import { setValue, selectValue } from "../../../../../../../slices/testSlice/testSlice";

const {Text} = Typography

// eslint-disable-next-line react/prop-types
export default function CategorySelector({data}) {
  const dispatch = useDispatch();
  const [ categories, setCategories]=useState([]);
  const idCurrent = useSelector(selectValue);

  useEffect(()=>{
    setCategories(Object.keys(data));
  },[data]);

  useEffect(() => {
    dispatch(setValue(idCurrent));
  },[idCurrent])

  const onchangeSelect = (value) => {
    dispatch(setValue(value));
  }

  return (
    <Space size={[0, 8]} direction='vertical'>
      <Text>Categories</Text>
      <Select
        showSearch
        autoFocus
        value={idCurrent}
        style={{width: 256}}
        placeholder='Search or select a category'
        onChange={(value) => {
          onchangeSelect(value);
        }} 
      >
         {categories?.map((value) => {
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
