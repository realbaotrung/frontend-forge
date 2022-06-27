import {DownOutlined} from '@ant-design/icons';
import {Button, Dropdown, Menu} from 'antd';
import FormCheckDoors from './features/FormCheckDoors';
import FormScheduleCategory from './features/FormScheduleCategory';

export default function Commands() {
  const menu = (
    <Menu >
      <Menu.Item key='form-schedule'><FormScheduleCategory /></Menu.Item>
      <Menu.Item key='form-check-doors'><FormCheckDoors /></Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <Button type='primary'>
        Commands <DownOutlined />
      </Button>
    </Dropdown>
  );
}
