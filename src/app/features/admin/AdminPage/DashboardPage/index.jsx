import {useState} from 'react';
import {Button, Space} from 'antd';
import MonthLineChart from './MonthLineChart';
import DayLineChart from './DayLineChart';
import CardInfo from './CardInfo';


function DashboardPage() {
  const [choose, setChoose] = useState(true);

  return (
    <>
     
        <CardInfo />
     
      <Space>
        <Button onClick={() => setChoose(true)}>Day</Button>
        <Button onClick={() => setChoose(false)}>Month</Button>
      </Space>

      <div>{choose ? <DayLineChart /> : <MonthLineChart />}</div>
    </>
  );
}

export default DashboardPage;
