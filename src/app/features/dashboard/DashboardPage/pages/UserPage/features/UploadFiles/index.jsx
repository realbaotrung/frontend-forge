import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';

import {AiOutlineCloudUpload} from 'react-icons/ai';
import ButtonUploadFiles from './features/ButtonUploadFiles';
import DragFilesFromLocal from './features/DragFilesFromLocal';
import ListChosenFiles from './features/ListChosenFiles';

// TODO: IMplement Button UploadFile
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
  onOpen: PropTypes.func.isRequired
}

/**
 * 1. Initilizing
//  * 2. upload progress bar (tinh)
//  * 3. Pending
//  * 4. Processing
 * 5. Uploaded..
 * @returns 
 */

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
const closeButtonCSS = {
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

/**
 * //TODO: Implement share state between components...
 */
export default function UploadFiles() {
  const [haveChosenFiles, setHaveChosenFiles] = useState(false)
  const {isOpen, onOpen, onClose} = useDisclosure();

  // TODO: Implement haveChosenFiles state to show ListChosenFile

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
          <ModalCloseButton sx={closeButtonCSS} />
          <ModalBody p='1rem 1.5rem'>
            <ButtonUploadFiles />
            {!haveChosenFiles ? <DragFilesFromLocal /> : <ListChosenFiles /> }
          </ModalBody>
          <ModalFooter sx={modelFooterCSS}>
            <Button mr={3} onClick={onClose} isDisabled={!haveChosenFiles}>
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
