import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Stack, Spinner} from '@chakra-ui/react';
import {
  selectIdFromDA,
  selectJsonDataFromDA,
} from '../../../../../../../../../slices/designAutomation/selectors';
import {
  getJsonDataForDesignAutomation,
  useGetDesignAutomationInfoByIdQuery,
} from '../../../../../../../../../slices/designAutomation/designAutomationSlice';
import CategoryFromJsonData from './features/CategoryFromJsonData'

const container = {
  mt: '1.25rem',
  border: '1px solid',
  borderColor: 'gray.300',
  w: 'full',
  h: '18.125rem',
  fontSize: '0.875rem',
  fontWeight: '300',
};

export default function RefetchToShowLoadingAndGetJsonData() {
  const [pollInterval, setPollInterval] = useState(5000);

  const jsonDataFromDA = useSelector(selectJsonDataFromDA)
  // const hasLoadingFromDA = useSelector(selectHasLoadingFromDA);

  const idFromDA = useSelector(selectIdFromDA);

  const {data} = useGetDesignAutomationInfoByIdQuery(idFromDA, {
    pollingInterval: pollInterval,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('data refetch:', data?.result);
    console.log('data state:', data?.result?.status);
    const status = data?.result?.status;
    if (status < 1) {
      setPollInterval(0);
      if (status === -1) {
        // show error message
        console.error('Can get json data of design automation from server');
      } else {
        const stringJsonData = data?.result?.data;
        if (stringJsonData) {
          // TODO: check getJsonData logic
          dispatch(getJsonDataForDesignAutomation(stringJsonData));
        }
      }
    }
  }, [data]);

  // {!hasLoadingFromDA && !jsonDataFromDA && <Spinner size='xl' />}
  return (
    <Stack
      sx={container}
      justify='center'
      align='center'
      border='1px dashed'
      borderColor='gray.300'
    >
      {!jsonDataFromDA && <Spinner size='xl' />}
      {jsonDataFromDA && <CategoryFromJsonData />}
    </Stack>
  );
}
