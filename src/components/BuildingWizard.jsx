import React from 'react';

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
  isEditing = false
}) => {
  const totalSteps = 4;

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
              required
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
              type="number"
              required
              min="1"
              max="1000"
              value={formData.totalRooms}
              onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
              className="input-field"
              placeholder="e.g., 10"
            />
            <p className="text-xs text-neutral-500 mt-1">How many rentable units in this building?</p>
          </div>

          {/* Number of Floors */}
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1.5">
              Number of Floors (Optional)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.floors}
              onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
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
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input-field"
              placeholder="e.g., 123 Rizal Street, Barangay Santo Niño"
            />
            <p className="text-xs text-neutral-500 mt-1">Street address and barangay</p>
          </div>

          {/* City and Province */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                City/Municipality <span className="text-secondary-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="input-field"
                placeholder="e.g., Manila"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Province <span className="text-secondary-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="input-field"
                placeholder="e.g., Metro Manila"
              />
            </div>
          </div>

          {/* Zip Code */}
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1.5">
              Zip Code (Optional)
            </label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              className="input-field"
              placeholder="e.g., 1000"
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
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
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="input-field"
                placeholder="e.g., +63 917 123 4567"
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
                type="number"
                step="any"
                required
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
                type="number"
                step="any"
                required
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
          className="px-4 sm:px-5 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium transition-colors text-sm sm:text-base"
        >
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </button>

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleNext();
            }}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            disabled={
              (currentStep === 1 && (!formData.name || !formData.totalRooms)) ||
              (currentStep === 2 && (!formData.address || !formData.city || !formData.province)) ||
              (currentStep === 3 && (!formData.latitude || !formData.longitude))
            }
          >
            <span className="hidden sm:inline">Next Step</span>
            <span className="sm:hidden">Next</span>
          </button>
        ) : (
          <button type="submit" className="btn-primary text-sm sm:text-base">
            <span className="hidden sm:inline">{isEditing ? 'Update Building' : 'Create Building'}</span>
            <span className="sm:hidden">{isEditing ? 'Update' : 'Create'}</span>
          </button>
        )}
      </div>
    </>
  );
};

export default BuildingWizard;
