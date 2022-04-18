import {Box, Heading, Text, VStack} from '@chakra-ui/react';
import NavBar from '../../../../components/Navbar';
import UploadFiles from './features/UploadFiles';

// TODO: Bug, findDOMNode at InternalSubMenuList Component (by Antd)

export default function DashboardPage() {
  return (
  <Box as='section'>
    <NavBar />
    <UploadFiles />
    <Heading as='h1'>dashboard Page</Heading>
    <Text>this is a dashboard page.</Text>
  </Box>
  );
}
