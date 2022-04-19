import {useSelector} from 'react-redux';
import {Box} from '@chakra-ui/react';
import {selectJsonDataFromDA} from '../../../../../../../../../../../slices/designAutomation/selectors';
import { category } from '../../../../share/category';

export default function CategoryFromJsonData() {
  const jsonData = useSelector(selectJsonDataFromDA);

  // const strJsonData = JSON.stringify(jsonData);
  const strJsonData = category;

  return <Box>{strJsonData}</Box>;
}
