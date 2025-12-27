import React from 'react';

const RoomWizard = ({
  currentStep,
  formData,
  setFormData,
  buildings,
  handleNext,
  handleBack,
  handleSubmit,
  closeModal,
  isEditing = false
}) => {
  const totalSteps = 3;

  return (
    <>
      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2 sm:mb-3">Basic Information</h4>

          {/* Building */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Building <span className="text-secondary-500">*</span>
            </label>
            <select
              required
              value={formData.building}
              onChange={(e) => setFormData({ ...formData, building: e.target.value })}
              className="input-field"
            >
              {buildings.map((building) => (
                <option key={building} value={building}>{building}</option>
              ))}
            </select>
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

          {/* Electric Meter Number */}
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
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities?.includes('Air Conditioning')}
                  onChange={(e) => {
                    const amenitiesList = formData.amenities ? formData.amenities.split(', ') : [];
                    if (e.target.checked) {
                      amenitiesList.push('Air Conditioning');
                    } else {
                      const index = amenitiesList.indexOf('Air Conditioning');
                      if (index > -1) amenitiesList.splice(index, 1);
                    }
                    setFormData({ ...formData, amenities: amenitiesList.join(', ') });
                  }}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">Air Conditioning</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities?.includes('Wi-Fi')}
                  onChange={(e) => {
                    const amenitiesList = formData.amenities ? formData.amenities.split(', ') : [];
                    if (e.target.checked) {
                      amenitiesList.push('Wi-Fi');
                    } else {
                      const index = amenitiesList.indexOf('Wi-Fi');
                      if (index > -1) amenitiesList.splice(index, 1);
                    }
                    setFormData({ ...formData, amenities: amenitiesList.join(', ') });
                  }}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">Wi-Fi</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities?.includes('Kitchen')}
                  onChange={(e) => {
                    const amenitiesList = formData.amenities ? formData.amenities.split(', ') : [];
                    if (e.target.checked) {
                      amenitiesList.push('Kitchen');
                    } else {
                      const index = amenitiesList.indexOf('Kitchen');
                      if (index > -1) amenitiesList.splice(index, 1);
                    }
                    setFormData({ ...formData, amenities: amenitiesList.join(', ') });
                  }}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">Kitchen</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities?.includes('Private Bathroom')}
                  onChange={(e) => {
                    const amenitiesList = formData.amenities ? formData.amenities.split(', ') : [];
                    if (e.target.checked) {
                      amenitiesList.push('Private Bathroom');
                    } else {
                      const index = amenitiesList.indexOf('Private Bathroom');
                      if (index > -1) amenitiesList.splice(index, 1);
                    }
                    setFormData({ ...formData, amenities: amenitiesList.join(', ') });
                  }}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">Private Bathroom</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities?.includes('Water Heater')}
                  onChange={(e) => {
                    const amenitiesList = formData.amenities ? formData.amenities.split(', ') : [];
                    if (e.target.checked) {
                      amenitiesList.push('Water Heater');
                    } else {
                      const index = amenitiesList.indexOf('Water Heater');
                      if (index > -1) amenitiesList.splice(index, 1);
                    }
                    setFormData({ ...formData, amenities: amenitiesList.join(', ') });
                  }}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">Water Heater</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities?.includes('Balcony')}
                  onChange={(e) => {
                    const amenitiesList = formData.amenities ? formData.amenities.split(', ') : [];
                    if (e.target.checked) {
                      amenitiesList.push('Balcony');
                    } else {
                      const index = amenitiesList.indexOf('Balcony');
                      if (index > -1) amenitiesList.splice(index, 1);
                    }
                    setFormData({ ...formData, amenities: amenitiesList.join(', ') });
                  }}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">Balcony</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities?.includes('Furnished')}
                  onChange={(e) => {
                    const amenitiesList = formData.amenities ? formData.amenities.split(', ') : [];
                    if (e.target.checked) {
                      amenitiesList.push('Furnished');
                    } else {
                      const index = amenitiesList.indexOf('Furnished');
                      if (index > -1) amenitiesList.splice(index, 1);
                    }
                    setFormData({ ...formData, amenities: amenitiesList.join(', ') });
                  }}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">Furnished</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities?.includes('Parking')}
                  onChange={(e) => {
                    const amenitiesList = formData.amenities ? formData.amenities.split(', ') : [];
                    if (e.target.checked) {
                      amenitiesList.push('Parking');
                    } else {
                      const index = amenitiesList.indexOf('Parking');
                      if (index > -1) amenitiesList.splice(index, 1);
                    }
                    setFormData({ ...formData, amenities: amenitiesList.join(', ') });
                  }}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">Parking</span>
              </label>
            </div>
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
              (currentStep === 1 && (!formData.building || !formData.roomNumber || !formData.floor || !formData.electricMeter)) ||
              (currentStep === 2 && (!formData.rent || !formData.capacity))
            }
          >
            <span className="hidden sm:inline">Next Step</span>
            <span className="sm:hidden">Next</span>
          </button>
        ) : (
          <button type="submit" className="btn-primary text-sm sm:text-base">
            <span className="hidden sm:inline">{isEditing ? 'Update Room' : 'Create Room'}</span>
            <span className="sm:hidden">{isEditing ? 'Update' : 'Create'}</span>
          </button>
        )}
      </div>
    </>
  );
};

export default RoomWizard;
