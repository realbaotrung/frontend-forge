import {useSelector} from 'react-redux';
import {Box} from '@chakra-ui/react';
import {selectJsonDataFromDA} from '../../../../../../../../../../../slices/designAutomation/selectors';

export default function CategoryFromJsonData() {
  const jsonData = useSelector(selectJsonDataFromDA);

  const strJsonData = JSON.stringify(jsonData);

  return <Box overflow='auto'>{strJsonData}</Box>;
}
