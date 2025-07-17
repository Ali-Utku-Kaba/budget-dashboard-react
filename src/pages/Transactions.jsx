import { useState } from 'react';
import Card from '../components/Card';

const Transactions = ({ transactions, onDeleteTransaction, isDarkMode = false }) => {
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = filter === 'all' || transaction.type === filter;
    const categoryMatch = categoryFilter === 'all' || transaction.category === categoryFilter;
    return typeMatch && categoryMatch;
  });

  const categories = [...new Set(transactions.map(t => t.category))];

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      onDeleteTransaction(id);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Transactions</h1>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>Manage all your financial transactions</p>
      </div>

      {/* Filters */}
      <Card className="mb-6" isDarkMode={isDarkMode}>
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Filter by Type
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Filter by Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="ml-auto">
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <Card isDarkMode={isDarkMode}>
        <div className="space-y-0">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                No transactions found
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <div 
                key={transaction.id} 
                className={`flex items-center justify-between p-4 ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                } ${
                  index < filteredTransactions.length - 1 
                    ? (isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200') 
                    : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{transaction.icon}</div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {transaction.title}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {transaction.category} • {transaction.date}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                  
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className={`p-2 rounded-md ${
                      isDarkMode 
                        ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' 
                        : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                    }`}
                    title="Delete transaction"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default Transactions; 