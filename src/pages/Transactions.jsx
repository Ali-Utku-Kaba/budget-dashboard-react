import React from 'react';
import { FiTrash2, FiFilter } from 'react-icons/fi';
import { categoryIcons } from '../utils/constants';
import SearchBar from '../components/SearchBar';
import DateRangeFilter from '../components/DateRangeFilter';
import useFilters from '../hooks/useFilters';

const Transactions = ({ transactions, onDeleteTransaction, isDarkMode }) => {
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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      onDeleteTransaction(id);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
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

      {/* Transactions List */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
        <div className="p-6">
          <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            All Transactions
          </h2>
          
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
                    className={`flex items-center justify-between p-4 ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    } ${
                      index < filteredTransactions.length - 1
                        ? isDarkMode
                          ? 'border-b border-gray-700'
                          : 'border-b border-gray-200'
                        : ''
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <div className={`p-2 rounded-full flex-shrink-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <Icon className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0 ml-4">
                        <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-left`}>
                          {transaction.title}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-left`}>
                          {transaction.category} • {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 flex-shrink-0">
                      <div className={`font-semibold text-right ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                      >
                        <FiTrash2 size={16} />
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