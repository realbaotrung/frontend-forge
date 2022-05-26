import {useDispatch} from 'react-redux';
import {FormControl, FormLabel, Input, Icon, Text, Box} from '@chakra-ui/react';
import {MdComputer} from 'react-icons/md';
import {
  usePostDesignAutomationGetInfoProjectMutation,
  setRevitFileName,
} from '../../../../../../../../../slices/designAutomation/designAutomationSlice';

// Accept fileType here...
const fileTypes = '.rvt';

const formLabelCSS = {
  cursor: 'pointer',
  width: 'full',
  margin: 0,
  px: '0.75rem',
  height: '2rem',
  minW: '2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  lineHeight: '1.2',
  fontWeight: '300',
  fontSize: '0.875rem',
  borderRadius: '0.1875rem',
  border: '1px solid',
  borderColor: 'gray.300',

  bg: 'transparent',
  _hover: {
    bg: 'gray.50',
  },
  _active: {
    bg: 'gray.100',
  },
};

export default function ButtonUploadFilesFromLocal() {
  const [postDesignAutomationGetInfoProject] =
    usePostDesignAutomationGetInfoProjectMutation();

  const dispatch = useDispatch();

  async function handleUploadFileToDA(inputFile) {
    try {
      console.log('file', inputFile);

      dispatch(setRevitFileName(inputFile.name));

      const formData = new FormData();
      formData.append('ClientId', 'abc123123321');
      formData.append('File', inputFile);

      // Add form data to post method
      const res = await postDesignAutomationGetInfoProject(formData).unwrap();
      console.log('Post get info:', res.result);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box>
      <FormControl>
        <FormLabel htmlFor='uploadFile' sx={formLabelCSS}>
          <Icon as={MdComputer} boxSize='20px' mr={2} />
          <Text as='span'>From your computer</Text>
        </FormLabel>
        <Input
          id='uploadFile'
          accept={fileTypes}
          type='file'
          onChange={(e) => handleUploadFileToDA(e.target.files[0])}
          hidden
        />
      </FormControl>
    </Box>
  );
}

/* eslint react/prop-types:0 */
