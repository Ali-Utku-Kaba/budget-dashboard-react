import { useState, useMemo, useEffect } from 'react';

const useFilters = (transactions) => {
  const [dateRange, setDateRange] = useState(() => {
    return localStorage.getItem('budgetDashboard_dateRange') || 'all';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem('budgetDashboard_selectedCategory') || 'all';
  });
  const [selectedType, setSelectedType] = useState(() => {
    return localStorage.getItem('budgetDashboard_selectedType') || 'all';
  });

  // Save filter preferences to localStorage
  useEffect(() => {
    localStorage.setItem('budgetDashboard_dateRange', dateRange);
  }, [dateRange]);

  useEffect(() => {
    localStorage.setItem('budgetDashboard_selectedCategory', selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem('budgetDashboard_selectedType', selectedType);
  }, [selectedType]);

  const getDateRangeFilter = (rangeId) => {
    const now = new Date();
    const ranges = {
      'all': null,
      '7d': 7,
      '30d': 30,
      '3m': 90,
      '6m': 180,
      '1y': 365
    };
    
    const days = ranges[rangeId];
    if (!days) return null;
    
    const startDate = new Date();
    startDate.setDate(now.getDate() - days);
    return startDate;
  };

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Date range filter
    const startDate = getDateRangeFilter(dateRange);
    if (startDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate;
      });
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(searchTerm)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(transaction => transaction.category === selectedCategory);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === selectedType);
    }

    return filtered;
  }, [transactions, dateRange, searchTerm, selectedCategory, selectedType]);

  const statistics = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    return {
      income,
      expenses,
      balance: income - expenses,
      totalTransactions: filteredTransactions.length
    };
  }, [filteredTransactions]);

  const categoryBreakdown = useMemo(() => {
    const categories = {};
    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        categories[transaction.category] = (categories[transaction.category] || 0) + transaction.amount;
      }
    });
    return categories;
  }, [filteredTransactions]);

  const clearFilters = () => {
    setDateRange('all');
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType('all');
    
    // Clear localStorage
    localStorage.removeItem('budgetDashboard_dateRange');
    localStorage.removeItem('budgetDashboard_selectedCategory');
    localStorage.removeItem('budgetDashboard_selectedType');
  };

  return {
    // Filter states
    dateRange,
    setDateRange,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    
    // Filtered results
    filteredTransactions,
    statistics,
    categoryBreakdown,
    
    // Utility functions
    clearFilters,
    
    hasActiveFilters: () => {
      return dateRange !== 'all' || searchTerm !== '' || selectedCategory !== 'all' || selectedType !== 'all';
    }
  };
};

export default useFilters; 