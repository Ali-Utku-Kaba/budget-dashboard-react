import React from 'react';
import { Add, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import StatCard from '../components/StatCard';
import ExpenseChart from '../components/ExpenseChart';
import TrendChart from '../components/TrendChart';
import DateRangeFilter, { ModernDropdown } from '../components/DateRangeFilter';
import SearchBar from '../components/SearchBar';
import useFilters from '../hooks/useFilters';
import { categoryIcons } from '../utils/constants';

const Dashboard = ({ transactions, isDarkMode = false, onNavigateToTransactions, onAddTransaction }) => {
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

  // Calculate dynamic changes by comparing with previous period
  const calculateChanges = () => {
    // Sort transactions by date to get proper chronological order
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (sortedTransactions.length === 0) {
      return {
        balance: { change: 'No data', changeType: 'neutral' },
        income: { change: 'No data', changeType: 'neutral' },
        expenses: { change: 'No data', changeType: 'neutral' },
        savingsRate: { change: 'No data', changeType: 'neutral' }
      };
    }

    // Split transactions into two halves for comparison
    const midPoint = Math.floor(sortedTransactions.length / 2);
    const firstHalf = sortedTransactions.slice(0, midPoint);
    const secondHalf = sortedTransactions.slice(midPoint);

    // Calculate statistics for first half (previous period)
    const previousIncome = firstHalf
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const previousExpenses = firstHalf
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const previousBalance = previousIncome - previousExpenses;

    // Calculate statistics for second half (current period)
    const currentIncome = secondHalf
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentExpenses = secondHalf
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const currentBalance = currentIncome - currentExpenses;

    // Calculate percentage changes
    const balanceChange = previousBalance !== 0 ? ((currentBalance - previousBalance) / Math.abs(previousBalance)) * 100 : 
                         (currentBalance > 0 ? 100 : currentBalance < 0 ? -100 : 0);
    
    const incomeChange = previousIncome !== 0 ? ((currentIncome - previousIncome) / previousIncome) * 100 : 
                        (currentIncome > 0 ? 100 : 0);
    
    const expenseChange = previousExpenses !== 0 ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 : 
                         (currentExpenses > 0 ? 100 : 0);

    // Calculate savings rate changes
    const previousSavingsRate = previousIncome > 0 ? (previousBalance / previousIncome) * 100 : 0;
    const currentSavingsRate = currentIncome > 0 ? (currentBalance / currentIncome) * 100 : 0;
    const savingsRateChange = currentSavingsRate - previousSavingsRate;

    return {
      balance: {
        change: Math.abs(balanceChange) > 0.1 ? `${balanceChange > 0 ? '+' : ''}${balanceChange.toFixed(1)}%` : 'Stable',
        changeType: balanceChange > 0 ? 'positive' : balanceChange < 0 ? 'negative' : 'neutral'
      },
      income: {
        change: Math.abs(incomeChange) > 0.1 ? `${incomeChange > 0 ? '+' : ''}${incomeChange.toFixed(1)}%` : 'Stable',
        changeType: incomeChange > 0 ? 'positive' : incomeChange < 0 ? 'negative' : 'neutral'
      },
      expenses: {
        change: Math.abs(expenseChange) > 0.1 ? `${expenseChange > 0 ? '+' : ''}${expenseChange.toFixed(1)}%` : 'Stable',
        changeType: expenseChange > 0 ? 'negative' : expenseChange < 0 ? 'positive' : 'neutral'
      },
      savingsRate: {
        change: Math.abs(savingsRateChange) > 0.1 ? `${savingsRateChange > 0 ? '+' : ''}${savingsRateChange.toFixed(1)}%` : 'Stable',
        changeType: savingsRateChange > 0 ? 'positive' : savingsRateChange < 0 ? 'negative' : 'neutral'
      }
    };
  };

  const changes = calculateChanges();

  // Get unique categories for filter
  const categories = [...new Set(transactions.map(t => t.category))];

  // Type options with arrows
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'income', label: 'Income', icon: <ArrowUpward className="w-4 h-4 text-green-600" /> },
    { value: 'expense', label: 'Expense', icon: <ArrowDownward className="w-4 h-4 text-red-600" /> }
  ];

  // Category options
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(category => ({ value: category, label: category }))
  ];

  return (
    <div>
      <div className="mb-5 sm:mb-6 text-left">
        <h1 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Personal Budget Dashboard</h1>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 text-sm`}>Overview of your financial activities and insights</p>
      </div>

      {/* Advanced Filters Section */}
      <div className="mb-5 sm:mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1 w-full sm:max-w-md">
            <SearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search transactions..."
              isDarkMode={isDarkMode}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <DateRangeFilter 
              selectedRange={dateRange}
              onRangeChange={setDateRange}
              isDarkMode={isDarkMode}
            />
            
            <ModernDropdown
              options={typeOptions}
              selectedValue={selectedType}
              onValueChange={setSelectedType}
              placeholder="All Types"
              isDarkMode={isDarkMode}
            />
            
            <ModernDropdown
              options={categoryOptions}
              selectedValue={selectedCategory}
              onValueChange={setSelectedCategory}
              placeholder="All Categories"
              isDarkMode={isDarkMode}
            />
            
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className={`px-3 py-2 text-sm font-medium border rounded-lg transition-colors text-red-600 hover:text-red-700 w-full sm:w-auto ${
                  isDarkMode 
                    ? 'border-red-600 hover:bg-red-600/10' 
                    : 'border-red-300 hover:bg-red-50'
                }`}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
        
        {hasActiveFilters() && (
          <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
            <span>Showing {filteredTransactions.length} of {transactions.length} transactions</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          title="Total Balance"
          value={`$${statistics.balance.toLocaleString()}`}
          change={changes.balance.change}
          changeType={changes.balance.changeType}
          icon="💰"
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Total Income"
          value={`$${statistics.income.toLocaleString()}`}
          change={changes.income.change}
          changeType={changes.income.changeType}
          icon="📈"
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Total Expenses"
          value={`$${statistics.expenses.toLocaleString()}`}
          change={changes.expenses.change}
          changeType={changes.expenses.changeType}
          icon="📉"
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Savings Rate"
          value={`${statistics.income > 0 ? ((statistics.balance / statistics.income) * 100).toFixed(1) : 0}%`}
          change={changes.savingsRate.change}
          changeType={changes.savingsRate.changeType}
          icon="📊"
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-5 sm:mb-6">
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-sm p-4 sm:p-5`}>
          <h3 className={`text-base sm:text-lg font-semibold mb-3 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Expense Distribution</h3>
          <ExpenseChart transactions={filteredTransactions} isDarkMode={isDarkMode} />
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-sm p-4 sm:p-5`}>
          <h3 className={`text-base sm:text-lg font-semibold mb-3 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Income vs Expenses Trend</h3>
          <TrendChart transactions={filteredTransactions} isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-sm p-4 sm:p-5`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-5 gap-3 sm:gap-0">
          <h3 className={`text-base sm:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Transactions
            {hasActiveFilters() && (
              <span className="text-xs font-normal text-gray-500 ml-2">
                ({filteredTransactions.length} filtered)
              </span>
            )}
          </h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={onNavigateToTransactions}
              className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm font-medium border border-blue-500 px-2 sm:px-3 py-1 rounded hover:bg-blue-50 transition-colors"
            >
              View All
            </button>
            <button 
              onClick={onAddTransaction}
              className="flex items-center space-x-1 bg-blue-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm font-medium"
            >
              <span>Add+</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-0">
          {filteredTransactions.slice(0, 5).map((transaction, index) => {
            const Icon = categoryIcons[transaction.category] || categoryIcons.other;
            return (
              <div key={transaction.id} className={`flex items-center justify-between p-3 sm:p-4 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${index < 4 ? (isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200') : ''}`}>
                <div className="flex items-center flex-1 min-w-0">
                  <div className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Icon className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0 ml-3 sm:ml-4">
                    <p className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'} text-left truncate`}>{transaction.title}</p>
                    <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-left`}>
                      <span className="hidden sm:inline">{transaction.category} • {transaction.date}</span>
                      <span className="sm:hidden">{transaction.category}</span>
                    </p>
                  </div>
                </div>
                <div className={`font-semibold flex-shrink-0 text-right text-sm sm:text-base ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 