import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useForm} from 'react-hook-form';

import {useNavigate} from 'react-router-dom';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Stack,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';

import {FaUserAlt, FaLock} from 'react-icons/fa';
import {BsFillEyeFill, BsFillEyeSlashFill} from 'react-icons/bs';
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
  // State
  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);

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

  // Manage entire form with schema validation
  const {handleSubmit, register} = useForm();

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
    <Stack direction='column' spacing={4}>
      <LoginFormMessage />
      <Box boxShadow='lg' p='6' rounded='md' bgColor='white'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} align='center'>
            <FormControl>
              <FormLabel htmlFor='username'>Username</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.300'
                  children={<FaUserAlt color='gray.300' />}
                />
                <Input
                  id='username'
                  placeholder='Please enter username'
                  type='text'
                  inputMode='text'
                  {...register('username')}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='password'>Password</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.300'
                  children={<FaLock color='gray.300' />}
                />
                <Input
                  id='password'
                  placeholder='Please enter password'
                  type={showPassword ? 'text' : 'password'}
                  inputMode='text'
                  {...register('password')}
                />
                <InputRightElement width='3.5rem'>
                  <IconButton
                    icon={
                      showPassword ? <BsFillEyeFill /> : <BsFillEyeSlashFill />
                    }
                    size='sm'
                    onClick={handleShowClick}
                    sx={{
                      bg: 'transparent',
                      _hover: {
                        bg: 'transparent',
                      },
                      _active: {
                        bg: 'transparent',
                      },
                      _focus: {
                        bg: 'transparent',
                      },
                    }}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button variant='primary' mt={4} type='submit' w='full'>
              Sign in
            </Button>
          </VStack>
        </form>
      </Box>
    </Stack>
  );
}

/*
eslint
  react/no-children-prop:0
*/
