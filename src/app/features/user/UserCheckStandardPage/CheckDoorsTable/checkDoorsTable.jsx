import {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropsType from 'prop-types'
import {Table} from 'antd';
import ViewErrorDoor from './ViewErrorDoors/ViewErrorDoor';
import {selectJsonCheckDoorDataFromFsCheckDoors, setFlattedExternalIdErrorDoors} from '../../../../slices/forgeStandard/checkDoors';
import { calculateValidAndErrorByPercent } from '../../../../../utils/helpers.utils';

const styles = {
  paddingInline: '8px',
  width: '100%',
  height: 'calc(100vh - 298px)',
  overflow: 'auto',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};


export default function CheckDoorsTable({checkDoorsData}) {

  const dispatch = useDispatch();

  // =================================
  // Set Flatted Error doors here...
  // =================================
  useEffect(() => {
    dispatch(setFlattedExternalIdErrorDoors(checkDoorsData))
  }, [checkDoorsData])

  const checkDoorData = useMemo(() => {
    const data = [];
    if (checkDoorsData) {
      checkDoorsData?.forEach((levelData) => {
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
  }, [checkDoorsData]);

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


CheckDoorsTable.propTypes = {
  checkDoorsData: PropsType.array.isRequired,
}
/*
eslint
  jsx-a11y/anchor-is-valid: 0,
  no-plusplus: 0,
  react/forbid-prop-types: 0
*/
