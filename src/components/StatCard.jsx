import Card from './Card';

const StatCard = ({ title, value, change, changeType, icon, isDarkMode = false }) => {
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

  return (
    <Card className="hover:shadow-md transition-shadow duration-200" isDarkMode={isDarkMode}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {change && (
            <p className={`text-sm ${getChangeColor()}`}>
              {getChangeIcon()} {change}
            </p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  );
};

export default StatCard; 