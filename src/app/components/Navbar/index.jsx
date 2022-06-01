/* eslint-disable react/prop-types */
import { useCallback } from 'react';
import {Select} from 'antd';
import {useNavigate} from 'react-router-dom';
import {HStack} from '@chakra-ui/react';
import Nav from './features/Nav';
import Logo from './features/Logo';
import routes from '../../features/route/routeMap';

const {Option} = Select;

export default function NavBar() {
  const navigate = useNavigate();

  const handleOpenLink = useCallback((selectedValue) => {
    console.log(selectedValue);
    routes.forEach((route) => {
      if (route?.id === selectedValue?.value) {
        navigate(route.path);
      }
    });
  }, []);
  return (
    <HStack
      sx={{
        padding: '8px',
        justifyContent: 'space-between',
        width: '100%',
        height: '3rem',
        borderBlockEnd: '1px solid',
        borderBlockEndColor: 'gray.300',
      }}
    >
      <HStack gap={4}>
        <Logo />
        <Select labelInValue style={{width: '300px'}} onChange={handleOpenLink}>
          <Option key='userPage' value='userPage'>
            <b>Link to user page</b>
          </Option>
          <Option key='userCheckStandardPage' value='userCheckStandardPage'>
            <b>Link to user check standard page</b>
          </Option>
        </Select>
      </HStack>
      <Nav />
    </HStack>
  );
}
