import {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {ChevronDownIcon, ChevronUpIcon} from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Text,
  HStack,
  VStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
  useDisclosure,
} from '@chakra-ui/react';
import {selectUser} from '../../../../slices/auth/selectors';
import routePaths from '../../../../features/route/routePaths';
import {
  removeItemFromSS,
  storageItem,
} from '../../../../../utils/storage.utils';

const buttonPopoverTriggerCSS = {
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
};

const popoverContentCSS = {
  mt: '8px',
  mr: '8px',
  p: '24px',
  w: '250px',
  h: '166px',
  boxShadow: '2xl',
  _hover: {
    boxShadow: '2xl',
  },
  _active: {
    boxShadow: '2xl',
  },
  _focus: {
    boxShadow: '2xl',
  },
};

const stateSelector = createStructuredSelector({
  user: selectUser,
});

export default function Nav() {
  const [userFullName, setUserFullname] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const {isOpen, onOpen, onClose} = useDisclosure();

  const {user} = useSelector(stateSelector);

  const navigate = useNavigate();

  useEffect(() => {
    setUserFullname(user.username);
    setUserEmail(user.email);
  }, []);

  const handleSignOut = useCallback(async() => {
    removeItemFromSS(storageItem.auth);
    if (!sessionStorage.length) {
      navigate(routePaths.HOME_URL);
      window.location.reload();
    }
  }, [navigate]);

  return (
    <HStack spacing={2.5} h='2rem' borderColor='gray.400'>
      <Divider orientation='vertical' />
      <Avatar size='sm' name={userFullName} />
      <Popover isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>
          <Button
            px={0}
            rightIcon={
              isOpen ? (
                <ChevronUpIcon boxSize='20px' />
              ) : (
                <ChevronDownIcon boxSize='20px' />
              )
            }
            onClick={onOpen}
            sx={buttonPopoverTriggerCSS}
          >
            {userFullName}
          </Button>
        </PopoverTrigger>
        <PopoverContent sx={popoverContentCSS}>
          <PopoverArrow />
          <PopoverBody p={0}>
            <VStack spacing={10} justify='flex-start' align='flex-start'>
              <Box>
                <Text fontSize='14px' fontWeight='700'>
                  {userFullName}
                </Text>
                <Text fontSize='12px' fontWeight='400'>
                  {userEmail}
                </Text>
              </Box>
              <Box>
                <Button variant='primary' size='sm' onClick={handleSignOut}>
                  Sign out
                </Button>
              </Box>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </HStack>
  );
}
