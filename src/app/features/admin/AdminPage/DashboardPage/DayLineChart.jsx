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
  maintainAspectRatio: true,
  plugins: {
    tooltip: {
      callbacks: {
        label(context) {
          let label = context.dataset.label || '';

          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(context.parsed.y);
          }
          return label;
        },
      },
    },
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Price per day',
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
  {label: '01 Jan', dataDay: 200},
  {label: '02 Jan', dataDay: 100},
  {label: '03 Jan', dataDay: 300},
  {label: '04 Jan', dataDay: 150},
  {label: '05 Jan', dataDay: 220},
  {label: '06 Jan', dataDay: 420},
  {label: '07 Jan', dataDay: 350},
  {label: '08 Jan', dataDay: 30},
  {label: '09 Jan', dataDay: 50},
  {label: '10 Jan', dataDay: 0},
  {label: '11 Jan', dataDay: 20},
  {label: '12 Jan', dataDay: 10},
];
export const data = {
  labels: fakeData.map((datas) => datas.label),
  datasets: [
    {
      label: 'Money',
      data: fakeData.map((datas) => datas.dataDay),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};
function DayLineChart() {
  return <Line height={200} width={600} options={options} data={data} />;
}
export default DayLineChart;
