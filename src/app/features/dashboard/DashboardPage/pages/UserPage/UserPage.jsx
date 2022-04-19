import {Upload, message, Button} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import UploadFiles from './features/UploadFiles';

export default function UserPage() {

  return (
    <div>
      <UploadFiles />
      <h1>User</h1>
      <p>This is user page</p>
    </div>
  );
}
