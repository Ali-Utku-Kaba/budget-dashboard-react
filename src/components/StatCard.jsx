import Card from './Card';
import { 
  AccountBalance, 
  TrendingUp, 
  TrendingDown, 
  Savings 
} from '@mui/icons-material';

const StatCard = ({ title, value, change, changeType, icon, isDarkMode = false, showIcon = true }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-green-600';
    if (changeType === 'negative') return 'text-red-600';
    return isDarkMode ? 'text-gray-300' : 'text-gray-600';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return '↑';
    if (changeType === 'negative') return '↓';
    return '';
  };

  const getIconComponent = () => {
    const iconClass = `text-3xl ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`;
    
    try {
      switch (title) {
        case 'Total Balance':
          return <AccountBalance className={iconClass} />;
        case 'Total Income':
          return <TrendingUp className={iconClass} />;
        case 'Total Expenses':
          return <TrendingDown className={iconClass} />;
        case 'Savings Rate':
          return <Savings className={iconClass} />;
        default:
          return <span className="text-3xl">{icon || '📊'}</span>;
      }
    } catch (error) {
      console.error('Error rendering icon:', error);
      return <span className="text-3xl">{icon || '📊'}</span>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200" isDarkMode={isDarkMode}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {change && (
            <p className={`text-sm ${getChangeColor()}`}>
              {getChangeIcon()} {change}
            </p>
          )}
        </div>
        {showIcon && (
          <div className="flex-shrink-0 ml-4">
            {getIconComponent()}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard; 