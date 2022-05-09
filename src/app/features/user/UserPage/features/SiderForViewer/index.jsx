import {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Layout, Tabs, Typography, Menu, Badge} from 'antd';
import {
  WindowsOutlined,
  CodeSandboxOutlined,
  EyeOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import ForgeTree from './features/ForgeTree';
import Forge2DList from './features/Forge2DList';
import Forge3DList from './features/Forge3DList';
import FormScheduleCategory from './features/FormScheduleCategory';
import FormUploadFiles from './features/FormUploadFiles';
import {setIsChosenFile} from '../../../../../slices/modelDerivative/modelDerivativeSlice';
import {selectIsChosenFileFromMD} from '../../../../../slices/modelDerivative/selectors';
import {
  selectView2DsFromFV,
  selectView3DsFromFV,
} from '../../../../../slices/forgeViewer/selectors';
import {useGetOssBucketsQuery} from '../../../../../slices/oss/ossSlice';

const {Sider} = Layout;
const {TabPane} = Tabs;
const {SubMenu} = Menu;
const {Text} = Typography;

export default function SiderForViewer() {
  const {
    data: buckets = [],
    isSuccess: isSuccessGetBuckets,
    isError,
    error,
  } = useGetOssBucketsQuery();

  const currentChosenFile = useSelector(selectIsChosenFileFromMD);
  const view2Ds = useSelector(selectView2DsFromFV);
  const view3Ds = useSelector(selectView3DsFromFV);

  const dispatch = useDispatch();

  const totalViews = useMemo(() => {
    if (view2Ds && view3Ds) {
      return view2Ds.length + view3Ds.length;
    }
    return 0;
  }, [view2Ds, view3Ds]);

  useEffect(() => {
    if (isSuccessGetBuckets) {
      console.log('Success buckets data:', buckets);
    }
    if (isError) {
      console.log(error);
    }
  }, [isSuccessGetBuckets]);

  return (
    <Layout>
      <Sider
        width='320'
        style={{borderRight: '1px solid #fff'}}
        theme='light'
        collapsedWidth='64'
        className='user-tabs-tab'
      >
        {/* 
          {isLoading ? (
            <Spin className='center-position' />
          ) : (
          */}
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start',
              gap: '8px',
              padding: '8px',
              width: '100%',
              height: '48px',
            }}
          >
            <FormUploadFiles />
            <FormScheduleCategory />
          </div>
          <Tabs
            defaultActiveKey='TabPaneDocument'
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
                  key='FolderOpenOutlined'
                  style={{fontSize: '1.5em'}}
                />,
              ]}
              key='TabPaneDocument'
            >
              <div
                key='Document'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  height: '48px',
                  fontSize: '1.1em',
                  fontWeight: '600',
                  paddingLeft: '16px',
                }}
              >
                <span>Documents {`(${buckets.length})`}</span>
              </div>
              <div>
                <ForgeTree />
              </div>
            </TabPane>
            <TabPane
              tab={[
                // TODO: handle notification view when choose new file
                <button
                  key='buttonView2DsAndView3Ds'
                  type='button'
                  onClick={() => dispatch(setIsChosenFile(false))}
                >
                  <Badge count={currentChosenFile ? `${totalViews}` : '0'}>
                    <EyeOutlined
                      key='EyeOutlined'
                      style={{fontSize: '1.5em'}}
                    />
                  </Badge>
                </button>,
              ]}
              key='TabPaneView2DsAndView3Ds'
            >
              <Menu mode='inline'>
                <SubMenu
                  icon={<WindowsOutlined style={{fontSize: '1.5em'}} />}
                  key='Forge2DListSubMenu'
                  title={[
                    <Text key='Sheets' style={{fontWeight: '600'}}>
                      Sheets {view2Ds ? `(${view2Ds.length})` : `(0)`}
                    </Text>,
                  ]}
                >
                  {view2Ds && <Forge2DList />}
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
                  {view3Ds && <Forge3DList />}
                </SubMenu>
              </Menu>
            </TabPane>
          </Tabs>
        </>
        {/* )} */}
      </Sider>
    </Layout>
  );
}