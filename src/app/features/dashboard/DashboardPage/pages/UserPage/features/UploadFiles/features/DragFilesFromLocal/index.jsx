import { useDispatch } from 'react-redux';
import {Box, VStack, Icon, Text} from '@chakra-ui/react';
import {FileUploader} from 'react-drag-drop-files';
import {ReactComponent as Document} from './assets/document.svg';
import { usePostDesignAutomationGetInfoProjectMutation, getRevitFileName } from '../../../../../../../../../slices/designAutomation/designAutomationSlice';

// HACK: accept fileTypes here...
const fileTypes = ['RVT'];

// TODO: Implement Drag files make a state dispatch between Components...
export default function DragFilesFromLocal() {
  const [postDesignAutomationGetInfoProject] =
    usePostDesignAutomationGetInfoProjectMutation();

  const dispatch = useDispatch();

  async function handleUploadFileToDA(inputFile) {
    try {
      console.log('file', inputFile);

      dispatch(getRevitFileName(inputFile.name))

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

  const onTypeError = (err = 1) => console.log(err);
  
  const content = (
      <div>
        <VStack w='full' h='18.125rem' justify='center' align='center'>
          <Icon as={Document} boxSize='9.375rem' />
          <Text fontSize='0.875rem' fontWeight='300' color='gray.400'>
            Drag revit file here or choose an option above
          </Text>
        </VStack>
      </div>
  )

  return (
    <Box mt='1.25rem' border='1px dashed' borderColor='gray.300' sx={{listStyle: 'none'}}>
      <FileUploader
        onTypeError={onTypeError}
        name='FileUpload'
        types={fileTypes}
        handleChange={(file) => handleUploadFileToDA(file)}
        hoverTitle={String(' ')}
        children={content}
      />
    </Box>
  );
}

/*
eslint react/no-children-prop: 0
*/