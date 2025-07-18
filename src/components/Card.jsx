const Card = ({ children, className = "", isDarkMode = false }) => {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card; 