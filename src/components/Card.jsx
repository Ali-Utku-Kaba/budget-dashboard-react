const Card = ({ children, className = "", isDarkMode = false }) => {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card; 