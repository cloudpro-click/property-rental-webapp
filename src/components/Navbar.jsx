import React, { useState } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-display font-bold text-primary-600">
              RentNest
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">
              Home
            </a>
            <a href="#properties" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">
              Properties
            </a>
            <a href="#about" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">
              About
            </a>
            <a href="#contact" className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">
              Contact
            </a>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Sign In
            </button>
            <button className="btn-primary">
              List Property
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neutral-700 hover:text-primary-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <a
              href="#"
              className="block px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium"
            >
              Home
            </a>
            <a
              href="#properties"
              className="block px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium"
            >
              Properties
            </a>
            <a
              href="#about"
              className="block px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium"
            >
              About
            </a>
            <a
              href="#contact"
              className="block px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium"
            >
              Contact
            </a>
            <div className="pt-4 space-y-2">
              <button className="w-full text-center px-4 py-3 text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors">
                Sign In
              </button>
              <button className="w-full btn-primary">
                List Property
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
