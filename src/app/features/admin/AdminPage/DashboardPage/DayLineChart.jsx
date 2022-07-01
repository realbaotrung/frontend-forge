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
  Filler,
} from 'chart.js';
import {useEffect, useMemo, useState} from 'react';
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
  Filler,
);

function DayLineChart() {
  const dispatch = useDispatch();
  const dashboard = useSelector(selectDashboardDay);

  useEffect(() => {
    dispatch(getDashboardDay());
  }, []);

  const options = useMemo(() => {
    return {
      responsive: true,
      stacked: false,
      plugins: {
        filler: {
          propagate: true,
        },
        tooltip: {
          usePointStyle: true,
          callbacks: {
            label(context) {
              let labels = context.dataset.label || '';

              if (labels) {
                labels += ': ';
              }
              if (context.parsed.y !== null && context.datasetIndex === 0) {
                labels += new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(context.parsed.y);
              } else if (
                context.parsed.y !== null &&
                context.datasetIndex === 1
              ) {
                labels += `${context.parsed.y}h`;
              }

              return labels;
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
          text: 'PRICE PER DAY',
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
            text: 'Days',
            font: {
              size: 18,
            },
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Cost (USD)',
            font: {
              size: 18,
            },
          },
          position: 'left',
        },
        y1: {
          display: true,
          title: {
            display: true,
            text: 'Processing times',
            font: {
              size: 18,
            },
          },
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    };
  }, [dashboard]);

  const data = useMemo(() => {
    return {
      labels: dashboard?.result?.map((dataTimeLine) => dataTimeLine.timeline),
      datasets: [
        {
          label: 'Cost',
          data: dashboard?.result?.map((dataCost) => dataCost.cost),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          fill: false,
          tension: 0.4,
          cubicInterpolationMode: 'monotone',
          yAxisID: 'y',
        },
        {
          label: 'Processing times',
          data: dashboard?.result?.map((dataTime) => dataTime.processingHour),
          borderColor: 'red',
          backgroundColor: 'red',
          tension: 0.4,
          cubicInterpolationMode: 'monotone',
          yAxisID: 'y1',
          fill: false,
        },
      ],
    };
  }, [dashboard]);

  return <Line height={200} width={600} options={options} data={data} />;
}
export default DayLineChart;
