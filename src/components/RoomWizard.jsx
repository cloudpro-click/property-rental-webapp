import React from 'react';
import SearchableSelect from './SearchableSelect';

const RoomWizard = ({
  currentStep,
  formData,
  setFormData,
  buildings = [],
  buildingsLoading = false,
  amenities = [],
  amenitiesLoading = false,
  handleNext,
  handleBack,
  handleSubmit,
  closeModal,
  isEditing = false,
  isSubmitting = false
}) => {
  const totalSteps = 3;

  return (
    <>
      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2 sm:mb-3">Basic Information</h4>

          {/* Property */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Property <span className="text-secondary-500">*</span>
            </label>
            {buildingsLoading ? (
              <div className="flex items-center py-2">
                <svg className="animate-spin h-5 w-5 text-primary-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm text-neutral-600">Loading properties...</span>
              </div>
            ) : buildings.length === 0 ? (
              <p className="text-sm text-neutral-500 py-2">No properties available. Please add a property first.</p>
            ) : (
              <SearchableSelect
                value={formData.buildingId || ''}
                onChange={(value) => {
                  const selectedBuilding = buildings.find(b => b.building_id === value);
                  setFormData({
                    ...formData,
                    buildingId: value,
                    building: selectedBuilding?.name || ''
                  });
                }}
                options={buildings}
                displayKey="name"
                valueKey="building_id"
                placeholder="Select property"
                selectedLabel={formData.building}
              />
            )}
          </div>

          {/* Room Number */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Room Number <span className="text-secondary-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              className="input-field"
              placeholder="101"
            />
          </div>

          {/* Floor */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Floor <span className="text-secondary-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              className="input-field"
              placeholder="1"
            />
          </div>

          {/* Has Separate Electric Meter */}
          <div>
            <span className="block text-sm font-medium text-neutral-700 mb-2">
              Has Separate Electric Meter? <span className="text-secondary-500">*</span>
            </span>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="hasSeparateMeter"
                  checked={formData.hasSeparateMeter === true}
                  onChange={() => setFormData({ ...formData, hasSeparateMeter: true })}
                  className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-neutral-700">Yes</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="hasSeparateMeter"
                  checked={formData.hasSeparateMeter === false}
                  onChange={() => setFormData({ ...formData, hasSeparateMeter: false, electricMeter: '' })}
                  className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-neutral-700">No</span>
              </label>
            </div>
          </div>

          {/* Electric Meter Number - Only show if hasSeparateMeter is true */}
          {formData.hasSeparateMeter && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Electric Meter Number <span className="text-secondary-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.electricMeter}
                onChange={(e) => setFormData({ ...formData, electricMeter: e.target.value })}
                className="input-field"
                placeholder="EM-007-2024"
              />
            </div>
          )}
        </div>
      )}

      {/* Step 2: Rent & Capacity */}
      {currentStep === 2 && (
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2 sm:mb-3">Rent & Capacity</h4>

          {/* Monthly Rent */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Monthly Rent (₱) <span className="text-secondary-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.rent}
              onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
              className="input-field"
              placeholder="8500"
            />
          </div>

          {/* Good for How Many People */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Good for How Many People <span className="text-secondary-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              max="20"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="input-field"
              placeholder="2"
            />
            <p className="text-xs text-neutral-500 mt-1">Maximum number of occupants allowed</p>
          </div>

          {/* Room Size (Optional) */}
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1.5">
              Room Size (sq m)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="input-field"
              placeholder="25.5"
            />
          </div>
        </div>
      )}

      {/* Step 3: Additional Details */}
      {currentStep === 3 && (
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-neutral-500 mb-1.5 sm:mb-2">
            Additional Details (Optional)
          </h4>
          <p className="text-xs sm:text-sm text-neutral-600 mb-2 sm:mb-3">
            Add extra information about this room.
          </p>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-2">
              Amenities
            </label>
            {amenitiesLoading ? (
              <div className="flex items-center justify-center py-4">
                <svg className="animate-spin h-5 w-5 text-primary-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm text-neutral-600">Loading amenities...</span>
              </div>
            ) : amenities.length === 0 ? (
              <p className="text-sm text-neutral-500 py-2">No amenities available</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((amenity) => (
                  <label key={amenity.code} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities?.includes(amenity.code)}
                      onChange={(e) => {
                        const amenitiesList = formData.amenities ? formData.amenities.split(',').map(a => a.trim()).filter(Boolean) : [];
                        if (e.target.checked) {
                          amenitiesList.push(amenity.code);
                        } else {
                          const index = amenitiesList.indexOf(amenity.code);
                          if (index > -1) amenitiesList.splice(index, 1);
                        }
                        setFormData({ ...formData, amenities: amenitiesList.join(', ') });
                      }}
                      className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-700">{amenity.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1.5">
              Description / Notes
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows="4"
              placeholder="Additional information about this room..."
            ></textarea>
          </div>
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
              (currentStep === 1 && (!formData.buildingId || !formData.roomNumber || !formData.floor || formData.hasSeparateMeter === undefined || (formData.hasSeparateMeter && !formData.electricMeter))) ||
              (currentStep === 2 && (!formData.rent || !formData.capacity))
            }
          >
            <span className="hidden sm:inline">Next Step</span>
            <span className="sm:hidden">Next</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            ) : (
              <>
                <span className="hidden sm:inline">{isEditing ? 'Update Room' : 'Create Room'}</span>
                <span className="sm:hidden">{isEditing ? 'Update' : 'Create'}</span>
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default RoomWizard;
