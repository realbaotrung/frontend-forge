import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
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

  const token2legged = useSelector(selectTokenOAuth2LeggedFromOAUTH);
  const view3Ds = useSelector(selectView3DsFromFV);
  const urnFromMD = useSelector(selectUrnFromMD);
  // ==========================================================
  // Get json data after check doors form get data successfully
  // ==========================================================
  const checkDoorsFromFsCheckDoors = useSelector(
    selectJsonCheckDoorsDataFromFsCheckDoors,
  );

  useEffect(() => {
    if (token2legged && view3Ds && urnFromMD) {
      setToken(token2legged);
      setGuid3d(view3Ds[0]?.guid);
      setUrn(urnFromMD);
    }
  }, [token2legged, view3Ds, urnFromMD]);

  // Data from check door
  // ======================================
  // Get all check standard data here...
  // should call API
  // ======================================

  return (
    <div>
      {checkDoorsFromFsCheckDoors && token && guid3d && urn && (
        <div
          style={{
            display: 'flex',
          }}
        >
          <div style={styles}>
            <TableCheckStandard checkDoorsData={checkDoorsFromFsCheckDoors} />
            <CheckDoorsTable checkDoorsData={checkDoorsFromFsCheckDoors} />
          </div>
          <div>
            <ForgeViewerTest token={token} urn={urn} guid={guid3d} />
          </div>
        </div>
      )}
    </div>
  );
}
