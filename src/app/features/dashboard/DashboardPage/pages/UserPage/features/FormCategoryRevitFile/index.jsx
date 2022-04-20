import {Button} from '@chakra-ui/react';
import PropTypes from 'prop-types';

function ButtonShowCategoryForm({onOpen}) {
  return (
    <Button
      onClick={onOpen}
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
      Category
    </Button>
  );
}

ButtonShowCategoryForm.propTypes = {
  onOpen: PropTypes.func.isRequired,
};

export default function FormCategoryRevitFile() {
  return (
    <ButtonShowCategoryForm onOpen={() => {}}/>
  )
}