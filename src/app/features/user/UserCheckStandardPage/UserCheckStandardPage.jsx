import { useDispatch } from "react-redux";
import { setFlattedErrorDoors, setJsonCheckDoorData } from "../../../slices/forgeStandard/checkDoors";
import ForgeViewerTest from "./ForgeViewerTest/ForgeViewerTest";
import { checkDoorDataJson } from "./fakeData/data";
import TableCheckStandard from "./TableCheckStandard/TableCheckStandard";
import { CheckDoorsTable } from "./CheckDoorsTable/checkDoorsTable";

const TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJ2aWV3YWJsZXM6cmVhZCJdLCJjbGllbnRfaWQiOiJHQ0I1RFRwWHVDcU5LMmtOejQ4blJ2R3dudEFrQlRMMSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9hand0ZXhwNjAiLCJqdGkiOiJubGh2MEEyazhUa1pYN2tveWpyVjVEelJRUVVVUXB0UDR1WVFSQkFjTjdoQWRoZEJPem83NWM0NWtWeWlOUEVWIiwiZXhwIjoxNjU0MTYwNzU1fQ.TIN6HjR0UpM4EbgK0ZIKe92HZQWpZD-DURR4GXR4pLropKk-0cpyohcvzU3zWv3UEYDO5t_4eMGrWo2ndT3KLQjUN-k0HaM7kpeopnABL8JjslC-QUj7oQXe6hwxAKFnziQuxHNDHa0F584_a959utGRRn74oEgeDHScO4DrZUJ-dtDQZ8OPr9chtWDUEGBkyGplZcfcGAft39dW08A82C2qTgl9so36lZqJl0E7OtGyg18LPB0ssfefGuAhCO86ZjIHirm7F6Mn_TqqCMXT5V7XefUrTobB68yjorlObo--Jq4IFZ8EF3BHF1D7ACKgARmpHz-xkVgImjNUNrp93w';
const URN =
  'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dXNlcjEtMjAyMjA2MDEwNDMwMTEtdmFsaWRhdGlvbmRvb3IucnZ0LWRhL1ZhbGlkYXRpb25Eb29yLnJ2dA';
const g3d = '78a2d1da-461b-235a-192f-223b10401d32';

const styles = {

        display: 'flex',
        flexFlow: 'column',
        justifyContent:'flex-start',
        alignItems: 'flex-start',
        width: '600px'
}

export default function UserCheckStandardPage() {

  // ======================================
  // Get all check standard data here...
  // should call API
  // ======================================

  const dispatch = useDispatch();

  // Data from check door
  dispatch(setJsonCheckDoorData(checkDoorDataJson));
  dispatch(setFlattedErrorDoors());

  return (
    <div style={{
      display: 'flex',
    }}>
      <div style={styles}>
        <TableCheckStandard />
        <CheckDoorsTable />
      </div>
      <div>
        <ForgeViewerTest token={TOKEN} urn={URN} guid={g3d}/>
      </div>
    </div>
  )
}