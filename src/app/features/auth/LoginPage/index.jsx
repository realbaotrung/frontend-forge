import {VStack, Heading, Icon} from '@chakra-ui/react';
import {ReactComponent as Hat} from './assets/harmony-at.svg';
import LoginForm from './features/LoginForm';

export default function LoginPage() {
  return (
    <VStack
      w='100wh'
      h='100vh'
      justify='center'
      align='center'
      spacing={8}
      bgColor='#F0F2F5'
    >
      <Icon as={Hat} w='320px' h='auto' />
      <Heading as='h1' fontSize='2xl' fontWeight='300'>
        Sign in to Autodesk Forge
      </Heading>
      <LoginForm />
    </VStack>
  );
}
