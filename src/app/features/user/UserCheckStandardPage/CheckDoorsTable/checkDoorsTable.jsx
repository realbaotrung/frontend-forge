import {useEffect, useMemo, useState} from 'react';
import {useDispatch} from 'react-redux';
import PropsType from 'prop-types';
import {Table} from 'antd';
import ViewErrorDoor from './ViewErrorDoors/ViewErrorDoor';
import {setFlattedExternalIdErrorDoors} from '../../../../slices/forgeStandard/checkDoors';
import {calculateValidAndErrorByPercent} from '../../../../../utils/helpers.utils';

const styles = {
  paddingInline: '8px',
  width: '100%',
  height: 'calc(100vh - 298px)',
  overflow: 'auto',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export default function CheckDoorsTable({dataCheckStandard}) {

  const [checkDoorsData, setCheckDoorsData] = useState([]);

  const dispatch = useDispatch();

  // =================================
  // Set Flatted Error doors here...
  // =================================
  useEffect(() => {
    if (dataCheckStandard) {
      dispatch(setFlattedExternalIdErrorDoors(dataCheckStandard));
      setCheckDoorsData(dataCheckStandard);
    }
  }, [dataCheckStandard]);

  const dataSource = useMemo(() => {
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
          'view-error-details': (
            <ViewErrorDoor warningData={levelData.WarningData} />
          ),
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
      dataSource={dataCheckStandard ? dataSource : []}
      pagination={false}
    />
  );
}

// CheckDoorsTable.propTypes = {
//   checkDoorsData: PropsType.array.isRequired,
// };
CheckDoorsTable.defaultProps = {
  dataCheckStandard: [],
};
/*
eslint
  react/prop-types: 0,
  jsx-a11y/anchor-is-valid: 0,
  no-plusplus: 0,
  react/forbid-prop-types: 0
*/
