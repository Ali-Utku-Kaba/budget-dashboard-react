import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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
  Legend
);

const TrendChart = ({ transactions = [], isDarkMode = false }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Get available years from transactions
  const getAvailableYears = () => {
    const years = new Set();
    transactions.forEach(transaction => {
      const year = new Date(transaction.date).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  const availableYears = getAvailableYears();

  // Process transactions to create monthly trend data for the full year
  const processTransactionData = (transactions, year) => {
    const monthlyData = {};
    
    // Initialize all 12 months for the year
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 12; i++) {
      const monthKey = `${year}-${String(i + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = {
        month: monthNames[i],
        income: 0,
        expenses: 0,
        monthIndex: i
      };
    }
    
    // Fill in actual transaction data
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      if (date.getFullYear() === year) {
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (monthlyData[monthKey]) {
          if (transaction.type === 'income') {
            monthlyData[monthKey].income += transaction.amount;
          } else {
            monthlyData[monthKey].expenses += Math.abs(transaction.amount);
          }
        }
      }
    });
    
    // Return all 12 months in order
    return Object.values(monthlyData).sort((a, b) => a.monthIndex - b.monthIndex);
  };

  const monthlyTrendData = processTransactionData(transactions, currentYear);

  const navigateYear = (direction) => {
    const newYear = currentYear + direction;
    setCurrentYear(newYear);
  };

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
          color: isDarkMode ? '#374151' : '#F1F5F9',
        },
        ticks: {
          font: {
            size: 11,
          },
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: isDarkMode ? '#374151' : '#F1F5F9',
        },
        ticks: {
          font: {
            size: 11,
          },
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
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
    <div>
      {/* Year Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateYear(-1)}
          className={`flex items-center space-x-1 px-3 py-1 text-sm ${
            isDarkMode 
              ? 'text-gray-400 hover:text-gray-200' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FiChevronLeft className="h-4 w-4" />
          <span>{currentYear - 1}</span>
        </button>
        
        <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{currentYear}</span>
        
        <button
          onClick={() => navigateYear(1)}
          className={`flex items-center space-x-1 px-3 py-1 text-sm ${
            isDarkMode 
              ? 'text-gray-400 hover:text-gray-200' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span>{currentYear + 1}</span>
          <FiChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      {/* Chart */}
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TrendChart; 