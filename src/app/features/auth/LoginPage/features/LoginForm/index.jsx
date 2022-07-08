import {Space, Form, Input, Button} from 'antd';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useNavigate} from 'react-router-dom';
import './index.css';

import {FaUserAlt, FaLock} from 'react-icons/fa';
import {useMessageSlice} from '../../../../../slices/message';
import LoginFormMessage from './features/LoginFormMessage';
import routePaths from '../../../../route/routePaths';
import {
  useSignInMutation,
  selectUser,
  selectRole,
} from '../../../../../slices/auth';

// =====================================================================
// LoginForm component
// =====================================================================

export default function LoginForm() {
  // Redux...
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  // action creators...
  const {clearMessage, setMessage} = useMessageSlice().actions;

  // ===============================
  const [signIn] = useSignInMutation();

  // react-router-dom
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  // Execution when submitting login form
  const onSubmit = async (formValue) => {
    try {
      await signIn(formValue)
        .unwrap()
        .then(() => {
          // TODO: check logic of navigate by role [normal, admin]
          navigate(routePaths.USER_URL, {replace: true});
        });
    } catch (error) {
      if (error?.status === 'FETCH_ERROR') {
        dispatch(setMessage('No Server Response'));
      } else if (error?.status === 400) {
        dispatch(setMessage('Username or Password is not valid'));
      } else if (error?.status === 401) {
        dispatch(setMessage('Unauthorize'));
      } else {
        dispatch(setMessage('Username or Password is not valid'));
      }
    }
  };

  // =======================================================
  // If user is already logged in, show turn Login page off.
  // =======================================================
  const role = useSelector(selectRole);

  useEffect(() => {
    if (user) {
      if (role === 'admin') navigate('/admin');
      else navigate(routePaths.USER_URL);
    }
  });

  return (
    <Space
      align='center'
      direction='vertical'
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <LoginFormMessage />

      <div className='loginForm'>
        <Form
          name='loginForm'
          autoComplete='off'
          layout='vertical'
          onFinish={onSubmit}
        >
          <Form.Item
            label={
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '500',
                }}
              >
                Username
              </div>
            }
            name='username'
            style={{marginBottom: '15px'}}
          >
            <Input
              size='large'
              prefix={<FaUserAlt style={{color: '#CBD5E0'}} />}
              placeholder='Please enter username'
              style={{borderRadius: '6px'}}
            />
          </Form.Item>

          <Form.Item
            label={
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '500',
                }}
              >
                Password
              </div>
            }
            name='password'
            style={{marginBottom: '18px'}}
          >
            <Input.Password
              size='large'
              prefix={<FaLock style={{color: '#CBD5E0'}} />}
              placeholder='Please enter password'
              style={{borderRadius: '6px'}}
            />
          </Form.Item>

          <Button
            className='submitButton'
            type='primary'
            htmlType='submit'
            block
          >
            Sign in
          </Button>
        </Form>
      </div>
    </Space>
  );
}

/*
eslint
  react/no-children-prop:0
*/
