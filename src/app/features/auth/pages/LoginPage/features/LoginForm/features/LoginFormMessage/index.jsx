import {createStructuredSelector} from 'reselect';
import {useDispatch, useSelector} from 'react-redux';

import {Alert, CloseButton} from '@chakra-ui/react';

import {useMessageSlice} from '../../../../../../../../slices/message';
import {selectMessage} from '../../../../../../../../slices/message/selectors';

export default function LoginFormMessage() {
  const {clearMessage} = useMessageSlice().actions;
  // values store...
  const message = useSelector(selectMessage);

  const dispatch = useDispatch();

  if (!message) {
    return null;
  }

  return (
    <Alert status='error' variant='left-accent'>
      {message}
      <CloseButton
        position='absolute'
        right='7px'
        top='7px'
        onClick={() => dispatch(clearMessage())}
      />
    </Alert>
  );
}
