import { Line } from 'react-chartjs-2';
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
import { monthlyTrendData } from '../data/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrendChart = () => {
  const chartData = {
    labels: monthlyTrendData.map(data => data.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyTrendData.map(data => data.income),
        borderColor: '#4CAF50',
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#4CAF50',
        pointBorderColor: '#4CAF50',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Expenses',
        data: monthlyTrendData.map(data => data.expenses),
        borderColor: '#F44336',
        backgroundColor: '#F44336',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#F44336',
        pointBorderColor: '#F44336',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            family: 'system-ui, -apple-system, sans-serif'
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: '#F1F5F9',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: '#F1F5F9',
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          },
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TrendChart; 