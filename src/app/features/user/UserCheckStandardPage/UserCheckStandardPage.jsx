import {useDispatch} from 'react-redux';
import {setJsonCheckDoorData} from '../../../slices/forgeStandard/checkDoors';
import ForgeViewerTest from './ForgeViewerTest/ForgeViewerTest';
import {checkDoorDataJson} from './fakeData/data';
import TableCheckStandard from './TableCheckStandard/TableCheckStandard';
import CheckDoorsTable from './CheckDoorsTable/checkDoorsTable';

const TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJ2aWV3YWJsZXM6cmVhZCJdLCJjbGllbnRfaWQiOiJHQ0I1RFRwWHVDcU5LMmtOejQ4blJ2R3dudEFrQlRMMSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9hand0ZXhwNjAiLCJqdGkiOiJmTldUREpRTHZUVTNOTTQ4anNqRzV6QXNsS3lBaFNZR3BvSmxkeE9wUjFBUkFERk9pM1o2Q2huZ2NxZW16aExhIiwiZXhwIjoxNjU0MjU4OTM5fQ.G4EJGBMYvXaXVlWmDP_aYdIdzxEgMxskznnNxZPmZVrqg_k9mSL5ihkh0OxvdZccIpgJYvxA4arQqCBfhMVPUAb3NENHJ4jaYMTTs1-ajWl_luJv87TfBkX5eLvaMOZmDHrqkJa9T3WduUo7AACSIPOGv8BnzyvFVY-dbl1h47uo8P-3KG9FxXioEXCWeP4eETJJLLO5F7UTalPqEQTVTtQ_fonoeHgeZ6vA1EzU1wqDAj_gUI2aezZCDGjLlH31Qvu3wdq2HB-XGb7U_UNvfEjQapYTE40675Q8KWKOm2B55cAM0DDlqFPGBseJ8nVSadykyiMExe5TWY2M_NUc1Q';
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
