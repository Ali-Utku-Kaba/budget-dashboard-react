import React from 'react';
import StatCard from '../components/StatCard';
import ExpenseChart from '../components/ExpenseChart';
import TrendChart from '../components/TrendChart';
import DateRangeFilter from '../components/DateRangeFilter';
import SearchBar from '../components/SearchBar';
import useFilters from '../hooks/useFilters';

const Dashboard = ({ transactions, isDarkMode = false, onNavigateToTransactions }) => {
  const {
    dateRange,
    setDateRange,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    filteredTransactions,
    statistics,
    categoryBreakdown,
    clearFilters,
    hasActiveFilters
  } = useFilters(transactions);

  // Get unique categories for filter
  const categories = [...new Set(transactions.map(t => t.category))];

  return (
    <div>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>Overview of your financial activities and insights</p>
      </div>

      {/* Advanced Filters Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 max-w-md">
            <SearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search transactions..."
              isDarkMode={isDarkMode}
            />
          </div>
          
          <DateRangeFilter 
            selectedRange={dateRange}
            onRangeChange={setDateRange}
            isDarkMode={isDarkMode}
          />
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'border-gray-700 bg-gray-800 text-gray-300' 
                : 'border-gray-300 bg-gray-50 text-gray-700'
            }`}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'border-gray-700 bg-gray-800 text-gray-300' 
                : 'border-gray-300 bg-gray-50 text-gray-700'
            }`}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category} className="capitalize">
                {category}
              </option>
            ))}
          </select>
          
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors text-red-600 hover:text-red-700 ${
                isDarkMode 
                  ? 'border-red-600 hover:bg-red-600/10' 
                  : 'border-red-300 hover:bg-red-50'
              }`}
            >
              Clear Filters
            </button>
          )}
        </div>
        
        {hasActiveFilters() && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Showing {filteredTransactions.length} of {transactions.length} transactions</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Balance"
          value={`$${statistics.balance.toLocaleString()}`}
          change="+1.2%"
          changeType="positive"
          icon="💰"
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Total Income"
          value={`$${statistics.income.toLocaleString()}`}
          change="+12.5%"
          changeType="positive"
          icon="📈"
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Total Expenses"
          value={`$${statistics.expenses.toLocaleString()}`}
          change="+8.3%"
          changeType="negative"
          icon="📉"
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Savings Rate"
          value={`${statistics.income > 0 ? ((statistics.balance / statistics.income) * 100).toFixed(1) : 0}%`}
          change="Excellent"
          changeType="positive"
          icon="📊"
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <h3 className={`text-lg font-semibold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Expense Distribution</h3>
          <ExpenseChart transactions={filteredTransactions} />
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <h3 className={`text-lg font-semibold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Income vs Expenses Trend</h3>
          <TrendChart transactions={filteredTransactions} isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Transactions
            {hasActiveFilters() && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredTransactions.length} filtered)
              </span>
            )}
          </h3>
          <button 
            onClick={onNavigateToTransactions}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            View All
          </button>
        </div>
        
        <div className="space-y-0">
          {filteredTransactions.slice(0, 5).map((transaction, index) => (
            <div key={transaction.id} className={`flex items-center justify-between p-4 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${index < 4 ? (isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200') : ''}`}>
              <div className="flex items-center flex-1">
                <div className="text-2xl mr-4 flex-shrink-0">{transaction.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-left`}>{transaction.title}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-left`}>{transaction.category} • {transaction.date}</p>
                </div>
              </div>
              <div className={`font-semibold flex-shrink-0 text-right ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 