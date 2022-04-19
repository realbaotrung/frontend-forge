import {useSelector} from 'react-redux';
import {Box} from '@chakra-ui/react';
import {selectJsonDataFromDA} from '../../../../../../../../../slices/designAutomation/selectors';
import {category} from '../../share/category';

export default function CategoryFromJsonData() {
  const jsonData = useSelector(selectJsonDataFromDA);

  // const strJsonData = JSON.stringify(jsonData);
  const strJsonData = category;

  return (
    <Box overflow='auto' h='18.125rem' w='full'>
      {strJsonData}
    </Box>
  );
}

    // <Stack w='full' h='18.125rem' justify='center' align='center'>
    //   {strJsonData}
    // </Stack>