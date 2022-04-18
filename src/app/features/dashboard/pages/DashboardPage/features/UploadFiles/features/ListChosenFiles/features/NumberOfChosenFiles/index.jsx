import {Box} from '@chakra-ui/react';

const numberOfChosenFilesCSS = {
  h: '30px',
  lineHeight: '30px',
};

// TODO: Implement number of files has uploaded
const numberOfFiles = 100;

export default function NumberOfChosenFiles() {
  return (
    <Box sx={numberOfChosenFilesCSS}>
      {numberOfFiles > 1 ? `${numberOfFiles} files` : '1 file'}
    </Box>
  );
}
