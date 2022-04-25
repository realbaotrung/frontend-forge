/* eslint-disable react/prop-types */
import {HStack} from '@chakra-ui/react';
import {Route, Routes, useLocation, Link} from 'react-router-dom';
import {Layout, Menu, Breadcrumb, Row, Col} from 'antd';
import {UserOutlined, VideoCameraOutlined} from '@ant-design/icons';

import Nav from './features/Nav';
import Logo from './features/Logo';

const {Header, Content, Footer} = Layout;

    // <HStack
    //   sx={{
    //     padding: '8px',
    //     justifyContent: 'space-between',
    //     width: '100%',
    //     height: '3rem',
    //     borderBlockEnd: '1px solid',
    //     borderBlockEndColor: 'gray.300',
    //   }}
    // >
    //   <Logo />
    //   <Nav />
    // </HStack>
export default function NavBar({children, isAdmin}) {
  return (
     <Layout className='layout'>
      <Header>
        <Row>
        <Col span={3} order={1} xs={{ span: 10 }} md={{ span: 7 }} lg={{ span: 3 }}>
        <Logo />
      </Col>
        <Col span={17} order={2} xs={{ span: 4 }} md={{ span: 10 }} lg={{ span: 17 }}>
          {isAdmin ? <Menu theme='light' mode='horizontal'>
          <Menu.Item key='1' icon={<VideoCameraOutlined />}>
            <Link to='/admin/bundle'>Bundle</Link>
          </Menu.Item>
          <Menu.Item key='2' icon={<VideoCameraOutlined />}>
            <Link to='/admin/categories'>Bundle Category</Link>
          </Menu.Item>
          
        </Menu> : <div></div>}
        
        </Col>
      <Col span={4} order={3} xs={{ span: 10 }} md={{ span: 7 }} lg={{ span: 3 }}>
      <Nav />
      </Col>
        </Row>
      </Header>
      <Content className='main-content' style={{padding: '0 50px'}}>
        <div className='site-layout-content'>
          {children}
        </div>
      </Content>
      <Footer style={{textAlign: 'center'}}>
        Harmony AT ©2022
      </Footer>
    </Layout>
  );
}
