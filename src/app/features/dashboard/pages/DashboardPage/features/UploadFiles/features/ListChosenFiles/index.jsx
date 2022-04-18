import {Box} from '@chakra-ui/react';
// import RowVirtualizerCards from './Features/RowVirtualizerCards';
import NumberOfChosenFiles from './features/NumberOfChosenFiles';

const container = {
  mt: '1.25rem',
  border: '1px solid',
  borderColor: 'gray.300',
  w: 'full',
  h: '18.125rem',
  fontSize: '0.875rem',
  fontWeight: '300',
};

// TODO: Implement List Chosen Files (React virtual grid)
export default function ListChosenFiles() {
  return (
    <Box sx={container}>
      <NumberOfChosenFiles />
      {/* <RowVirtualizerCards /> */}
    </Box>
  );
}