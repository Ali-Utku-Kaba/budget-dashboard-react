import StatCard from '../components/StatCard';
import Card from '../components/Card';
import { 
  Savings, 
  TrendingUp, 
  AccountBalance 
} from '@mui/icons-material';

const Insights = ({ transactions, isDarkMode = false }) => {
  // Calculate insights
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  // Find most expensive category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const mostExpensiveCategory = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)[0];

  // Calculate average transaction amounts
  const avgIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t, _, arr) => sum + t.amount / arr.length, 0);

  const avgExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t, _, arr) => sum + Math.abs(t.amount) / arr.length, 0);

  // Generate recommendations
  const recommendations = [
    {
      title: "Savings Goal",
      description: savingsRate > 20 
        ? "Excellent! You're saving over 20% of your income." 
        : "Try to save at least 20% of your income for better financial health.",
      type: savingsRate > 20 ? "success" : "warning",
      icon: Savings
    },
    {
      title: "Expense Management",
      description: mostExpensiveCategory 
        ? `Your highest expense category is ${mostExpensiveCategory[0]} ($${mostExpensiveCategory[1].toFixed(2)}). Consider optimizing this area.`
        : "Track your expenses to identify areas for optimization.",
      type: "info",
      icon: TrendingUp
    },
    {
      title: "Budget Balance",
      description: balance > 0 
        ? "Great job! You're spending less than you earn." 
        : "Warning: You're spending more than you earn. Review your expenses.",
      type: balance > 0 ? "success" : "danger",
      icon: AccountBalance
    }
  ];

  return (
    <div>
      <div className="mb-6 text-left">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Insights</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          title="Monthly Savings"
          value={`$${balance.toLocaleString()}`}
          change={`${savingsRate}% of income`}
          changeType={balance > 0 ? "positive" : "negative"}
          isDarkMode={isDarkMode}
          showIcon={false}
        />
        <StatCard
          title="Average Income"
          value={`$${avgIncome.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change="Per transaction"
          changeType="neutral"
          isDarkMode={isDarkMode}
          showIcon={false}
        />
        <StatCard
          title="Average Expense"
          value={`$${avgExpense.toFixed(2)}`}
          change="Per transaction"
          changeType="neutral"
          isDarkMode={isDarkMode}
          showIcon={false}
        />
        <StatCard
          title="Total Transactions"
          value={transactions.length}
          change="This month"
          changeType="neutral"
          isDarkMode={isDarkMode}
          showIcon={false}
        />
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <Card isDarkMode={isDarkMode}>
          <h3 className={`text-lg font-semibold mb-4 text-left ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Personalized Recommendations
          </h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const IconComponent = rec.icon;
              return (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  rec.type === 'success' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : rec.type === 'warning' 
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : rec.type === 'danger'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                }`}>
                  <div className="flex items-start text-left">
                    <div className="flex-shrink-0 mr-3">
                      <IconComponent className={`w-5 h-5 ${
                        rec.type === 'success' ? 'text-green-600' :
                        rec.type === 'warning' ? 'text-yellow-600' :
                        rec.type === 'danger' ? 'text-red-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className={`font-medium text-left ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {rec.title}
                      </h4>
                      <p className={`text-sm mt-1 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {rec.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Spending Analysis */}
      <Card isDarkMode={isDarkMode}>
        <div className="p-6">
          <h3 className={`text-xl font-semibold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Spending Analysis
          </h3>
          
          {Object.keys(expensesByCategory).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4"></div>
              <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                No expense data available
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Add some expense transactions to see your spending analysis.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {Object.entries(expensesByCategory)
                .sort(([,a], [,b]) => b - a)
                .map(([category, amount], index, array) => {
                  const percentage = ((amount / totalExpenses) * 100);
                  
                  // Dynamic color based on percentage
                  const getDotColor = (percentage) => {
                    if (percentage >= 60) return 'bg-red-500'; // High percentage - Red
                    if (percentage >= 30) return 'bg-blue-500'; // Medium percentage - Blue
                    return 'bg-green-500'; // Low percentage - Green
                  };
                  
                  return (
                    <div
                      key={category}
                      className={`flex items-center justify-between p-3 sm:p-4 ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      } ${
                        index < array.length - 1
                          ? isDarkMode
                            ? 'border-b border-gray-700'
                            : 'border-b border-gray-200'
                          : ''
                      }`}
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <div className={`w-3 h-3 sm:w-4 sm:h-4 ${getDotColor(percentage)} rounded-full mr-3 sm:mr-4 flex-shrink-0`}></div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium text-sm sm:text-base text-left ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                            {category}
                          </h3>
                          <p className={`text-xs sm:text-sm text-left ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {percentage.toFixed(1)}% of total expenses
                          </p>
                        </div>
                      </div>
                      <div className={`font-semibold flex-shrink-0 text-right text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${amount.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Insights;