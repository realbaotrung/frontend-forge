import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  Layout,
  Tabs,
  Typography,
  Empty,
  Menu,
  Spin,
} from 'antd';
import {
  WindowsOutlined,
  CodeSandboxOutlined,
  EyeOutlined,
  FolderOpenOutlined,
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
import './style.css';

const {Sider} = Layout;
const {TabPane} = Tabs;
const {SubMenu} = Menu;
const {Text} = Typography;

// Border color: #f0f2f5

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

  const [collapsed, setCollapsed] = useState(false);
  const handleOnCollapse = () => {};

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
      <Layout>
        <Sider
          // width='272'
          width='320'
          style={{borderRight: '1px solid #fff'}}
          theme='light'
          collapsedWidth='64'
          className='user-tabs-tab'
        >
          {isLoading ? (
            <Spin className='center-position' />
          ) : (
          <Tabs
            defaultActiveKey='allViewsTabPane'
            tabBarStyle={{
              width: '4rem',
              height: 'calc(100vh - 96px)',
              borderRight: '1px solid #fff',
              backgroundColor: '#ececec',
            }}
            tabPosition='left'
            type='card'
          >
            <TabPane
              tab={[
                <FolderOpenOutlined
                  key='folderopenoutlined'
                  style={{fontSize: '1.5em'}}
                />,
              ]}
              key='allViewsTabPane'
            >
              <div
                key='Document'
                style={{
                  fontSize: '1.1em',
                  fontWeight: '600',
                  paddingLeft: '24px',
                  paddingTop: '16px',
                }}
              >
                Documents {`(${buckets.length})`}
              </div>
              <div style={{marginTop: '16px'}}>
                <ForgeTree />
              </div>
            </TabPane>
            <TabPane
              tab={[
                <EyeOutlined
                  key='eyeoutlined'
                  style={{fontSize: '1.5em'}}
                />,
              ]}
              key='futureTabPane'
            >
            <Menu mode='inline' defaultOpenKeys={['ForgeTreeSubMenu']}>
                <SubMenu
                  icon={<WindowsOutlined style={{fontSize: '1.5em'}} />}
                  key='Forge2DListSubMenu'
                  title={[
                    <Text key='Sheets' style={{fontWeight: '600'}}>
                      Sheets {view2Ds ? `(${view2Ds.length})`: `(0)`}
                    </Text>,
                  ]}
                >
              {view2Ds && (
                  <Forge2DList />
              )}
                </SubMenu>
                <SubMenu
                  icon={<CodeSandboxOutlined style={{fontSize: '1.5em'}} />}
                  key='Forge3DListSubMenu'
                  title={[
                    <Text key='3dViews' style={{fontWeight: '600'}}>
                      3D Views {view3Ds ? `(${view3Ds.length})` : `(0)`}
                    </Text>,
                  ]}
                >
              {view3Ds && (
                  <Forge3DList />
              )}
                </SubMenu>
            </Menu>
            </TabPane>
          </Tabs>)}
        </Sider>
      </Layout>
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
