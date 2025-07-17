import { 
  FiShoppingCart, 
  FiTruck, 
  FiHome, 
  FiHeart, 
  FiBook, 
  FiCoffee, 
  FiDollarSign,
  FiMoreHorizontal 
} from 'react-icons/fi';

export const categoryIcons = {
  'Food & Dining': FiCoffee,
  'Transportation': FiTruck,
  'Shopping': FiShoppingCart,
  'Entertainment': FiHeart,
  'Bills & Utilities': FiHome,
  'Health & Fitness': FiHeart,
  'Education': FiBook,
  'Income': FiDollarSign,
  'Other': FiMoreHorizontal,
  'other': FiMoreHorizontal
};

export const transactionTypes = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

export const dateRanges = {
  ALL: 'all',
  WEEK: '7d',
  MONTH: '30d',
  QUARTER: '3m',
  HALF_YEAR: '6m',
  YEAR: '1y'
}; 