import React, {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Table} from 'antd';
import TotalErrorDoors from './ViewTotalErrors/TotalErrorDoors';
import {
  selectJsonCheckDoorDataFromFsCheckDoors,
  setFlattedExternalIdErrorDoors,
} from '../../../../slices/forgeStandard/checkDoors';
import {
  calculateValidAndErrorByPercent,
  calculateTotalValidAndErrorByPercent,
} from '../../../../../utils/helpers.utils';

const styles = {
  paddingInline: '8px',
  width: '100%',
  height: '250px',
  overflow: 'auto',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export default function TableCheckStandard() {
  const jsonCheckDoorsFromFsCheckDoors = useSelector(
    selectJsonCheckDoorDataFromFsCheckDoors,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFlattedExternalIdErrorDoors(jsonCheckDoorsFromFsCheckDoors));
  }, [jsonCheckDoorsFromFsCheckDoors]);

  const checkDoorData = useMemo(() => {
    const data = [];

    const totalDoorsAllLevels = [];
    const totalWarningNumberAllLevels = [];

    if (jsonCheckDoorsFromFsCheckDoors) {
      jsonCheckDoorsFromFsCheckDoors?.forEach((levelData) => {
        totalDoorsAllLevels.push(levelData.TotalDoor);
        totalWarningNumberAllLevels.push(levelData.WarningNumber);
      });
    }

    const {totalValidByPercent, totalErrorByPercent} =
      calculateTotalValidAndErrorByPercent(
        totalDoorsAllLevels,
        totalWarningNumberAllLevels,
      );

    const checkDoors = {
      key: 'Check Doors',
      'name-of-standards': 'Check Doors',
      'total-valid-(%)': totalValidByPercent,
      'total-errors-(%)': totalErrorByPercent,
      'view-total-errors': <TotalErrorDoors />,
    };

    const checkStandardData = [checkDoors];
    checkStandardData.forEach((standard) => data.push(standard));

    return data;
  }, [jsonCheckDoorsFromFsCheckDoors]);

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

  return (
    <Table
      rowSelection={rowSelection}
      style={styles}
      columns={columns}
      dataSource={checkDoorData}
    />
  );
}

/*
eslint
  jsx-a11y/anchor-is-valid: 0,
  no-plusplus: 0 
*/
