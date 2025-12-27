import React from 'react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Find Your Perfect
              <span className="block text-primary-200">Rental Home</span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-8 max-w-2xl mx-auto lg:mx-0">
              Discover thousands of properties available for rent. From cozy apartments to spacious houses, find your ideal home today.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-medium p-2 sm:p-3 max-w-2xl mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Enter location, city, or neighborhood"
                  className="flex-1 px-4 py-3 text-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="btn-primary whitespace-nowrap">
                  Search Properties
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-2xl sm:text-3xl font-display font-bold">1,200+</div>
                <div className="text-primary-200 text-sm sm:text-base">Properties</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-bold">500+</div>
                <div className="text-primary-200 text-sm sm:text-base">Happy Tenants</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-bold">50+</div>
                <div className="text-primary-200 text-sm sm:text-base">Cities</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Placeholder */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-primary-500/30 backdrop-blur-sm border-2 border-primary-400/50 flex items-center justify-center">
                <svg className="w-48 h-48 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
