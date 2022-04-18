import {useState} from 'react';
import {Box, VStack, Icon, Text} from '@chakra-ui/react';
import {FileUploader} from 'react-drag-drop-files';
import {ReactComponent as Document} from './assets/document.svg';

// HACK: accept fileTypes here...
const fileTypes = ['PDF', 'XLSX', 'RVT', 'JPEG', 'PNG'];

// TODO: Implement Drag files make a state dispatch between Components...
export default function DragFilesFromLocal() {
  const [fileOrFiles, setFile] = useState(null);

  const handleChange = (_fileOrFiles) => {
    setFile(_fileOrFiles);
    console.log('changes:', _fileOrFiles);
  };
  const handleOnDraggingStateChange = (_draggingFile) => {
    console.log('dragging:', _draggingFile)
  }
  const onTypeError = (err = 1) => console.log(err);

  return (
    <Box mt='1.25rem' border='1px dashed' borderColor='gray.300'>
      <FileUploader
        fileOrFiles={fileOrFiles}
        onTypeError={onTypeError}
        name='FileUpload'
        types={fileTypes}
        handleChange={handleChange}
        onDraggingStateChange={handleOnDraggingStateChange}
      >
        <VStack w='full' h='18.125rem' justify='center' align='center'>
          <Icon as={Document} boxSize='9.375rem' />
          <Text fontSize='0.875rem' fontWeight='300' color='gray.400'>
            Drag files here or choose an option above
          </Text>
        </VStack>
      </FileUploader>
      {/* <Button onClick={() => setFile(null)}>Clear File</Button> */}
    </Box>
  );
}
