import {HStack} from '@chakra-ui/react';
import Nav from './features/Nav';
import Logo from './features/Logo';

export default function NavBar() {
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
      <Logo />
      <Nav />
    </HStack>
  );
}
