import React, { useState } from 'react';

// Phone country codes with flags
const COUNTRIES = [
  { code: 'PH', dialCode: '+63', flag: '🇵🇭', name: 'Philippines' },
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'SG', dialCode: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: 'MY', dialCode: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { code: 'IN', dialCode: '+91', flag: '🇮🇳', name: 'India' },
  { code: 'CN', dialCode: '+86', flag: '🇨🇳', name: 'China' },
  { code: 'JP', dialCode: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: 'KR', dialCode: '+82', flag: '🇰🇷', name: 'South Korea' },
  { code: 'AU', dialCode: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: 'CA', dialCode: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: 'DE', dialCode: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', dialCode: '+33', flag: '🇫🇷', name: 'France' },
  { code: 'IT', dialCode: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: 'ES', dialCode: '+34', flag: '🇪🇸', name: 'Spain' },
];

const PhoneInput = ({ value = '', onChange, placeholder = 'Enter phone number', disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Parse existing value to extract country code and number
  const parsePhoneValue = (phoneValue) => {
    if (!phoneValue) return { countryCode: 'PH', phoneNumber: '' };

    // Find matching country by dial code
    const matchedCountry = COUNTRIES.find(country => phoneValue.startsWith(country.dialCode));
    if (matchedCountry) {
      return {
        countryCode: matchedCountry.code,
        phoneNumber: phoneValue.substring(matchedCountry.dialCode.length).trim()
      };
    }

    return { countryCode: 'PH', phoneNumber: phoneValue };
  };

  const { countryCode, phoneNumber } = parsePhoneValue(value);
  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

  const handleCountrySelect = (country) => {
    const newValue = phoneNumber ? `${country.dialCode} ${phoneNumber}` : country.dialCode;
    onChange(newValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    // Only allow numbers, spaces, and hyphens
    const sanitized = input.replace(/[^\d\s-]/g, '');
    const newValue = sanitized ? `${selectedCountry.dialCode} ${sanitized}` : selectedCountry.dialCode;
    onChange(newValue);
  };

  // Filter countries based on search
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex gap-2">
        {/* Country Code Selector */}
        <div className="relative w-32">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="w-full h-full px-3 py-2 bg-white border border-neutral-300 rounded-lg hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="font-medium">{selectedCountry.dialCode}</span>
            </div>
            <svg
              className={`w-4 h-4 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-neutral-300 rounded-lg shadow-lg z-20 max-h-80 overflow-hidden">
                {/* Search */}
                <div className="p-2 border-b border-neutral-200">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search country..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    autoFocus
                  />
                </div>

                {/* Country List */}
                <div className="overflow-y-auto max-h-64">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className={`w-full px-3 py-2 flex items-center gap-3 hover:bg-primary-50 transition-colors text-left ${
                          country.code === selectedCountry.code ? 'bg-primary-100' : ''
                        }`}
                      >
                        <span className="text-xl">{country.flag}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-neutral-900">{country.name}</div>
                          <div className="text-xs text-neutral-500">{country.dialCode}</div>
                        </div>
                        {country.code === selectedCountry.code && (
                          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-8 text-center text-sm text-neutral-500">
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 input-field"
        />
      </div>
    </div>
  );
};

export default PhoneInput;
