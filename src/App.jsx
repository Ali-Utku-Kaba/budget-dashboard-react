import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TransactionModal from './components/TransactionModal';
import { mockTransactions } from './data/mockData';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <>
      <Layout 
        onAddTransaction={() => setIsModalOpen(true)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      >
        <Dashboard transactions={transactions} isDarkMode={isDarkMode} />
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
