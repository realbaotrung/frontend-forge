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
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  getDashboardDay,
  selectDashboardDay,
} from '../../../../slices/dashboard/dashboardSlice';

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
    tooltip: {
      usePointStyle: true,
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
        labelPointStyle(context) {
          return {
            pointStyle: 'circle',
            rotation: 0,
          };
        },
      },
    },
    legend: {
      position: 'top',
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
    x: {
      display: true,
      title: {
        display: true,
        text: 'Day',
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'USD$',
      },
    },
  },
};
function DayLineChart() {
  const dispatch = useDispatch();
  const dashboard = useSelector(selectDashboardDay);

  useEffect(() => {
    dispatch(getDashboardDay());
  }, []);

  const data = {
    labels: dashboard.result.map((datas) => datas.date),
    datasets: [
      {
        label: 'Money',
        data: dashboard.result.map((datas) => datas.cost),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        fill: false,
        tension: 0.4,
        cubicInterpolationMode: 'monotone',
      },
    ],
  };
  return <Line height={200} width={600} options={options} data={data} />;
}
export default DayLineChart;
