import {useDispatch, useSelector} from 'react-redux';
import {Alert} from 'antd';
import './index.css';

import {
  useMessageSlice,
  selectMessage,
} from '../../../../../../../slices/message';

export default function LoginFormMessage() {
  const {clearMessage} = useMessageSlice().actions;

  const message = useSelector(selectMessage);

  const dispatch = useDispatch();

  if (!message) {
    return null;
  }
  return (
    <Alert
      className='message'
      message={message}
      type='error'
      closable
      onClose={() => dispatch(clearMessage())}
    />
  );
}
