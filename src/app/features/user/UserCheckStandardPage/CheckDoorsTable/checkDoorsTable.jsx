import {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Table} from 'antd';
import ViewErrorDoor from './ViewErrorDoors/ViewErrorDoor';
import {selectJsonCheckDoorDataFromFsCheckDoors, setFlattedExternalIdErrorDoors} from '../../../../slices/forgeStandard/checkDoors';

const styles = {
  paddingInline: '8px',
  width: '100%',
  height: 'calc(100vh - 298px)',
  overflow: 'auto',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const calculateValidAndErrorByPercent = (totalDoors, errorDoors) => {
  const errorPercent = (errorDoors / totalDoors) * 100;
  const errorPercentWithFixed2Decimal = parseFloat(errorPercent).toFixed(2);
  const validPercentWithFixed2Decimal = parseFloat(100 - errorPercent).toFixed(
    2,
  );

  return {
    validPercent: validPercentWithFixed2Decimal,
    errorPercent: errorPercentWithFixed2Decimal,
  };
};

export default function CheckDoorsTable() {
  // =================================
  // Get json data from select data...
  // =================================
  const jsonCheckDoorsFromFsCheckDoors = useSelector(
    selectJsonCheckDoorDataFromFsCheckDoors,
  );

  const dispatch = useDispatch();

  // =================================
  // Set Flatted Error doors here...
  // =================================
  useEffect(() => {
    dispatch(setFlattedExternalIdErrorDoors(jsonCheckDoorsFromFsCheckDoors))
  }, [jsonCheckDoorsFromFsCheckDoors])

  const checkDoorData = useMemo(() => {
    const data = [];
    if (jsonCheckDoorsFromFsCheckDoors) {
      jsonCheckDoorsFromFsCheckDoors?.forEach((levelData) => {
        const {validPercent, errorPercent} = calculateValidAndErrorByPercent(
          levelData.TotalDoor,
          levelData.WarningNumber,
        );
        data.push({
          key: levelData.LevelName,
          levels: levelData.LevelName,
          'valid-(%)': validPercent,
          'error-(%)': errorPercent,
          'error-doors': levelData.WarningNumber,
          'view-error-details': <ViewErrorDoor warningData={levelData.WarningData}/>,
        });
      });
    }
    return data;
  }, [jsonCheckDoorsFromFsCheckDoors]);

  const columns = [
    {
      title: 'Levels',
      dataIndex: 'levels',
      key: 'levels',
    },
    {
      title: 'Valid (%)',
      dataIndex: 'valid-(%)',
      key: 'valid-(%)',
    },
    {
      title: 'Error (%)',
      dataIndex: 'error-(%)',
      key: 'error-(%)',
    },
    {
      title: 'Error Doors',
      dataIndex: 'error-doors',
      key: 'error-doors',
    },
    {
      title: 'View Error Details',
      dataIndex: 'view-error-details',
      key: 'view-error-details',
    },
  ];

  return (
    <Table
      style={styles}
      columns={columns}
      dataSource={checkDoorData}
      pagination={false}
    />
  );
}

/*
eslint
  jsx-a11y/anchor-is-valid: 0,
  no-plusplus: 0 
*/
