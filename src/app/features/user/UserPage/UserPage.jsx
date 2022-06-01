import CanvasViewer from './features/CanvasViewer';
import './userPage.css';
import SiderForViewer from './features/SiderForViewer';
import NameOfFileWithView from './features/NameOfFileAndView';

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
          flexFlow: 'row nowrap',
          width: '100%',
          height: '100%',
        }}
      >
        <SiderForViewer />
        <div
          style={{
            backgroundColor: '#fafafa',
            width: '100%',
            position: 'relative',
          }}
        >
          <NameOfFileWithView />
          <CanvasViewer />
        </div>
      </div>
    </div>
  );
}
