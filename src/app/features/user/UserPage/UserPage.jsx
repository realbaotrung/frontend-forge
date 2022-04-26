import FormUploadFiles from './features/FormUploadFiles';
import FormScheduleCategory from './features/FormScheduleCategory';
import ForgeViewerWithTree from './features/ForgeViewerWithTree';
import './UserPage.css';

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
      <ForgeViewerWithTree />
    </div>
  );
}
