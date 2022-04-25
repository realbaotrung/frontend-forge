import FormUploadFiles from './features/FormUploadFiles';
import FormScheduleCategory from './features/FormScheduleCategory';
import ForgeViewer from '../../../../../../utils/ForgeViewer';
import './UserPage.css';

// TODO: implement get accessToken from 2 legged ( or 3 legged )

// TODO: Implement Tree data

const getToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJ2aWV3YWJsZXM6cmVhZCJdLCJjbGllbnRfaWQiOiJORjh6Rlk0Uk5VQzc4Mmc2T3ZsY2NtMG45MkI3eFVncSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9hand0ZXhwNjAiLCJqdGkiOiJqcWNMaWdOYXNJMmhtTlQzYXRRSDNNZW8xTlJSOFdPS1JEdkw0OU1uVkp4VEpVTnpOTDB4N25aNDVGeExYb01EIiwiZXhwIjoxNjUwODgwOTE4fQ.bv-RO6JWJO7UqFha-rmaCOCQkpxMBDDLX9kE-JJDc3gJ9pDO2C4_eBZWaqwjrEUKMT-xDZ7cbjqSPjyBTJ5P-_QmEOSj8DgXVcwu3CTgJWrHVNJHdzTIP2DTJfQsaU67cQzUQ_VoQazy9ONvfFYhJBUHjl89-ZSIsUS27EycgNP2WNMSHg5icjxS6w75TxSVGpvwu-qY6yp9wwVF1uISF7l3YHrbkdzC-GKaAsbKxBc2DysFsYX4I6TfvqOy-jiJCQkZyjSqAKZq_n_BM086STnc9sjlXvdpwvRhEI4YQT_4hgTXVBni5SgkknbFW59WQDv20lpkBzDu6sF1wFGStg';
const urnTest =
  'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dXNlcjEtMjAyMjA0MjIwMjExMDYtZmlsZXJldml0LnJ2dC1kYS9maWxlcmV2aXQucnZ0';

const containerCss = {
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  width: '100vw',
  height: 'calc(100vh - 48px)',
};
export default function UserPage() {
  return (
    <div style={containerCss}>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '8px',
          width: '100%',
          height: '48px',
        }}
      >
        <FormUploadFiles />
        <FormScheduleCategory />
      </div>
      <div
        style={{
          display: 'flex',
          flexFlow: 'row nowrap',
          width: '100%',
          height: '100%',
        }}
      >
        <div style={{width: '256px', backgroundColor: 'azure'}}>Tree</div>
        <div>
          <ForgeViewer
            token={getToken}
            urn={urnTest}
            className='forge-viewer adsk-viewing-viewer'
          />
        </div>
      </div>
    </div>
  );
}
