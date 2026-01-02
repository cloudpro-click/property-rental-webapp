import React, { useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_REGIONS, GET_PROVINCES_BY_REGION, GET_CITIES_BY_PROVINCE } from '../lib/graphql-queries';
import SearchableSelect from './SearchableSelect';
import PhoneInput from './PhoneInput';

const BuildingWizard = ({
  currentStep,
  formData,
  setFormData,
  photos,
  handlePhotoUpload,
  removePhoto,
  handleGetLocation,
  locationLoading,
  handleNext,
  handleBack,
  handleSubmit,
  closeModal,
  isEditing = false,
  isSubmitting = false,
  fillDemoData,
  initialBuilding = null, // Original building data for edit mode (contains region/province/city names)
}) => {
  const totalSteps = 4;

  // Fetch all regions
  const { data: regionsData, loading: regionsLoading, error: regionsError } = useQuery(GET_ALL_REGIONS);

  // Get initial labels from initialBuilding if available
  const getInitialRegionName = () => {
    if (initialBuilding?.region?.name) return initialBuilding.region.name;
    return null;
  };

  const getInitialProvinceName = () => {
    if (initialBuilding?.province?.name) return initialBuilding.province.name;
    return null;
  };

  const getInitialCityName = () => {
    if (initialBuilding?.city?.name) return initialBuilding.city.name;
    return null;
  };

  // Fetch provinces when region is selected
  const { data: provincesData, loading: provincesLoading, error: provincesError } = useQuery(GET_PROVINCES_BY_REGION, {
    variables: { region_psgc_code: formData.region },
    skip: !formData.region
  });

  // Fetch cities when province is selected
  const { data: citiesData, loading: citiesLoading, error: citiesError } = useQuery(GET_CITIES_BY_PROVINCE, {
    variables: { province_psgc_code: formData.province },
    skip: !formData.province
  });

  // Extract data from GraphQL responses
  const regions = regionsData?.getAllRegions?.regions || [];
  const provinces = provincesData?.getProvincesByRegion?.provinces || [];
  const cities = citiesData?.getCitiesByProvince?.cities || [];

  // Get current selected names from loaded options or fall back to initial building data
  const getRegionLabel = () => {
    const found = regions.find(r => r.psgc_code === formData.region);
    if (found) return found.name;
    return getInitialRegionName();
  };

  const getProvinceLabel = () => {
    const found = provinces.find(p => p.psgc_code === formData.province);
    if (found) return found.name;
    return getInitialProvinceName();
  };

  const getCityLabel = () => {
    const found = cities.find(c => c.psgc_code === formData.city);
    if (found) return found.name;
    return getInitialCityName();
  };

  // Track previous values to avoid resetting on initial mount
  // Use null initially to detect first render vs user changes
  const prevRegionRef = useRef(null);
  const prevProvinceRef = useRef(null);
  const isInitialMount = useRef(true);

  // Initialize refs after first render to capture initial values (for edit mode)
  useEffect(() => {
    if (isInitialMount.current) {
      // Set initial values after mount so we can detect user changes
      prevRegionRef.current = formData.region;
      prevProvinceRef.current = formData.province;
      isInitialMount.current = false;
    }
  }, [formData.region, formData.province]);

  // Reset province and city when region changes (but not on initial values)
  useEffect(() => {
    // Skip if this is the initial mount or if refs haven't been initialized
    if (isInitialMount.current || prevRegionRef.current === null) {
      return;
    }

    // Only reset if region actually changed from a previous non-empty value
    if (prevRegionRef.current !== formData.region && prevRegionRef.current !== '') {
      setFormData(prev => ({ ...prev, province: '', city: '' }));
    }
    prevRegionRef.current = formData.region;
  }, [formData.region, setFormData]);

  // Reset city when province changes (but not on initial values)
  useEffect(() => {
    // Skip if this is the initial mount or if refs haven't been initialized
    if (isInitialMount.current || prevProvinceRef.current === null) {
      return;
    }

    // Only reset if province actually changed from a previous non-empty value
    if (prevProvinceRef.current !== formData.province && prevProvinceRef.current !== '') {
      setFormData(prev => ({ ...prev, city: '' }));
    }
    prevProvinceRef.current = formData.province;
  }, [formData.province, setFormData]);

  return (
    <>
      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2 sm:mb-3">Basic Information</h4>

          {/* Building Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Building Name <span className="text-secondary-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g., Building A, Manila Residences"
            />
            <p className="text-xs text-neutral-500 mt-1">Give your building a unique name</p>
          </div>

          {/* Total Rooms */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Total Rooms/Units <span className="text-secondary-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.totalRooms}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 1000)) {
                  setFormData({ ...formData, totalRooms: value });
                }
              }}
              className="input-field"
              placeholder="e.g., 10"
            />
            <p className="text-xs text-neutral-500 mt-1">How many rentable units in this building?</p>
          </div>

          {/* Number of Floors */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Number of Floors <span className="text-secondary-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.floors}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 100)) {
                  setFormData({ ...formData, floors: value });
                }
              }}
              className="input-field"
              placeholder="e.g., 3"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1.5">
              Description / Notes (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows="3"
              placeholder="Additional information about this building..."
            ></textarea>
          </div>
        </div>
      )}

      {/* Step 2: Address Information */}
      {currentStep === 2 && (
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2 sm:mb-3">Address Information</h4>

          {/* Street Address */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Street Address <span className="text-secondary-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input-field"
              placeholder="e.g., 123 Rizal Street, Barangay Santo Niño"
            />
            <p className="text-xs text-neutral-500 mt-1">Street address and barangay</p>
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Region <span className="text-secondary-500">*</span>
            </label>
            {regionsLoading ? (
              <div className="input-field flex items-center text-neutral-500 text-sm">
                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading regions...
              </div>
            ) : regionsError ? (
              <div className="input-field text-red-500 text-sm">Error loading regions: {regionsError.message}</div>
            ) : (
              <SearchableSelect
                value={formData.region || ''}
                onChange={(value) => setFormData({ ...formData, region: value })}
                options={regions}
                placeholder={regions.length === 0 ? "No regions available" : "Select Region"}
                displayKey="name"
                valueKey="psgc_code"
                selectedLabel={getRegionLabel()}
              />
            )}
          </div>

          {/* Province and City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Province <span className="text-secondary-500">*</span>
              </label>
              {provincesLoading ? (
                <div className="input-field flex items-center text-neutral-500 text-sm">
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                <SearchableSelect
                  value={formData.province || ''}
                  onChange={(value) => setFormData({ ...formData, province: value })}
                  options={provinces}
                  placeholder="Select Province"
                  displayKey="name"
                  valueKey="psgc_code"
                  disabled={!formData.region}
                  selectedLabel={getProvinceLabel()}
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                City/Municipality <span className="text-secondary-500">*</span>
              </label>
              {citiesLoading ? (
                <div className="input-field flex items-center text-neutral-500 text-sm">
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                <SearchableSelect
                  value={formData.city || ''}
                  onChange={(value) => setFormData({ ...formData, city: value })}
                  options={cities}
                  placeholder="Select City"
                  displayKey="name"
                  valueKey="psgc_code"
                  disabled={!formData.province}
                  selectedLabel={getCityLabel()}
                />
              )}
            </div>
          </div>

          {/* Landmark */}
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1.5">
              Landmark (Optional)
            </label>
            <input
              type="text"
              value={formData.landmark || ''}
              onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              className="input-field"
              placeholder="e.g., Near SM Mall, Beside City Hall"
            />
            <p className="text-xs text-neutral-500 mt-1">Nearby landmark for easier location</p>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1.5">
                Contact Person (Optional)
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="input-field"
                placeholder="e.g., Juan Dela Cruz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1.5">
                Contact Phone (Optional)
              </label>
              <PhoneInput
                value={formData.contactPhone || ''}
                onChange={(value) => setFormData({ ...formData, contactPhone: value })}
                placeholder="917 123 4567"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Geolocation */}
      {currentStep === 3 && (
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-neutral-900 mb-1.5 sm:mb-2">
            Geolocation <span className="text-secondary-500">*</span>
          </h4>
          <p className="text-xs sm:text-sm text-neutral-600 mb-2 sm:mb-3">
            Add the building's location for navigation and sharing with tenants.
          </p>

          {/* Get Current Location Button */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationLoading}
              className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
            >
              {locationLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting Location...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Use My Current Location
                </>
              )}
            </button>
          </div>

          {/* Manual Entry */}
          <div className="text-center text-sm text-neutral-500 my-3">OR</div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Latitude <span className="text-secondary-500">*</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                className="input-field"
                placeholder="e.g., 14.599512"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Longitude <span className="text-secondary-500">*</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                className="input-field"
                placeholder="e.g., 120.984222"
              />
            </div>
          </div>

          {/* Location Preview */}
          {formData.latitude && formData.longitude && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
              <h5 className="text-sm font-medium text-neutral-700 mb-1.5">Location Preview</h5>
              <p className="text-sm text-neutral-600 mb-2">
                {formData.latitude}, {formData.longitude}
              </p>
              <a
                href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Google Maps
              </a>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Photos */}
      {currentStep === 4 && (
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-neutral-900 mb-1.5 sm:mb-2">Building Photos (Optional)</h4>
          <p className="text-xs sm:text-sm text-neutral-600 mb-2 sm:mb-3">
            Add photos of your building to help identify it.
          </p>

          {/* Photo Upload */}
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-4 sm:p-6 text-center hover:border-primary-500 transition-colors">
            <input
              type="file"
              id="photo-upload"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <svg className="w-12 h-12 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-neutral-600 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-neutral-500">PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>

          {/* Photo Preview Grid */}
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-secondary-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <p className="text-xs text-neutral-500 mt-1 truncate">{photo.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="p-4 sm:p-5 border-t border-neutral-200 flex justify-between gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            currentStep === 1 ? closeModal() : handleBack();
          }}
          className="px-4 sm:px-5 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium transition-colors text-sm sm:text-base flex items-center gap-2"
        >
          {currentStep === 1 ? (
            <>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </>
          )}
        </button>

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleNext();
            }}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center gap-2"
            disabled={
              (currentStep === 1 && (!formData.name || !formData.totalRooms || !formData.floors)) ||
              (currentStep === 2 && (!formData.address || !formData.region || !formData.province || !formData.city)) ||
              (currentStep === 3 && (!formData.latitude || !formData.longitude))
            }
          >
            <span className="hidden sm:inline">Next Step</span>
            <span className="sm:hidden">Next</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="hidden sm:inline">{isEditing ? 'Updating...' : 'Creating...'}</span>
                <span className="sm:hidden">Saving...</span>
              </>
            ) : isEditing ? (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Update Building</span>
                <span className="sm:hidden">Update</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden sm:inline">Create Building</span>
                <span className="sm:hidden">Create</span>
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default BuildingWizard;
