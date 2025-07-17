import StatCard from '../components/StatCard';
import Card from '../components/Card';

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
      icon: "💰"
    },
    {
      title: "Expense Management",
      description: mostExpensiveCategory 
        ? `Your highest expense category is ${mostExpensiveCategory[0]} ($${mostExpensiveCategory[1].toFixed(2)}). Consider optimizing this area.`
        : "Track your expenses to identify areas for optimization.",
      type: "info",
      icon: "📊"
    },
    {
      title: "Budget Balance",
      description: balance > 0 
        ? "Great job! You're spending less than you earn." 
        : "Warning: You're spending more than you earn. Review your expenses.",
      type: balance > 0 ? "success" : "danger",
      icon: "⚖️"
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Insights</h1>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>Financial analysis and personalized recommendations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Monthly Savings"
          value={`$${balance.toLocaleString()}`}
          change={`${savingsRate}% of income`}
          changeType={balance > 0 ? "positive" : "negative"}
          icon="💰"
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Average Income"
          value={`$${avgIncome.toFixed(2)}`}
          change="Per transaction"
          changeType="neutral"
          icon="📈"
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Average Expense"
          value={`$${avgExpense.toFixed(2)}`}
          change="Per transaction"
          changeType="neutral"
          icon="📉"
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Total Transactions"
          value={transactions.length}
          change="This month"
          changeType="neutral"
          icon="📋"
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Recommendations */}
      <Card className="mb-8" isDarkMode={isDarkMode}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          💡 Personalized Recommendations
        </h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              rec.type === 'success' ? 'border-green-500 bg-green-50' :
              rec.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
              rec.type === 'danger' ? 'border-red-500 bg-red-50' :
              'border-blue-500 bg-blue-50'
            } ${isDarkMode ? 'bg-opacity-10' : ''}`}>
              <div className="flex items-start">
                <span className="text-2xl mr-3">{rec.icon}</span>
                <div>
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {rec.title}
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {rec.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Spending Analysis */}
      <Card isDarkMode={isDarkMode}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          📈 Spending Analysis
        </h3>
        <div className="space-y-4">
          {Object.entries(expensesByCategory)
            .sort(([,a], [,b]) => b - a)
            .map(([category, amount]) => {
              const percentage = ((amount / totalExpenses) * 100).toFixed(1);
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${amount.toFixed(2)}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {percentage}% of expenses
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </Card>
    </div>
  );
};

export default Insights; 