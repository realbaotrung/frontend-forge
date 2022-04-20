import {Route, Routes, useLocation, Link} from 'react-router-dom';
import {Layout, Menu, Breadcrumb} from 'antd';
import {UserOutlined, VideoCameraOutlined} from '@ant-design/icons';
import routes from './routeMap';
import RequireAuth from './RequireAuth';

import NavBar from '../../components/Navbar';
import Nav from '../../components/Navbar/features/Nav';
import Logo from '../../components/Navbar/features/Logo';

export default function RouterOutlet() {
  const {Header, Content, Footer} = Layout;

  const routeComponents = routes.map((routeItem) => {
    if (!routeItem.isAuth) {
      return (
        <Route
          key={routeItem.id}
          path={routeItem.path}
          element={routeItem.component}
        />
      );
    }
    return (
      <Route
        key={routeItem.id}
        path={routeItem.path}
        element={
          <RequireAuth>
            {/* <NavBar /> */}
            <NavBar isAdmin={routeItem.isAdmin}>{routeItem.component}</NavBar>
            
          </RequireAuth>
        }
      />
    );
  });

  return (
    // <Layout className='layout'>
    //   <Header>
    //     <div className='logo'>
    //       <Logo />
    //     </div>
    //     <Menu theme='light  ' mode='horizontal'>
    //       <Menu.Item key='1' icon={<UserOutlined />}>
    //         <Link to='/dashboard'>Home</Link>
    //       </Menu.Item>
    //       <Menu.Item key='2' icon={<VideoCameraOutlined />}>
    //         <Link to='/dashboard/categories'>Bundle Category</Link>
    //       </Menu.Item>
    //       <Menu.Item key='3' icon={<VideoCameraOutlined />}>
    //         <Link to='/dashboard/bundle'>Bundle</Link>
    //       </Menu.Item>
    //     </Menu>
    //     <div className='user-info'>
    //       <Nav />
    //     </div>
    //   </Header>
    //   <Content style={{padding: '0 50px'}}>
    //     <Breadcrumb style={{margin: '16px 0'}}>
    //       <Breadcrumb.Item>Home</Breadcrumb.Item>
    //       <Breadcrumb.Item>List</Breadcrumb.Item>
    //       <Breadcrumb.Item>App</Breadcrumb.Item>
    //     </Breadcrumb>
    //     <div className='site-layout-content'>
          <Routes>{routeComponents}</Routes>
    //     </div>
    //   </Content>
    //   <Footer style={{textAlign: 'center'}}>
    //     Ant Design ©2018 Created by Ant UED
    //   </Footer>
    // </Layout>
  );
}
