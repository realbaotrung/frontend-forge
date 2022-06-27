import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import PropsType from 'prop-types';
import {LoadingOutlined} from '@ant-design/icons';
import {useGetDesignAutomationInfoByIdQuery} from '../../../../../../../../../slices/designAutomation/designAutomationSlice';
import {
  setIsLoadingJsonCheckDoorsDataFromServer,
  setJsonCheckDoorsData,
} from '../../../../../../../../../slices/forgeStandard/checkDoors';
import {alertErrorMessage} from '../../../../../../../../../../utils/helpers.utils';

export default function RefreshToGetJsonData({designInfoId, interval}) {
  const [pollInterval, setPollInterval] = useState(interval);

  const {data} = useGetDesignAutomationInfoByIdQuery(designInfoId, {
    pollingInterval: pollInterval,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('data refetch:', data?.result);
    console.log('data state:', data?.result?.status);
    const status = data?.result?.status;
    const stringJsonData = data?.result?.data;

    if (status < 1) {
      const title = 'Can get json data of design automation from server';
      if (status === -1) {
        // show error message
        setPollInterval(0);
        dispatch(setIsLoadingJsonCheckDoorsDataFromServer(false));
        console.error(title);
        alertErrorMessage(title);
      }
      if (status === 0) {
        if (!stringJsonData) {
          setPollInterval(0);
          dispatch(setIsLoadingJsonCheckDoorsDataFromServer(false));
          console.error(title);
          alertErrorMessage(title);
        } else {
          setPollInterval(0);
          dispatch(setIsLoadingJsonCheckDoorsDataFromServer(false));
          dispatch(setJsonCheckDoorsData(stringJsonData));
        }
      }
    }
  }, [data]);

  return <LoadingOutlined />;
}

RefreshToGetJsonData.propTypes = {
  designInfoId: PropsType.string.isRequired,
  interval: PropsType.number.isRequired,
};
