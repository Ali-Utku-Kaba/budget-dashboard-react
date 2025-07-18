import { useState, useEffect } from 'react';
import { AccountBalanceWallet, LightMode, DarkMode } from '@mui/icons-material';

const Layout = ({ children, onAddTransaction, isDarkMode, setIsDarkMode, activeTab, setActiveTab }) => {
  const navigation = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'transactions', name: 'Transactions' },
    { id: 'insights', name: 'Insights' },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogoClick = () => {
    setActiveTab('dashboard');
  };

  // Calculate underline position with useEffect for better accuracy
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const calculateUnderlinePosition = () => {
      const activeIndex = navigation.findIndex(item => item.id === activeTab);
      if (activeIndex === -1) {
        setUnderlineStyle({ left: 0, width: 0 });
        return;
      }

      // Use actual DOM measurements for precise positioning
      const navContainer = document.querySelector('[data-nav-container]');
      if (navContainer) {
        const buttons = navContainer.querySelectorAll('button');
        const activeButton = buttons[activeIndex];
        
        if (activeButton) {
          const containerRect = navContainer.getBoundingClientRect();
          const buttonRect = activeButton.getBoundingClientRect();
          
          const left = buttonRect.left - containerRect.left;
          const width = buttonRect.width;
          
          setUnderlineStyle({ left: `${left}px`, width: `${width}px` });
        }
      }
    };

    // Calculate position after component mounts and when activeTab changes
    setTimeout(calculateUnderlinePosition, 0);
  }, [activeTab, navigation]);

  // Apply dark mode to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#111827';
      document.documentElement.style.backgroundColor = '#111827';
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#f9fafb';
      document.documentElement.style.backgroundColor = '#f9fafb';
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header - Fixed and Full Width - Reverted to original size */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
        <div className="px-2 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 max-w-6xl mx-auto">
            {/* Left side - Logo */}
            <div className="flex items-center flex-shrink-0">
              <button 
                onClick={handleLogoClick}
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <AccountBalanceWallet className="text-lg sm:text-2xl mr-1 sm:mr-2" style={{ color: isDarkMode ? '#fff' : '#1f2937' }} />
                <h1 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>BudgetView</h1>
              </button>
            </div>
            
            {/* Center - Navigation */}
            <nav className="relative flex space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 mx-2 sm:mx-4 lg:mx-6" data-nav-container>
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base lg:text-lg font-medium transition-colors ${
                    activeTab === item.id
                      ? 'text-blue-500'
                      : `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`
                  }`}
                >
                  <span className="hidden sm:inline">{item.name}</span>
                  <span className="sm:hidden">
                    {item.name === 'Dashboard' ? 'Home' : 
                     item.name === 'Transactions' ? 'Trans' : 
                     item.name === 'Insights' ? 'Stats' : item.name}
                  </span>
                </button>
              ))}
              {/* Animated underline */}
              {activeTab && underlineStyle.width > 0 && (
                <div 
                  className="absolute bottom-0 h-0.5 bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
                  style={underlineStyle}
                />
              )}
            </nav>

            {/* Right side - Dark mode toggle */}
            <div className="flex items-center flex-shrink-0">
              <button 
                onClick={toggleDarkMode}
                className={`p-1 sm:p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              >
                {isDarkMode ? <LightMode className="text-lg sm:text-xl" /> : <DarkMode className="text-lg sm:text-xl" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Add more top padding and scale down overall size */}
      <main className="pt-[88px] pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout; 