/* eslint-disable react/prop-types */
import {Link} from 'react-router-dom';
import {Layout, Menu, Row, Col} from 'antd';
import {VideoCameraOutlined, BarChartOutlined} from '@ant-design/icons';

import Nav from './features/Nav';
import Logo from './features/Logo';

const {Header, Content, Footer} = Layout;

export default function NavBarAdmin({children}) {
  return (
    <Layout className='layout'>
      <Header>
        <Row>
          <Col span={3} order={1} xs={{span: 10}} md={{span: 7}} lg={{span: 3}}>
            <Logo />
          </Col>
          <Col
            span={17}
            order={2}
            xs={{span: 4}}
            md={{span: 10}}
            lg={{span: 17}}
          >
            <Menu theme='light' mode='horizontal'>
              <Menu.Item key='1' icon={<VideoCameraOutlined />}>
                <Link to='/admin/bundle'>Bundle</Link>
              </Menu.Item>
              <Menu.Item key='2' icon={<VideoCameraOutlined />}>
                <Link to='/admin/categories'>Bundle Category</Link>
              </Menu.Item>
              <Menu.Item key='3' icon={<VideoCameraOutlined />}>
                <Link to='/admin/check-standard'>Check Standard</Link>
              </Menu.Item>
              <Menu.Item key='4' icon={<BarChartOutlined />}>
                <Link to='/admin/dashboard'>Dashboard</Link>
              </Menu.Item>
            </Menu>
          </Col>
          <Col span={4} order={3} xs={{span: 10}} md={{span: 7}} lg={{span: 3}}>
            <Nav />
          </Col>
        </Row>
      </Header>
      <Content className='main-content' style={{padding: '0 50px'}}>
        <div className='site-layout-content'>{children}</div>
      </Content>
      <Footer style={{textAlign: 'center'}}>Harmony AT ©2022</Footer>
    </Layout>
  );
}
