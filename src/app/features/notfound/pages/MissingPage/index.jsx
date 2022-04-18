import {Box, Heading, Text} from '@chakra-ui/react';

export default function MissingPage() {
  return (
    <Box as='article' p='100px'>
      <Heading as='h1'>Oops!</Heading>
      <Text>Page Not Found</Text>
    </Box>
  );
}
