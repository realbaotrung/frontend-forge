import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Empty} from 'antd';
import {checkDoorDataJson} from './fakeData/data';
import {selectTokenOAuth2LeggedFromOAUTH} from '../../../slices/oAuth';
import {selectView3DsFromFV} from '../../../slices/forgeViewer';
import {selectUrnFromMD} from '../../../slices/modelDerivative/selectors';
import ForgeViewerTest from './ForgeViewerTest/ForgeViewerTest';
import TableCheckStandard from './TableCheckStandard/TableCheckStandard';
import CheckDoorsTable from './CheckDoorsTable/checkDoorsTable';
import {selectJsonCheckDoorsDataFromFsCheckDoors} from '../../../slices/forgeStandard/checkDoors';

const styles = {
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  width: '600px',
};

export default function UserCheckStandardPage() {
  const [token, setToken] = useState(null);
  const [guid3d, setGuid3d] = useState(null);
  const [urn, setUrn] = useState(null);
  const [isHasData, setIsHasData] = useState(false);
  const [checkDoorsData, setCheckDoorsData] = useState(null);

  const token2legged = useSelector(selectTokenOAuth2LeggedFromOAUTH);
  const view3Ds = useSelector(selectView3DsFromFV);
  const urnFromMD = useSelector(selectUrnFromMD);
  const checkDoorsFromFsCheckDoors = useSelector(
    selectJsonCheckDoorsDataFromFsCheckDoors,
  );

  useEffect(() => {
    if (token2legged && view3Ds && urnFromMD) {
      setToken(token2legged);
      setGuid3d(view3Ds[0]?.guid);
      setUrn(urnFromMD);
      setIsHasData(true);
    }
  }, [token2legged, view3Ds, urnFromMD]);

  useEffect(() => {
    if (checkDoorsFromFsCheckDoors) {
      setCheckDoorsData(checkDoorsFromFsCheckDoors);
    }
  }, [checkDoorsFromFsCheckDoors]);

  // useEffect(() => {
  //   setCheckDoorsData(checkDoorDataJson);
  // }, [checkDoorDataJson]);

  // Data from check door
  // ======================================
  // Get all check standard data here...
  // should call API
  // ======================================

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >
        <div style={styles}>
          <TableCheckStandard dataCheckStandard={checkDoorsData} />
          <CheckDoorsTable dataCheckStandard={checkDoorsData} />
        </div>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'calc(100vh - 48px)',
          }}
        >
          {isHasData ? (
            <ForgeViewerTest token={token} urn={urn} guid={guid3d} />
          ) : (
            <Empty
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
