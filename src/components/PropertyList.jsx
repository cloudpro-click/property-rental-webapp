import React from 'react';
import PropertyCard from './PropertyCard';

const PropertyList = () => {
  const properties = [
    {
      id: 1,
      title: 'Modern Downtown Apartment',
      location: 'New York, NY',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      price: 3500,
      featured: true,
    },
    {
      id: 2,
      title: 'Cozy Studio in Brooklyn',
      location: 'Brooklyn, NY',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 650,
      price: 2200,
      featured: false,
    },
    {
      id: 3,
      title: 'Luxury Penthouse Suite',
      location: 'Manhattan, NY',
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2500,
      price: 8500,
      featured: true,
    },
    {
      id: 4,
      title: 'Spacious Family Home',
      location: 'Queens, NY',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2200,
      price: 4200,
      featured: false,
    },
    {
      id: 5,
      title: 'Charming Loft Space',
      location: 'SoHo, NY',
      bedrooms: 2,
      bathrooms: 1,
      sqft: 1100,
      price: 4000,
      featured: false,
    },
    {
      id: 6,
      title: 'Waterfront Condo',
      location: 'Jersey City, NJ',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1400,
      price: 3200,
      featured: true,
    },
  ];

  return (
    <section id="properties" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Browse our handpicked selection of premium rental properties
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          <button className="px-4 sm:px-6 py-2 bg-primary-600 text-white rounded-full text-sm font-medium transition-all hover:bg-primary-700">
            All Properties
          </button>
          <button className="px-4 sm:px-6 py-2 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium transition-all hover:bg-neutral-200">
            Apartments
          </button>
          <button className="px-4 sm:px-6 py-2 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium transition-all hover:bg-neutral-200">
            Houses
          </button>
          <button className="px-4 sm:px-6 py-2 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium transition-all hover:bg-neutral-200">
            Studios
          </button>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="btn-secondary">
            Load More Properties
          </button>
        </div>
      </div>
    </section>
  );
};

export default PropertyList;
