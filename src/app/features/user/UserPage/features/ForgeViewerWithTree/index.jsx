import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Typography, Empty, Menu, Spin} from 'antd';
import {
  Html5Outlined,
  WindowsOutlined,
  CodeSandboxOutlined,
} from '@ant-design/icons';
import {useGetOssBucketsQuery} from '../../../../../slices/oss/ossSlice';
import {
  selectIsLoadingModelFromMD,
  selectUrnFromMD,
} from '../../../../../slices/modelDerivative/selectors';
import {selectTokenOAuth2LeggedFromOAUTH} from '../../../../../slices/oAuth/selectors';
import {
  selectIsFirstTimeLoadViewerFromFV,
  selectView2DsFromFV,
  selectView3DsFromFV,
  selectHaveSelectedViewFromFV,
  selectGuid2dViewFromFV,
  selectGuid3dViewFromFV,
} from '../../../../../slices/forgeViewer/selectors';
import ForgeTree from './ForgeTree';
import Forge2DViewer from './Forge2DViewer';
import Forge2DList from './Forge2DList';
import Forge3DViewer from './Forge3DViewer';
import Forge3DList from './Forge3DList';
import ForgeViewerFirstTime from './ForgeViewerFirstTime';

const {SubMenu} = Menu;
const {Text} = Typography;

export default function ForgeViewerWithTree() {
  const [urn, setUrn] = useState('');
  const [token, setToken] = useState('');
  const urnFromMD = useSelector(selectUrnFromMD);
  const isLoadingModel = useSelector(selectIsLoadingModelFromMD);
  const {
    data: buckets = [],
    isLoading,
    isSuccess: isSuccessGetBuckets,
    isError,
    error,
  } = useGetOssBucketsQuery();

  const token2Legged = useSelector(selectTokenOAuth2LeggedFromOAUTH);
  const isFirstTimeLoadViewerFromFV = useSelector(
    selectIsFirstTimeLoadViewerFromFV,
  );
  const haveSelectedView = useSelector(selectHaveSelectedViewFromFV);
  const view2Ds = useSelector(selectView2DsFromFV);
  const view3Ds = useSelector(selectView3DsFromFV);
  const guid2D = useSelector(selectGuid2dViewFromFV);
  const guid3D = useSelector(selectGuid3dViewFromFV);

  // const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccessGetBuckets) {
      console.log('Success buckets data:', buckets);
    }
    if (isError) {
      console.log(error);
    }
  }, [isSuccessGetBuckets]);

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
          minWidth: '272px',
          width: '272px',
          backgroundColor: '#fff',
          position: 'relative',
          height: 'calc(100vh - 96px)',
          overflow: 'auto',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {isLoading ? (
          <Spin tip='Loading Tree data...' className='center-position' />
        ) : (
          <Menu mode='inline' defaultOpenKeys={['ForgeTreeSubMenu']}>
            <SubMenu
              icon={<Html5Outlined style={{fontSize: '1.5em'}} />}
              key='ForgeTreeSubMenu'
              title={[
                <Text key='Document' style={{fontWeight: '600'}}>
                  Documents {`(${buckets.length})`}
                </Text>,
              ]}
            >
              <ForgeTree />
            </SubMenu>
            {view2Ds && (
              <SubMenu
                icon={<WindowsOutlined style={{fontSize: '1.5em'}} />}
                key='Forge2DListSubMenu'
                title={[
                  <Text key='Sheets' style={{fontWeight: '600'}}>
                    Sheets {`(${view2Ds.length})`}
                  </Text>,
                ]}
              >
                <Forge2DList />
              </SubMenu>
            )}
            {view3Ds && (
              <SubMenu
                icon={<CodeSandboxOutlined style={{fontSize: '1.5em'}} />}
                key='Forge3DListSubMenu'
                title={[
                  <Text key='3dViews' style={{fontWeight: '600'}}>
                    3D Views {`(${view3Ds.length})`}
                  </Text>,
                ]}
              >
                <Forge3DList />
              </SubMenu>
            )}
          </Menu>
          // <Forge3DList />
        )}
      </div>
      <div
        style={{
          backgroundColor: '#fafafa',
          width: '100%',
          position: 'relative',
        }}
      >
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
    </div>
  );
}

// TODO: check reload view2D
