import {Line} from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Price per month',
      font: {
        size: 22,
      },
    },
  },
  scales: {
    y: {
      display: true,
      title: {
        display: true,
        text: 'USD$',
      },
    },
  },
};
const fakeData = [
  {label: 'January', dataMonth: 900},
  {label: 'February', dataMonth: 1500},
  {label: 'March', dataMonth: 0},
  {label: 'April', dataMonth: 3000},
  {label: 'May', dataMonth: 1700},
  {label: 'June', dataMonth: 4000},
  {label: 'July', dataMonth: 3400},
  {label: 'August', dataMonth: 3000},
  {label: 'September', dataMonth: 2300},
  {label: 'October', dataMonth: 1500},
  {label: 'November', dataMonth: 3500},
  {label: 'December', dataMonth: 5000},
];
export const data = {
  labels: fakeData.map((datas) => datas.label),
  datasets: [
    {
      label: 'Money',
      data: fakeData.map((datas) => datas.dataMonth),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

function MonthLineChart() {
  return <Line height={200} width={600} options={options} data={data} />;
}
export default MonthLineChart;
