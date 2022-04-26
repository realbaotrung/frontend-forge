import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  useGetOssBucketsQuery,
  useGetOssBucketByIdQuery,
} from '../../../../../slices/oss/ossSlice';
import {
  selectBucketsFromOSS,
  selectBucketFromOSS,
  selectOssBucketKeyFromOSS,
} from '../../../../../slices/oss/selectors';
import ForgeTree from './ForgeTree';
import ForgeViewer from '../../../../../../utils/ForgeViewer';

// TODO: implement get accessToken from 2 legged ( or 3 legged )

// TODO: Implement Tree data

const getToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJ2aWV3YWJsZXM6cmVhZCJdLCJjbGllbnRfaWQiOiJORjh6Rlk0Uk5VQzc4Mmc2T3ZsY2NtMG45MkI3eFVncSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9hand0ZXhwNjAiLCJqdGkiOiJIYU1NQlZwOVZyMlRxVFhyNTdsZDQxMHVoeGF4RnV3S0tDeFllaDVjNzRxVWxqeVZQdUdlakhUQXljSGxLOWszIiwiZXhwIjoxNjUwOTcyNzIxfQ.bJq_rtCYDZiqQ3MX6EMGTzghrCU4gBYKrA_RcETRYNPfeZISKOpZRqmaVPQa-1a_Pz_ULAH_B0KoUMGZDObBkrjb5M3mnIJSRMwa7KcMJejI2_xhGoc8tIqMawT-9ff9dntpH5qe_YX04tyhBGfGByv0DKbYtWLvvcXWAAOfEaZE9PAL7NJNAkPR6oGK9U7mPhitG6yHVemoSsbGZEbItH5Tt_-xVpxj0ABiVXk7nsLekCrqckkFrlB7fkEExj-d6yw62MPohtq6ZufkAuM14bzGsozyib1BKUIkpxhKnF8pc0pD0dh2O1FdkzJkMDj36y8kRPLJe9NwJISClxM0uQ';
const urnTest =
  'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dXNlcjEtMjAyMjA0MjIwMjExMDYtZmlsZXJldml0LnJ2dC1kYS9maWxlcmV2aXQucnZ0';

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

  useEffect(() => {
    if (isLoading) {
      console.log('Loading buckets data...');
    }
    if (isSuccess) {
      console.log('Success buckets data:', buckets);
    }
    if (isError) {
      console.log(error);
    }
  }, [buckets]);
  // const buckets = useSelector(selectBucketsFromOSS);
  // const bucket = useSelector(selectBucketFromOSS)
  // const ossBucketKey = useSelector(selectOssBucketKeyFromOSS);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!buckets) {
  //     dispatch(useGetOssBucketsQuery());
  //   }
  // }, [buckets]);

  // useEffect(() => {
  //   if (ossBucketKey && buckets) {
  //     dispatch(useGetOssBucketsQuery());
  //   }
  // }, [ossBucketKey, buckets]);

  const handleSeturn = useCallback(
    (data) => {
      console.log(data);
      setUrn(data);
    },
    [setUrn],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'row nowrap',
        width: '100%',
        height: '100%',
      }}
    >
      <div style={{width: '256px', backgroundColor: 'azure'}}>
        {isLoading ? (
          'Loading data...'
        ) : (
          <ForgeTree setUrn={(data) => handleSeturn(data)} />
        )}
      </div>
      <div style={{backgroundColor: 'bisque', width: '100%'}}>
        {urn && (
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
