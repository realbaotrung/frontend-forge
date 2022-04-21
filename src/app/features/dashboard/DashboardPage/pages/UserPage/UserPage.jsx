import FormUploadFiles from './features/FormUploadFiles';
import FormScheduleCategory from './features/FormScheduleCategory';

const containerCss = {
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
};
export default function UserPage() {
  return (
    <div style={containerCss}>
      <div style={{display: 'flex', gap: '8px', padding: '8px'}}>
        <FormUploadFiles />
        <FormScheduleCategory />
      </div>
      <h1>User</h1>
      <p>This is user page</p>
    </div>
  );
}
