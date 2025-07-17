import React, { useState, useRef, useEffect } from 'react';
import { FiCalendar, FiChevronDown } from 'react-icons/fi';

const DateRangeFilter = ({ selectedRange, onRangeChange, isDarkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dateRanges = [
    { id: 'all', label: 'All Time', value: null },
    { id: '7d', label: 'Last 7 Days', value: 7 },
    { id: '30d', label: 'Last 30 Days', value: 30 },
    { id: '3m', label: 'Last 3 Months', value: 90 },
    { id: '6m', label: 'Last 6 Months', value: 180 },
    { id: '1y', label: 'Last 1 Year', value: 365 }
  ];

  const currentRange = dateRanges.find(range => range.id === selectedRange) || dateRanges[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRangeSelect = (rangeId) => {
    onRangeChange(rangeId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 border rounded-lg px-4 py-2 transition-colors ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
            : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
        }`}
      >
        <FiCalendar className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {currentRange.label}
        </span>
        <FiChevronDown 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''} ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} 
          size={16} 
        />
      </button>
      
      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 w-48 border rounded-lg shadow-lg z-20 py-2 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-300'
        }`}>
          {dateRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => handleRangeSelect(range.id)}
              className={`w-full text-left px-4 py-2 transition-colors ${
                selectedRange === range.id
                  ? isDarkMode 
                    ? 'bg-blue-900/20 text-blue-400' 
                    : 'bg-blue-50 text-blue-600'
                  : isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter; 