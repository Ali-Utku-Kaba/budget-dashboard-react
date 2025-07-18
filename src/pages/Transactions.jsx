import React from 'react';
import { FiTrash2, FiFilter } from 'react-icons/fi';
import { Add, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { categoryIcons } from '../utils/constants';
import SearchBar from '../components/SearchBar';
import DateRangeFilter, { ModernDropdown } from '../components/DateRangeFilter';
import useFilters from '../hooks/useFilters';

const Transactions = ({ transactions, onDeleteTransaction, isDarkMode, onAddTransaction }) => {
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
    clearFilters,
    hasActiveFilters
  } = useFilters(transactions);

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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      onDeleteTransaction(id);
    }
  };

  return (
    <div>
      <div className="mb-6 text-left">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Transactions
        </h1>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
          Manage and track all your financial transactions
        </p>
      </div>

      {/* Advanced Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 max-w-md">
            <SearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by description or amount..."
              isDarkMode={isDarkMode}
            />
          </div>
          
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

      {/* Transactions List */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-sm`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              All Transactions
            </h2>
            <button 
              onClick={onAddTransaction}
              className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <span>Add+</span>
            </button>
          </div>
          
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                No transactions found
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {hasActiveFilters()
                  ? 'Try adjusting your filters to see more results.'
                  : 'Start by adding your first transaction.'}
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {filteredTransactions.map((transaction, index) => {
                const Icon = categoryIcons[transaction.category] || categoryIcons.other;
                return (
                  <div
                    key={transaction.id}
                    className={`flex items-center justify-between p-3 sm:p-4 ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    } ${
                      index < filteredTransactions.length - 1
                        ? isDarkMode
                          ? 'border-b border-gray-700'
                          : 'border-b border-gray-200'
                        : ''
                    }`}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <div className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <Icon className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0 ml-3 sm:ml-4">
                        <h3 className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'} text-left truncate`}>
                          {transaction.title}
                        </h3>
                        <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-left`}>
                          <span className="hidden sm:inline">{transaction.category} • {transaction.date}</span>
                          <span className="sm:hidden">{transaction.category}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                      <div className={`font-semibold text-right text-sm sm:text-base ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors flex-shrink-0"
                      >
                        <FiTrash2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions; 