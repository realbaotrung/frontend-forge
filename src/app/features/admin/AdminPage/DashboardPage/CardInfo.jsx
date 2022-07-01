import {DollarOutlined} from '@ant-design/icons';
import './cardInfo.css';
import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useState} from 'react';
import {Card} from 'antd';

import {
  getDashboardDay,
  getDashboardMonth,
  selectDashboardDay,
  selectDashboardMonth,
} from '../../../../slices/dashboard/dashboardSlice';
import {getTotal} from '../../../../../utils/helpers.utils';

function CardInfo() {
  const [total, setTotal] = useState(0);

  const dispatch = useDispatch();
  const dashboardDay = useSelector(selectDashboardDay);
  const dashboardMonth = useSelector(selectDashboardMonth);

  const dataDay =
    dashboardDay.result.length === 0
      ? 0
      : dashboardDay?.result[dashboardDay.result.length - 2]?.cost;
  const dataMonth =
    dashboardMonth.result.length === 0
      ? 0
      : dashboardMonth?.result[dashboardMonth.result.length - 2]?.cost;
  useEffect(() => {
    dispatch(getDashboardDay());
  }, []);
  useEffect(() => {
    dispatch(getDashboardMonth());
  }, []);

  useEffect(() => {
    if (dashboardMonth) {
      setTotal(getTotal(dashboardMonth.result));
    }
  }, [dashboardMonth]);

  return (
    <div className='cards'>
      <div className='card'>
        <div className='content'>
          <div className='number'>{`$${dataDay}`}</div>
          <div className='card-name'>Yesterday</div>
        </div>

        <DollarOutlined className='icon' />
      </div>
      <div className='card'>
        <div className='content'>
          <div className='number'>{`$${dataMonth}`}</div>
          <div className='card-name'>Last month</div>
        </div>

        <DollarOutlined className='icon' />
      </div>
      <div className='card'>
        <div className='content'>
          <div className='number'>{`$${total}`}</div>
          <div className='card-name'>Total</div>
        </div>

        <DollarOutlined className='icon' />
      </div>

      {/* <Card>Content</Card>
      <Card>Content</Card> */}
    </div>
  );
}

export default CardInfo;
