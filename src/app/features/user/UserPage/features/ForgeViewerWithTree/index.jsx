import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Empty, Spin} from 'antd';
import {useGetOssBucketsQuery} from '../../../../../slices/oss/ossSlice';
import ForgeTree from './ForgeTree';
import ForgeViewer from '../../../../../../utils/ForgeViewer';
import {
  selectIsLoadingModelFromMD,
  selectUrnFromMD,
} from '../../../../../slices/modelDerivative/selectors';
import './forgeViewerWithTree.css';

// TODO: implement get accessToken from 2 legged ( or 3 legged )

const centerCSS = {};

const getToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJ2aWV3YWJsZXM6cmVhZCJdLCJjbGllbnRfaWQiOiJORjh6Rlk0Uk5VQzc4Mmc2T3ZsY2NtMG45MkI3eFVncSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9hand0ZXhwNjAiLCJqdGkiOiI5ZWJlcWd1RUpsak94UGU0VHJreHBWRnY1U1lqbFBaS29MaFpsQkdDZ3hPVjZBSUlKNE5CNHVXd2RvN1BqaTFMIiwiZXhwIjoxNjUwOTg2ODE1fQ.hCXVYntQjLLhhCxXEqPvO0lXm5sfbf7bgSML56kuW4YVhcuM8hIBqxgDUGdONy-3J7U_qDmjt9LvfNs-9Vqq_ETXJiwg52pei-wJvTZN0mSu0bIOpv8PBaSGDMn-EI6Rc_OnPeAb2qF2-HQdFC6dlevURFCfsUgvzCqFE_yLxYQFgVmhLD6ihlh1ljz9CcmqPl9cVNgyxB5_wiYaMTH1PIIobd_AwIxgcmXjzPgldSoAEmWW1SKhNetpLX7vYNBClCC1nHg6EjL28LFoMPOVqQWb0OM1LAXH-rkT2siuObJoAh5u2BjGFSn9IgY2Z1MeGvcctLaXiuVK3GxhFxUvqg';

export default function ForgeViewerWithTree() {
  // TODO: add Button refresh to get new Data, (see cache redux...)
  const {
    data: buckets = [],
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetOssBucketsQuery();
  const [urn, setUrn] = useState('');
  const urnFromMD = useSelector(selectUrnFromMD);
  const isLoadingModel = useSelector(selectIsLoadingModelFromMD);

  useEffect(() => {
    if (isSuccess) {
      console.log('Success buckets data:', buckets);
    }
    if (isError) {
      console.log(error);
    }
  }, [buckets]);

  useEffect(() => {
    if (urnFromMD) {
      setUrn(urnFromMD);
    }
  }, [urnFromMD]);

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'row nowrap',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          minWidth: '256px',
          width: '256px',
          backgroundColor: '#fff',
          position: 'relative',
        }}
      >
        {isLoading ? (
          <Spin tip='Loading Tree data...' className='center-position' />
        ) : (
          <ForgeTree />
        )}
      </div>
      <div
        style={{
          backgroundColor: '#fafafa',
          width: '100%',
          position: 'relative',
        }}
      >
        {!urnFromMD && <Empty className='center-position' />}
        {!isLoadingModel && urnFromMD && (
          <ForgeViewer
            token={getToken}
            urn={urn}
            className='forge-viewer adsk-viewing-viewer'
          />
        )}
      </div>
    </div>
  );
}
