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

    // Prevent body scroll when dropdown is open
    const handleWheel = (event) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        event.preventDefault();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    if (isOpen) {
      document.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen]);

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

// Reusable Dropdown Component
export const ModernDropdown = ({ 
  options, 
  selectedValue, 
  onValueChange, 
  placeholder = "Select...", 
  isDarkMode = false,
  icon = null 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(option => option.value === selectedValue) || { label: placeholder };

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

  const handleOptionSelect = (value, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    onValueChange(value);
    setIsOpen(false);
  };

  const handleToggle = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`flex items-center justify-between w-full space-x-2 border rounded-lg px-4 py-2 transition-colors ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
            : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center space-x-2">
          {icon && <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{icon}</span>}
          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {selectedOption.label}
          </span>
        </div>
        <FiChevronDown 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''} ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} 
          size={16} 
        />
      </button>
      
      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 w-full border rounded-lg shadow-lg z-[60] py-2 max-h-60 overflow-y-auto ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-300'
        }`}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={(e) => handleOptionSelect(option.value, e)}
              className={`w-full text-left px-4 py-2 transition-colors flex items-center space-x-2 ${
                selectedValue === option.value
                  ? isDarkMode 
                    ? 'bg-blue-900/20 text-blue-400' 
                    : 'bg-blue-50 text-blue-600'
                  : isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {option.icon && <span>{option.icon}</span>}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter; 