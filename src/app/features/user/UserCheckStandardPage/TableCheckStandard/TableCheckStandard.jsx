import React from 'react';
import {Table} from 'antd';
import TotalErrorDoors from './ViewTotalErrors/TotalErrorDoors';

const styles = {
  paddingInline: '8px',
  width: '100%',
  height: '250px',
  overflow: 'auto',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export default function TableCheckStandard() {

  const columns = [
    {
      title: 'Name of Standards',
      dataIndex: 'name-of-standards',
      key: 'name-of-standards',
    },
    {
      title: 'Total Valid (%)',
      dataIndex: 'total-valid-(%)',
      key: 'total-valid-(%)',
    },
    {
      title: 'Total Errors (%)',
      dataIndex: 'total-errors-(%)',
      key: 'total-errors-(%)',
    },
    {
      title: 'View Total Errors',
      dataIndex: 'view-total-errors',
      key: 'view-total-errors',
    },
  ];

  const data = [];

  const checkStandardData = [
    {
      key: 'Check Doors',
      'name-of-standards': 'Check Doors',
      'total-valid-(%)': '62.50',
      'total-errors-(%)': '37.50',
      'view-total-errors': <TotalErrorDoors />,
    },
  ];

  const rowSelection = {
    type: 'radio',
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
    },
  };

  checkStandardData.forEach((standard) => data.push(standard));

  return (
    <Table
      rowSelection={rowSelection}
      style={styles}
      columns={columns}
      dataSource={data}
    />
  );
}

/*
eslint
  jsx-a11y/anchor-is-valid: 0,
  no-plusplus: 0 
*/
