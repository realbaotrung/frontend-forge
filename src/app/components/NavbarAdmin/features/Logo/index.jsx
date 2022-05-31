import {HStack, Text, Icon} from '@chakra-ui/react';
import {ReactComponent as HatLogo} from '../../assets/hat-logo.svg';

export default function Logo() {
  return (
    <HStack spacing={2}>
      <Icon as={HatLogo} boxSize='32px' />
      <Text fontWeight='600'>Harmony AT</Text>
    </HStack>
  );
}
