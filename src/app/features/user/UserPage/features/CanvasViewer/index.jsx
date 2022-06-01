import {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import './canvasViewer.css';
import {Switch} from 'antd';
import {
  selectIsLoadingModelFromMD,
  selectUrnFromMD,
} from '../../../../../slices/modelDerivative/selectors';
import {selectTokenOAuth2LeggedFromOAUTH} from '../../../../../slices/oAuth';
import {
  selectIsFirstTimeLoadViewerFromFV,
  selectHaveSelectedViewFromFV,
  selectGuid2dViewFromFV,
  selectGuid3dViewFromFV,
} from '../../../../../slices/forgeViewer';
import Forge2DViewer from './features/Forge2DViewer';
import Forge3DViewer from './features/Forge3DViewer';
import ForgeViewerFirstTime from './features/ForgeViewerFirstTime';
import ForgeViewerTest from './features/ForgeViewerTest/ForgeViewerTest';

const TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJ2aWV3YWJsZXM6cmVhZCJdLCJjbGllbnRfaWQiOiJHQ0I1RFRwWHVDcU5LMmtOejQ4blJ2R3dudEFrQlRMMSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9hand0ZXhwNjAiLCJqdGkiOiJuUVhzZENiVmJHaXNHaUpaaTZRbVBqbE40UGRuQVpGQ3pVVFFJWldaZUNpQTRUY3NrZW5QcUxZdjFqSUhWUmdrIiwiZXhwIjoxNjU0MDc1MjAzfQ.SDj3fTeC24LGK-2bf4xPgwAYBm78dmhHoogaUn5Xx-x_2LaNemq8sxWgQoxH_e5agcqC3HGiu1MvVh6V__kGEkx2Zamr0PCoIMcaDh1LBZXgCSQxbbVfQmKvpAlxXUqBlTqwzbSEwsHFLpoMi5CjhepZCw9RcNyKoOHqDJEHFKDYJBTYikwCTHr-QTO2dRKOXciRGXiEMs9sZXdWPmRRWzseIxihI6dwcnwpVo8m55bDqlGJA1_TmDHdFMO5FanDEK8n4-aSbsHM76Hf5KFtGITkpSSzuWwo0DShivPZXEoh_IjGBuE6JqnPhggP_QcS650h1QaYGHRE2C_2NCJMQw';
const URN =
  'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dXNlcjEtMjAyMjA2MDEwNDMwMTEtdmFsaWRhdGlvbmRvb3IucnZ0LWRhL1ZhbGlkYXRpb25Eb29yLnJ2dA';
const g2d = '951810cc-7a73-4765-9179-f5744ba5d821-0003407c';
const g3d = '78a2d1da-461b-235a-192f-223b10401d32';

export default function CanvasViewer() {
  const [urn, setUrn] = useState('');
  const [token, setToken] = useState('');
  const [showSplitViewer, setShowSplitViewer] = useState(false);

  const urnFromMD = useSelector(selectUrnFromMD);
  const isLoadingModel = useSelector(selectIsLoadingModelFromMD);
  const token2Legged = useSelector(selectTokenOAuth2LeggedFromOAUTH);
  const isFirstTimeLoadViewerFromFV = useSelector(
    selectIsFirstTimeLoadViewerFromFV,
  );
  const haveSelectedView = useSelector(selectHaveSelectedViewFromFV);
  const guid2D = useSelector(selectGuid2dViewFromFV);
  const guid3D = useSelector(selectGuid3dViewFromFV);

  useEffect(() => {
    if (urnFromMD) {
      setUrn(urnFromMD);
    }
  }, [urnFromMD]);

  useEffect(() => {
    if (token2Legged) {
      setToken(token2Legged);
    }
  }, [token2Legged]);

  const handleShowHideView = useCallback(() => {
    setShowSplitViewer((prev) => !prev);
  }, []);

  const applyExtension = useCallback(() => {
    // apply extension here...

  }, []);

  // TODO: Show viewer at background, check
  // if (current urn !== prevUrn) => load all view
  // else only hidden

  // TODO: show extension Document only in split window.

  return (
    <>
    <div className='extensions-ribbon'>
      <div>
        <span>Splited viewers</span>
        <Switch defaultChecked onChange={handleShowHideView} />
      </div>
    </div>
      {!showSplitViewer && (
        <>
        <ForgeViewerTest token={TOKEN} urn={URN} guid={g3d} />
        <div className='grid-forge-viewer-container'>
          {/* <ForgeViewerTest token={TOKEN} urn={URN} guid={g2d} /> */}
          {/* <ForgeViewerTest token={TOKEN} urn={URN} guid={g3d} /> */}
        </div>
        </>
      )}
      <div>
        {/* {!urnFromMD && !token2Legged && <Empty className='center-position' />} */}
        {!isLoadingModel &&
          showSplitViewer &&
          urnFromMD &&
          token2Legged &&
          isFirstTimeLoadViewerFromFV && (
            <ForgeViewerFirstTime token={token} urn={urn} />
          )}
        {!isLoadingModel &&
          showSplitViewer &&
          !isFirstTimeLoadViewerFromFV &&
          urnFromMD &&
          token2Legged &&
          guid2D &&
          !haveSelectedView && (
            <Forge2DViewer token={token} urn={urn} guid2D={guid2D} />
          )}
        {!isLoadingModel &&
          showSplitViewer &&
          !isFirstTimeLoadViewerFromFV &&
          urnFromMD &&
          token2Legged &&
          guid2D &&
          haveSelectedView && (
            <Forge2DViewer token={token} urn={urn} guid2D={guid2D} />
          )}
        {!isLoadingModel &&
          showSplitViewer &&
          !isFirstTimeLoadViewerFromFV &&
          urnFromMD &&
          token2Legged &&
          guid3D &&
          haveSelectedView && (
            <Forge3DViewer token={token} urn={urn} guid3D={guid3D} />
          )}
        {!isLoadingModel &&
          showSplitViewer &&
          !isFirstTimeLoadViewerFromFV &&
          urnFromMD &&
          token2Legged &&
          guid3D &&
          !haveSelectedView && (
            <Forge3DViewer token={token} urn={urn} guid3D={guid3D} />
          )}
      </div>
    </>
  );
}
