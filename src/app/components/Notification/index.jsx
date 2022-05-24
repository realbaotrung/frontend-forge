/* eslint-disable object-shorthand */
import React from 'react';
import PropTypes from 'prop-types';
import {notification} from 'antd';
import {CheckCircleOutlined} from '@ant-design/icons';

const Notification = (status, description) => {
  const statusLowwer = `noti-${status.toLowerCase()}`;

  notification.open({
    icon: <CheckCircleOutlined />,
    className: statusLowwer,
    message: <div className={statusLowwer}>{status}</div>,
    description: description,
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
};

Notification.propTypes = {};

export default Notification;
