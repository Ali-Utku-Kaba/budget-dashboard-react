import StatCard from '../components/StatCard';
import ExpenseChart from '../components/ExpenseChart';
import TrendChart from '../components/TrendChart';

const Dashboard = ({ transactions, isDarkMode = false }) => {
  // Calculate financial statistics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>Overview of your financial activities and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Balance"
          value={`$${balance.toLocaleString()}`}
          change="+1.2%"
          changeType="positive"
          icon="💰"
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Monthly Income"
          value={`$${totalIncome.toLocaleString()}`}
          change="+12.5%"
          changeType="positive"
          icon="📈"
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Monthly Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          change="+8.3%"
          changeType="negative"
          icon="📉"
          isDarkMode={isDarkMode}
        />
        <StatCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          change="Excellent"
          changeType="positive"
          icon="📊"
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <h3 className={`text-lg font-semibold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Expense Distribution</h3>
          <ExpenseChart transactions={transactions} />
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <h3 className={`text-lg font-semibold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Income vs Expenses Trend</h3>
          <TrendChart />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Transactions</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-600 px-3 py-1 rounded">
            View All
          </button>
        </div>
        
        <div className="space-y-0">
          {transactions.slice(0, 5).map((transaction, index) => (
            <div key={transaction.id} className={`flex items-center justify-between p-4 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${index < 4 ? (isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200') : ''}`}>
              <div className="flex items-center">
                <div className="text-2xl mr-4">{transaction.icon}</div>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.title}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{transaction.category} • {transaction.date}</p>
                </div>
              </div>
              <div className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 