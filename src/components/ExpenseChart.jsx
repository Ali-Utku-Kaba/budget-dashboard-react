import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ transactions, isDarkMode = false }) => {
  // Calculate expense distribution by category
  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
      return acc;
    }, {});

  // Define exact colors to match the first photo
  const categoryColors = {
    'Food & Dining': '#FF6B6B',
    'Transportation': '#4ECDC4', 
    'Shopping': '#9B59B6',
    'Entertainment': '#E91E63',
    'Bills & Utilities': '#FF9800',
    'Health & Fitness': '#4CAF50',
    'Education': '#3F51B5',
    'Other': '#95A5A6'
  };

  const chartData = {
    labels: Object.keys(expenseData),
    datasets: [
      {
        data: Object.values(expenseData),
        backgroundColor: Object.keys(expenseData).map(category => 
          categoryColors[category] || '#95A5A6'
        ),
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          color: isDarkMode ? '#ffffff' : '#374151',
          font: {
            size: 12,
            family: 'system-ui, -apple-system, sans-serif'
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const backgroundColor = dataset.backgroundColor[i];
                const meta = chart.getDatasetMeta(0);
                const hidden = meta.data[i] && meta.data[i].hidden;
                
                return {
                  text: label,
                  fillStyle: backgroundColor,
                  strokeStyle: backgroundColor,
                  lineWidth: 0,
                  pointStyle: 'circle',
                  hidden: hidden,
                  index: i,
                  // Add strikethrough for hidden items
                  textDecoration: hidden ? 'line-through' : 'none',
                  fontColor: isDarkMode ? '#ffffff' : '#374151'
                };
              });
            }
            return [];
          }
        },
        onClick: function(e, legendItem, legend) {
          const index = legendItem.index;
          const chart = legend.chart;
          const meta = chart.getDatasetMeta(0);
          
          // Toggle visibility
          meta.data[index].hidden = !meta.data[index].hidden;
          chart.update();
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#374151' : '#ffffff',
        titleColor: isDarkMode ? '#ffffff' : '#111827',
        bodyColor: isDarkMode ? '#ffffff' : '#111827',
        borderColor: isDarkMode ? '#6B7280' : '#E5E7EB',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 20,
        top: 0,
        bottom: 0
      }
    }
  };

  if (Object.keys(expenseData).length === 0) {
    return (
      <div className={`h-64 flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        No expense data available
      </div>
    );
  }

  return (
    <div className="h-64 relative">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default ExpenseChart; 