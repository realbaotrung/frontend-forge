import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Progress,
  Box,
  Stack,
  Text,
} from '@chakra-ui/react';

import {AiOutlineCloudUpload} from 'react-icons/ai';
import ButtonUploadFilesFromLocal from './features/ButtonUploadFiles';
import DragFilesFromLocal from './features/DragFilesFromLocal';
import RefetchToShowLoadingAndGetJsonData from './features/RefetchToShowLoadingAndGetJsonData';

import {
  selectHasLoadingFromDA, selectIsErrorFromDA,
  selectJsonCategoryDataFromDA,
  selectRevitFileNameFromDA,
} from '../../../../../../../slices/designAutomation/selectors';
import {resetDesignAutomationState} from '../../../../../../../slices/designAutomation/designAutomationSlice';

function ButtonModalUploadFiles({onOpen}) {
  return (
    <Button
      onClick={onOpen}
      leftIcon={<AiOutlineCloudUpload size='20px' />}
      variant='primary'
      sx={{
        bg: 'Blue.B400',
        _hover: {
          bg: 'Blue.B300',
          color: 'NeutralLight.N0',
        },
        _active: {
          bg: 'Blue.B400',
        },
        _focus: {
          bg: 'Blue.B400',
        },
      }}
    >
      Upload files
    </Button>
  );
}

ButtonModalUploadFiles.propTypes = {
  onOpen: PropTypes.func.isRequired,
};

function FileIsUploading() {
  return (
    <Stack w='full' h='18.125rem' justify='center' align='center'>
      <Text fontSize='1.25em'>Your file is uploading to cloud ...</Text>
    </Stack>
  );
}

function FileIsUploaded() {
  return (
    <Stack w='full' h='18.125rem' justify='center' align='center'>
      <Text fontSize='1.25em'>File is uploaded successfully!</Text>
    </Stack>
  );
}

function FailToUploadFile() {
  return (
    <Stack w='full' h='18.125rem' justify='center' align='center'>
      <Text fontSize='1.25em'>Fail to upload file to server!</Text>
    </Stack>
  );
}

const modelHeaderCSS = {
  fontWeight: '300',
  borderBlockEnd: '1px solid',
  borderBlockEndColor: 'gray.300',
};
const modelFooterCSS = {
  px: '1.5rem',
  py: '1rem',
  borderBlockStart: '1px solid',
  borderBlockStartColor: 'gray.300',
};
const modalCloseButtonCSS = {
  color: 'gray.400',
  borderColor: 'transparent',
  _hover: {
    color: 'Blue.B300',
    borderColor: 'transparent',
  },
  _active: {
    color: 'Blue.B500',
    borderColor: 'transparent',
  },
};
const compoundComponentsCSS = {
  mt: '1.25rem',
  border: '1px solid',
  borderColor: 'gray.300',
  w: 'full',
  fontSize: '0.875rem',
  fontWeight: '300',
};

export default function FormUploadFiles() {
  const [haveChosenFiles, setHaveChosenFiles] = useState(false);
  const {isOpen, onOpen, onClose} = useDisclosure();

  const dispatch = useDispatch();

  // Check loading when file is taken and push to the server
  const hasLoadingFromDA = useSelector(selectHasLoadingFromDA);
  const revitFileName = useSelector(selectRevitFileNameFromDA);
  const jsonCategoryDatafromDA = useSelector(selectJsonCategoryDataFromDA);
  const isError = useSelector(selectIsErrorFromDA);

  useEffect(() => {
    if (!hasLoadingFromDA && revitFileName) {
      setHaveChosenFiles(true);
    }
  });

  const handleOnClose = () => {
    dispatch(resetDesignAutomationState());
    setHaveChosenFiles(false);
    onClose();
  };

  return (
    <>
      <ButtonModalUploadFiles onOpen={onOpen} />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size='lg'
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent maxW='37.5rem' w='full'>
          <ModalHeader sx={modelHeaderCSS}>Upload files</ModalHeader>
          <ModalCloseButton
            onClick={() => handleOnClose()}
            sx={modalCloseButtonCSS}
          />
          <ModalBody p='1rem 1.5rem'>
            <ButtonUploadFilesFromLocal />
            {hasLoadingFromDA && !isError && (
              <Progress size='xs' isIndeterminate />
            )}
            <Box sx={compoundComponentsCSS}>
              {hasLoadingFromDA && !isError && <FileIsUploading />}
              {isError && <FailToUploadFile />}
              {!haveChosenFiles && !hasLoadingFromDA && !isError && <DragFilesFromLocal />}
              {haveChosenFiles && !jsonCategoryDatafromDA && !isError && (
                <RefetchToShowLoadingAndGetJsonData />
              )}
              {haveChosenFiles && jsonCategoryDatafromDA && !isError && <FileIsUploaded />}
            </Box>
          </ModalBody>
          <ModalFooter sx={modelFooterCSS}>
            <Button
              onClick={() => handleOnClose()}
              mr={3}
              isDisabled={(!revitFileName && !isError)}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

/*
eslint
  max-len:0
*/
