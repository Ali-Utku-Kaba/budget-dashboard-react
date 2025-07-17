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
    const categoryIcon = {
      'Food & Dining': '🍕',
      'Transportation': '🚗',
      'Shopping': '🛒',
      'Entertainment': '🎬',
      'Bills & Utilities': '⚡',
      'Health & Fitness': '🏋️',
      'Education': '📚',
      'Other': '📋',
      'Salary': '💰',
      'Freelance': '💻'
    };

    const transactionWithIcon = {
      ...newTransaction,
      icon: categoryIcon[newTransaction.category] || '📋'
    };

    setTransactions([transactionWithIcon, ...transactions]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} isDarkMode={isDarkMode} />;
      case 'transactions':
        return <Transactions 
          transactions={transactions} 
          onDeleteTransaction={handleDeleteTransaction}
          isDarkMode={isDarkMode} 
        />;
      case 'insights':
        return <Insights transactions={transactions} isDarkMode={isDarkMode} />;
      default:
        return <Dashboard transactions={transactions} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <>
      <Layout 
        onAddTransaction={() => setIsModalOpen(true)}
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
