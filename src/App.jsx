import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import TransactionModal from './components/TransactionModal';
import { mockTransactions } from './data/mockData';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleAddTransaction = (newTransaction) => {
    try {
      const categoryIcon = {
        'Food & Dining': '🍕',
        'Transportation': '🚗',
        'Shopping': '🛒',
        'Entertainment': '🎉',
        'Bills & Utilities': '⚡',
        'Health & Fitness': '🏋️',
        'Education': '📚',
        'Other': '📋',
        'Salary': '💰',
        'Rental': '🏠',
        'Refund': '💸',
        'Selling Items': '🛍️',
        'Investment': '📈',
        'Gift': '🎁'
      };

      const transactionWithIcon = {
        ...newTransaction,
        icon: categoryIcon[newTransaction.category] || '📋'
      };

      setTransactions([transactionWithIcon, ...transactions]);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDeleteTransaction = (id) => {
    try {
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const renderCurrentPage = () => {
    try {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard 
            transactions={transactions} 
            isDarkMode={isDarkMode} 
            onNavigateToTransactions={() => setActiveTab('transactions')} 
            onAddTransaction={() => setIsModalOpen(true)}
          />;
        case 'transactions':
          return <Transactions 
            transactions={transactions} 
            onDeleteTransaction={handleDeleteTransaction}
            isDarkMode={isDarkMode} 
            onAddTransaction={() => setIsModalOpen(true)}
          />;
        case 'insights':
          return <Insights transactions={transactions} isDarkMode={isDarkMode} />;
        default:
          return <Dashboard 
            transactions={transactions} 
            isDarkMode={isDarkMode} 
            onNavigateToTransactions={() => setActiveTab('transactions')} 
            onAddTransaction={() => setIsModalOpen(true)}
          />;
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      return <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600">Please refresh the page or check the console for errors.</p>
        <p className="text-sm text-gray-500 mt-2">Error: {error.message}</p>
      </div>;
    }
  };

  return (
    <>
      <Layout 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {renderCurrentPage()}
      </Layout>
      
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTransaction}
        isDarkMode={isDarkMode}
      />
    </>
  );
}

export default App;
