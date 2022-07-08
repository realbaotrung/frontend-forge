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
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <Button style={{marginRight: '0.5rem'}} onClick={() => setChoose(true)}>
          Day
        </Button>
        <Button onClick={() => setChoose(false)}>Month</Button>
      </div>

      <div>{choose ? <DayLineChart /> : <MonthLineChart />}</div>
    </>
  );
}

export default DashboardPage;
