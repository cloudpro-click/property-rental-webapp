import React, { useState, useRef, useEffect } from 'react';

const SearchableSelect = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  displayKey = null, // For objects: which key to display
  valueKey = null,   // For objects: which key to use as value
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Get display text for an option
  const getDisplayText = (option) => {
    if (typeof option === 'string') return option;
    if (displayKey) return option[displayKey];
    return option.label || option.name || String(option);
  };

  // Get value for an option
  const getOptionValue = (option) => {
    if (typeof option === 'string') return option;
    if (valueKey) return option[valueKey];
    return option.value || option.code || option;
  };

  // Find selected option's display text
  const getSelectedDisplay = () => {
    if (!value) return '';
    const selected = options.find(opt => getOptionValue(opt) === value);
    return selected ? getDisplayText(selected) : value;
  };

  // Filter options based on search term
  const filteredOptions = options.filter(option => {
    const displayText = getDisplayText(option);
    return displayText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange(getOptionValue(option));
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Enter' && filteredOptions.length > 0) {
      e.preventDefault();
      handleSelect(filteredOptions[0]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Input/Display */}
      <div
        className={`input-field flex items-center cursor-pointer ${disabled ? 'bg-neutral-100 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-sm"
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className={`flex-1 text-sm ${value ? 'text-neutral-900' : 'text-neutral-500'}`}>
            {value ? getSelectedDisplay() : placeholder}
          </span>
        )}
        <svg
          className={`w-5 h-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              const optionValue = getOptionValue(option);
              const displayText = getDisplayText(option);
              const isSelected = optionValue === value;

              return (
                <div
                  key={optionValue || index}
                  onClick={() => handleSelect(option)}
                  className={`px-3 py-2 cursor-pointer text-sm transition-colors ${
                    isSelected
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  {displayText}
                </div>
              );
            })
          ) : (
            <div className="px-3 py-2 text-sm text-neutral-500 text-center">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
