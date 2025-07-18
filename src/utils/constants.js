import { 
  ShoppingCart, 
  DirectionsCar, 
  Home, 
  Celebration, 
  School, 
  Restaurant, 
  AttachMoney,
  MoreHoriz,
  FitnessCenter
} from '@mui/icons-material';

export const categoryIcons = {
  'Food & Dining': Restaurant,
  'Transportation': DirectionsCar,
  'Shopping': ShoppingCart,
  'Entertainment': Celebration,
  'Bills & Utilities': Home,
  'Health & Fitness': FitnessCenter,
  'Education': School,
  'Income': AttachMoney,
  'Other': MoreHoriz,
  'other': MoreHoriz
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