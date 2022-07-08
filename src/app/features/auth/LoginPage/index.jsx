import {Center} from '@chakra-ui/react';
import {Space} from 'antd';
import {ReactComponent as Hat} from './assets/harmony-at.svg';
import LoginForm from './features/LoginForm';


export default function LoginPage() {
  return (
    <Space
      align='center'
      direction='vertical'
      size='large'
      style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
        width: '100wh',
        height: '100vh',
      }}
    >
      <Hat style={{width: '320px', height: 'auto'}} />
      <h1 style={{fontWeight: '300', fontSize: '24px'}}>
        Sign in to Autodesk Forge
      </h1>
      <LoginForm />
    </Space>
  );
}
