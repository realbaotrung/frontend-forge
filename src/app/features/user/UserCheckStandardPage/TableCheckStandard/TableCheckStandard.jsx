import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch} from 'react-redux';
import PropsType from 'prop-types';
import {Table} from 'antd';
import TotalErrorDoors from './ViewTotalErrors/TotalErrorDoors';
import {setFlattedExternalIdErrorDoors} from '../../../../slices/forgeStandard/checkDoors';
import {calculateTotalValidAndErrorByPercent} from '../../../../../utils/helpers.utils';

const styles = {
  paddingInline: '8px',
  width: '100%',
  height: '250px',
  overflow: 'auto',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export default function TableCheckStandard({dataCheckStandard}) {

  const [checkDoorsData, setCheckDoorsData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (dataCheckStandard) {
      dispatch(setFlattedExternalIdErrorDoors(dataCheckStandard));
      setCheckDoorsData(dataCheckStandard);
    }
  }, [dataCheckStandard]);

  const dataSource = useMemo(() => {
    const data = [];

    const totalDoorsAllLevels = [];
    const totalWarningNumberAllLevels = [];

    if (checkDoorsData) {
      checkDoorsData?.forEach((levelData) => {
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
  }, [checkDoorsData]);

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
      // rowSelection={rowSelection}
      style={styles}
      columns={columns}
      dataSource={dataCheckStandard ? dataSource : []}
      pagination={false}
    />
  );
}

// TableCheckStandard.propTypes = {
//   dataCheckStandard: PropsType.array.isRequired,
// };

TableCheckStandard.defaultProps = {
  dataCheckStandard: [],
}
/*
eslint
  react/prop-types: 0,
  jsx-a11y/anchor-is-valid: 0,
  no-plusplus: 0,
  react/forbid-prop-types: 0
*/
