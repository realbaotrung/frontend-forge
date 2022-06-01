import ForgeViewerTest from "./ForgeViewerTest/ForgeViewerTest";
import TableCheckStandard from "./TableCheckStandard/TableCheckStandard";

const TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJ2aWV3YWJsZXM6cmVhZCJdLCJjbGllbnRfaWQiOiJHQ0I1RFRwWHVDcU5LMmtOejQ4blJ2R3dudEFrQlRMMSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9hand0ZXhwNjAiLCJqdGkiOiJQaHFPd29qcXRtM21CaHR6WXBIOE03eUNGeElIdUUzanR2dVlpZ1JqM3QwM3ppVHd6UEdsbGZsbHFYdUlNRm5tIiwiZXhwIjoxNjU0MDgzMjI2fQ.eQ3liUqwPAU3kuA2XSxhqgBE3yrMWlBEdkoFHwAcc3ckEun7KNKv_XzWsbjmbUk4xYMNTHKLsVtvaxLKvlPM4pWZqNY53TZqWS8WNvRvez6CiwWhi8AqzfsvY5GHakLWaCcbj6ECxQA31XYEqbZ73O0sNecKdZ46zv8QFVuTYcIAndjt5jJzlrDL3aFPZBSrcQY8F9fEa5td8Rf6D19u8_pGAQeVMsbFaHD3c9b8fkXqxl1XavcdPLaQxlhChOsMYBXKh8e5J6quUSejZpfFH4aXwR6t-Cc0mIaLmWl_A8I8k5WqmgDJ53pEij1A5nsjK6R2doNo5sda_U2Y1kJWOQ';
const URN =
  'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dXNlcjEtMjAyMjA2MDEwNDMwMTEtdmFsaWRhdGlvbmRvb3IucnZ0LWRhL1ZhbGlkYXRpb25Eb29yLnJ2dA';
const g3d = '78a2d1da-461b-235a-192f-223b10401d32';

export default function UserCheckStandardPage() {
  return (
    <div style={{
      display: 'flex',
    }}>
      <div style={{
        width: '600px'
      }}>
        <TableCheckStandard />
      </div>
      <div>
        <ForgeViewerTest token={TOKEN} urn={URN} guid={g3d}/>
      </div>
    </div>
  )
}