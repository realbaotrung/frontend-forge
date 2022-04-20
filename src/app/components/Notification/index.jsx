/* eslint-disable object-shorthand */
import React from 'react'
import PropTypes from 'prop-types'
import { notification } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const Notification = (message, description, status) => {

  notification.open({
    icon: <CheckCircleOutlined />,
    className: 'noti-success',
    message: <div className='noti-success'>message</div>,
    description: description,
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
};

Notification.propTypes = {}

export default Notification
