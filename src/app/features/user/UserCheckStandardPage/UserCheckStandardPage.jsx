import {useDispatch} from 'react-redux';
import {setJsonCheckDoorData} from '../../../slices/forgeStandard/checkDoors';
import ForgeViewerTest from './ForgeViewerTest/ForgeViewerTest';
import {checkDoorDataJson} from './fakeData/data';
import TableCheckStandard from './TableCheckStandard/TableCheckStandard';
import CheckDoorsTable from './CheckDoorsTable/checkDoorsTable';

const TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJ2aWV3YWJsZXM6cmVhZCJdLCJjbGllbnRfaWQiOiJHQ0I1RFRwWHVDcU5LMmtOejQ4blJ2R3dudEFrQlRMMSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9hand0ZXhwNjAiLCJqdGkiOiJSTlAyMVczQTNtR0lyVVVKSHJaRTBoQlNzYlZmMklNaEZ6TWdmOGczcFZuNFoxZkloNjYxM3MxVjEyeVFDRzdwIiwiZXhwIjoxNjU0MzMxNTI2fQ.H1CFHEWybrNOjmqyAfF70o7qxZpWx5dSiVQ-NGRaxYRlqQ2YdTbmjpK1FMH5zokNuCqMLYAjpGO244oiUIm5iS2WDdRu1cDgED4VXOKx7a1CTZxFe1XXKwRtk94WgPKnpTEfZGb6lFDmbmrpHWzmEtjjAgDw8AisPbXMyJbY75lu43OD8XPKHnpw0yPgDFWdTsJGAwtcw_TReE6gp8W-_COLOPT47wwAxEOQjmTNibk-RwkeYYvt_QB5Fsev77I_jXGHJnq24MzNtpAZ35gf9i1jyQHDEUvY-xs7GArraha1bE1beFO73lnrS2qZDH0LJinl2aXXgAV0245wjChG2Q';
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
