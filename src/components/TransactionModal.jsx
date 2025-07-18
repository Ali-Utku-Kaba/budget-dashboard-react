import { useState } from 'react';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { ModernDropdown } from './DateRangeFilter';
import { categoryIcons } from '../utils/constants';
import { expenseCategories } from '../data/mockData';

const TransactionModal = ({ isOpen, onClose, onSubmit, isDarkMode = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Type options with arrows
  const typeOptions = [
    { value: 'expense', label: 'Expense', icon: <ArrowDownward className="w-4 h-4 text-red-600" /> },
    { value: 'income', label: 'Income', icon: <ArrowUpward className="w-4 h-4 text-green-600" /> }
  ];

  // Income categories with MUI icons
  const incomeCategories = [
    { name: "Salary", iconComponent: categoryIcons['Income'] },
    { name: "Rental", iconComponent: categoryIcons['Bills & Utilities'] },
    { name: "Refund", iconComponent: categoryIcons['Other'] },
    { name: "Selling Items", iconComponent: categoryIcons['Shopping'] },
    { name: "Investment", iconComponent: categoryIcons['Other'] },
    { name: "Gift", iconComponent: categoryIcons['Other'] },
    { name: "Other", iconComponent: categoryIcons['Other'] }
  ];

  // Expense categories with MUI icons
  const expenseCategoriesWithIcons = [
    { name: "Food & Dining", iconComponent: categoryIcons['Food & Dining'] },
    { name: "Transportation", iconComponent: categoryIcons['Transportation'] },
    { name: "Shopping", iconComponent: categoryIcons['Shopping'] },
    { name: "Entertainment", iconComponent: categoryIcons['Entertainment'] },
    { name: "Bills & Utilities", iconComponent: categoryIcons['Bills & Utilities'] },
    { name: "Health & Fitness", iconComponent: categoryIcons['Health & Fitness'] },
    { name: "Education", iconComponent: categoryIcons['Education'] },
    { name: "Other", iconComponent: categoryIcons['Other'] }
  ];

  // Get categories based on selected type
  const getCurrentCategories = () => {
    return formData.type === 'income' ? incomeCategories : expenseCategoriesWithIcons;
  };

  // Category options based on type
  const categoryOptions = [
    { value: '', label: 'Select Category' },
    ...getCurrentCategories().map(category => {
      const IconComponent = category.iconComponent;
      return {
        value: category.name,
        label: category.name,
        icon: <IconComponent className="w-4 h-4" />
      };
    })
  ];

  const handleTypeChange = (value) => {
    setFormData({
      ...formData, 
      type: value,
      category: '' // Reset category when type changes
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.amount && formData.category) {
      onSubmit({
        ...formData,
        amount: formData.type === 'expense' ? -Math.abs(parseFloat(formData.amount)) : parseFloat(formData.amount),
        id: Date.now()
      });
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md mx-4`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add Transaction</h2>
          <button onClick={onClose} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 text-left`}>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter transaction title"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 text-left`}>Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 text-left`}>Type</label>
            <ModernDropdown
              options={typeOptions}
              selectedValue={formData.type}
              onValueChange={handleTypeChange}
              placeholder="Select type"
              isDarkMode={isDarkMode}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 text-left`}>Category</label>
            <ModernDropdown
              options={categoryOptions}
              selectedValue={formData.category}
              onValueChange={(value) => setFormData({...formData, category: value})}
              placeholder="Select category"
              isDarkMode={isDarkMode}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 text-left`}>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2 px-4 border rounded-md font-medium ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal; 