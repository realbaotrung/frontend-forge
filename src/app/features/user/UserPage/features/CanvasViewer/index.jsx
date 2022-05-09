import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import './canvasViewer.css';
import {Empty} from 'antd';
import {
  selectIsLoadingModelFromMD,
  selectUrnFromMD,
} from '../../../../../slices/modelDerivative/selectors';
import {selectTokenOAuth2LeggedFromOAUTH} from '../../../../../slices/oAuth/selectors';
import {
  selectIsFirstTimeLoadViewerFromFV,
  selectHaveSelectedViewFromFV,
  selectGuid2dViewFromFV,
  selectGuid3dViewFromFV,
} from '../../../../../slices/forgeViewer/selectors';
import Forge2DViewer from './features/Forge2DViewer';
import Forge3DViewer from './features/Forge3DViewer';
import ForgeViewerFirstTime from './features/ForgeViewerFirstTime';
import NameOfFileWithView from '../NameOfFileAndView';

export default function CanvasViewer() {
  const [urn, setUrn] = useState('');
  const [token, setToken] = useState('');

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

  return (
    <div>
      {!urnFromMD && !token2Legged && <Empty className='center-position' />}
      {!isLoadingModel &&
        urnFromMD &&
        token2Legged &&
        isFirstTimeLoadViewerFromFV && (
          <ForgeViewerFirstTime token={token} urn={urn} />
        )}
      {!isLoadingModel &&
        !isFirstTimeLoadViewerFromFV &&
        urnFromMD &&
        token2Legged &&
        guid2D &&
        !haveSelectedView && <Forge2DViewer token={token} urn={urn} />}
      {!isLoadingModel &&
        !isFirstTimeLoadViewerFromFV &&
        urnFromMD &&
        token2Legged &&
        guid2D &&
        haveSelectedView && <Forge2DViewer token={token} urn={urn} />}
      {!isLoadingModel &&
        !isFirstTimeLoadViewerFromFV &&
        urnFromMD &&
        token2Legged &&
        guid3D &&
        haveSelectedView && <Forge3DViewer token={token} urn={urn} />}
      {!isLoadingModel &&
        !isFirstTimeLoadViewerFromFV &&
        urnFromMD &&
        token2Legged &&
        guid3D &&
        !haveSelectedView && <Forge3DViewer token={token} urn={urn} />}
    </div>
  );
}
