// Fallback amenities data (used when API is unavailable)
export const FALLBACK_AMENITIES = [
  { code: "AC", label: "Air Conditioning", category: "COMFORT" },
  { code: "WIFI", label: "Wi-Fi", category: "CONNECTIVITY" },
  { code: "KITCHEN_PRIVATE", label: "Private Kitchen", category: "FACILITY" },
  { code: "KITCHEN_SHARED", label: "Shared Kitchen", category: "FACILITY" },
  { code: "BATH_PRIVATE", label: "Private Bathroom", category: "SANITARY" },
  { code: "BATH_SHARED", label: "Shared Bathroom", category: "SANITARY" },
  { code: "WATER_HEATER", label: "Water Heater", category: "UTILITY" },
  { code: "BALCONY", label: "Balcony", category: "SPACE" },
  { code: "FURNISHED", label: "Furnished", category: "FURNISHING" },
  { code: "PARKING", label: "Parking", category: "FACILITY" },
  { code: "CCTV", label: "CCTV Security", category: "SECURITY" }
];

// Helper function to get amenity label by code
// Accepts optional amenities array from API, falls back to hardcoded list
export const getAmenityLabel = (code, amenities = FALLBACK_AMENITIES) => {
  const amenity = amenities.find(a => a.code === code);
  return amenity ? amenity.label : code;
};

// Helper function to get amenities by category
export const getAmenitiesByCategory = (category, amenities = FALLBACK_AMENITIES) => {
  return amenities.filter(a => a.category === category);
};

// Get all unique categories from amenities
export const getAmenityCategories = (amenities = FALLBACK_AMENITIES) => {
  return [...new Set(amenities.map(a => a.category))];
};
