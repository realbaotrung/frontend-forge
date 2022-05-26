import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Text, VStack, Spinner} from '@chakra-ui/react';
import {selectIdFromDA} from '../../../../../../../../../slices/designAutomation/selectors';
import {
  setJsonDataFromServer,
  useGetDesignAutomationInfoByIdQuery,
} from '../../../../../../../../../slices/designAutomation/designAutomationSlice';

export default function RefetchToShowLoadingAndGetJsonData() {
  const [pollInterval, setPollInterval] = useState(10000);

  const idFromDA = useSelector(selectIdFromDA);

  const {data} = useGetDesignAutomationInfoByIdQuery(idFromDA, {
    pollingInterval: pollInterval,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('data refetch:', data?.result);
    console.log('data state:', data?.result?.status);
    const status = data?.result?.status;
    const stringJsonData = data?.result?.data;

    if (status < 1) {
      if (status === -1) {
        // show error message
        setPollInterval(0);
        console.error('Can get json data of design automation from server');
      }
      if (status === 0 && stringJsonData) {
        setPollInterval(0);
        dispatch(setJsonDataFromServer(stringJsonData));
      }
    }
  }, [data]);

  return (
    <VStack w='full' h='18.125rem' justify='center' align='center'>
      <Spinner pb='0.75rem' size='lg' />
      <Text fontSize='1.25em'>In processing ...</Text>
    </VStack>
  );
}
