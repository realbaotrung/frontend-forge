import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Text, VStack, Spinner} from '@chakra-ui/react';
import {
  selectIdFromDA,
} from '../../../../../../../slices/designAutomation/selectors';
import {
  getJsonDataFromServer,
  useGetDesignAutomationInfoByIdQuery,
} from '../../../../../../../slices/designAutomation/designAutomationSlice';

export default function RefetchToShowLoadingAndGetJsonData() {
  const [pollInterval, setPollInterval] = useState(10000);
  const [count, setCount] = useState(1);

  const idFromDA = useSelector(selectIdFromDA);

  const {data} = useGetDesignAutomationInfoByIdQuery(idFromDA, {
    pollingInterval: pollInterval,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('data refetch:', data?.result);
    console.log('data state:', data?.result?.status);
    const status = data?.result?.status;
    if (status < 1 || count === 0) {
      setPollInterval(0);
      if (status === -1) {
        // show error message
        console.error('Can get json data of design automation from server');
      } else {
        const stringJsonData = data?.result?.data;
        if (!stringJsonData && count > 0) {
          // TODO: check getJsonData logic
          setCount(0);
          setPollInterval(10000);
        } else {
          dispatch(getJsonDataFromServer(stringJsonData));
        }
      }
    }
  }, [data]);

  // {!hasLoadingFromDA && !jsonDataFromDA && <Spinner size='xl' />}
  return (
    <VStack w='full' h='18.125rem' justify='center' align='center'>
      <Spinner pb='0.75rem'size='lg' />
      <Text fontSize='1.25em'>
        In processing ...
      </Text>
    </VStack>
  );
}
