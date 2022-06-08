import {useDispatch} from 'react-redux';
import {setJsonCheckDoorData} from '../../../slices/forgeStandard/checkDoors';
import ForgeViewerTest from './ForgeViewerTest/ForgeViewerTest';
import {checkDoorDataJson} from './fakeData/data';
import TableCheckStandard from './TableCheckStandard/TableCheckStandard';
import CheckDoorsTable from './CheckDoorsTable/checkDoorsTable';

const TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJ2aWV3YWJsZXM6cmVhZCJdLCJjbGllbnRfaWQiOiJHQ0I1RFRwWHVDcU5LMmtOejQ4blJ2R3dudEFrQlRMMSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9hand0ZXhwNjAiLCJqdGkiOiJnY3h1bTJxMWNRNnhPTXBTTjlST1AxNGE3aE8xdnhoR2lxbXlJMEwwWkk1SzkyZjhMTGNaSmFQeGtYNnJ3eFZFIiwiZXhwIjoxNjU0NjYzMzA3fQ.FefWM5C0Gqlm3h-na16CSsgBXqlA3z-Y5V03KfV7nwRjE06mGiLnaPwD6WKvTiUG8OvILh4rD0Ol38WPt_bF9L4yLjWlrXAelhnqHKr16eoyZbT683_LnwlWwOBk7a9NrPpp4vJq2cs1bs2SzMkxE1kY6GseJFiqfxVCwKtSM9HdWASdJFzt0MUqQ_YCxXs3fCvE-Rz6MQpeUoQ92dQLWOoqPJcK9MSwI7_e9nVgRvt2gDkhR5zcxTFMkUa-EJt_A1LTuDrFZIZl8hIOe9v33c_5AmSL1F06guqa6clw7JL80DwaOnkoVMzvHOR0T7sREap3h-kIdm3XREenQkWhTQ';
const URN =
  'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dXNlcjEtMjAyMjA2MDEwNDMwMTEtdmFsaWRhdGlvbmRvb3IucnZ0LWRhL1ZhbGlkYXRpb25Eb29yLnJ2dA';
const g3d = '78a2d1da-461b-235a-192f-223b10401d32';

const styles = {
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  width: '600px',
};

export default function UserCheckStandardPage() {
  // ======================================
  // Get all check standard data here...
  // should call API
  // ======================================

  const dispatch = useDispatch();

  // Data from check door
  dispatch(setJsonCheckDoorData(checkDoorDataJson));

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <div style={styles}>
        <TableCheckStandard />
        <CheckDoorsTable />
      </div>
      <div>
        <ForgeViewerTest token={TOKEN} urn={URN} guid={g3d} />
      </div>
    </div>
  );
}
