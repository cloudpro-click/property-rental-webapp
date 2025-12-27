import React from 'react';

const TenantWizard = ({
  currentStep,
  formData,
  setFormData,
  availableRooms,
  handleNext,
  handleBack,
  handleSubmit,
  closeModal,
  isEditing = false
}) => {
  const totalSteps = 3;

  return (
    <>
      {/* Step 1: Tenant Information */}
      {currentStep === 1 && (
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2 sm:mb-3">Tenant Information</h4>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Full Name <span className="text-secondary-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="Juan Dela Cruz"
            />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Email Address <span className="text-secondary-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="juan@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Phone Number <span className="text-secondary-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
                placeholder="+63 917 123 4567"
              />
            </div>
          </div>

          {/* Date of Birth and ID Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1.5">
                Government ID Number
              </label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                className="input-field"
                placeholder="e.g., SSS, UMID, Driver's License"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1.5">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                className="input-field"
                placeholder="Name of emergency contact"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1.5">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                className="input-field"
                placeholder="+63 917 123 4567"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Room & Rent Details */}
      {currentStep === 2 && (
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2 sm:mb-3">Room & Rent Details</h4>

          {/* Building */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Building <span className="text-secondary-500">*</span>
            </label>
            <select
              required
              value={formData.building}
              onChange={(e) => {
                setFormData({ ...formData, building: e.target.value, room: '' });
              }}
              className="input-field"
            >
              <option value="">Select a building</option>
              <option value="Building A">Building A</option>
              <option value="Building B">Building B</option>
              <option value="Building C">Building C</option>
            </select>
          </div>

          {/* Room Number (Dropdown based on building) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Room Number <span className="text-secondary-500">*</span>
            </label>
            <select
              required
              value={formData.room}
              onChange={(e) => {
                const selectedRoom = availableRooms.find(r => r.id === e.target.value);
                setFormData({
                  ...formData,
                  room: e.target.value,
                  rent: selectedRoom ? selectedRoom.rent.replace('₱', '').replace(',', '') : ''
                });
              }}
              className="input-field"
              disabled={!formData.building}
            >
              <option value="">
                {!formData.building ? 'Select a building first' : 'Select a room'}
              </option>
              {availableRooms
                .filter(room => room.building === formData.building && room.status === 'vacant')
                .map(room => (
                  <option key={room.id} value={room.id}>
                    Room {room.roomNumber} - Floor {room.floor} ({room.rent}/month)
                  </option>
                ))
              }
            </select>
            {formData.building && availableRooms.filter(r => r.building === formData.building && r.status === 'vacant').length === 0 && (
              <p className="text-xs text-secondary-500 mt-1">No vacant rooms available in this building</p>
            )}
          </div>

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
              readOnly={!!formData.room}
            />
            <p className="text-xs text-neutral-500 mt-1">
              {formData.room ? 'Auto-filled from selected room' : 'Monthly rental amount'}
            </p>
          </div>

          {/* Move-in Date and Security Deposit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Move-in Date <span className="text-secondary-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.moveInDate}
                onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1.5">
                Security Deposit (₱)
              </label>
              <input
                type="number"
                min="0"
                value={formData.securityDeposit}
                onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                className="input-field"
                placeholder="8500"
              />
            </div>
          </div>

          {/* Advance Rent and Contract Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1.5">
                Advance Rent (months)
              </label>
              <input
                type="number"
                min="0"
                max="12"
                value={formData.advanceRent}
                onChange={(e) => setFormData({ ...formData, advanceRent: e.target.value })}
                className="input-field"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1.5">
                Contract Duration (months)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={formData.contractDuration}
                onChange={(e) => setFormData({ ...formData, contractDuration: e.target.value })}
                className="input-field"
                placeholder="12"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Guardian Details (Optional) */}
      {currentStep === 3 && (
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-neutral-500 mb-1.5 sm:mb-2">
            Guardian Details (Optional)
          </h4>
          <p className="text-xs sm:text-sm text-neutral-600 mb-2 sm:mb-3">
            Add guardian information if required. All fields in this section are optional.
          </p>

          {/* Guardian Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1.5">
              Guardian Full Name
            </label>
            <input
              type="text"
              value={formData.guarantorName}
              onChange={(e) => setFormData({ ...formData, guarantorName: e.target.value })}
              className="input-field"
              placeholder="Maria Santos"
            />
          </div>

          {/* Guardian Relationship */}
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1.5">
              Relationship to Tenant
            </label>
            <select
              value={formData.guarantorRelationship}
              onChange={(e) => setFormData({ ...formData, guarantorRelationship: e.target.value })}
              className="input-field"
            >
              <option value="">Select relationship</option>
              <option value="Parent">Parent</option>
              <option value="Sibling">Sibling</option>
              <option value="Spouse">Spouse</option>
              <option value="Relative">Relative</option>
              <option value="Friend">Friend</option>
              <option value="Employer">Employer</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Guardian Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1.5">
                Guardian Email
              </label>
              <input
                type="email"
                value={formData.guarantorEmail}
                onChange={(e) => setFormData({ ...formData, guarantorEmail: e.target.value })}
                className="input-field"
                placeholder="guardian@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1.5">
                Guardian Phone
              </label>
              <input
                type="tel"
                value={formData.guarantorPhone}
                onChange={(e) => setFormData({ ...formData, guarantorPhone: e.target.value })}
                className="input-field"
                placeholder="+63 917 123 4567"
              />
            </div>
          </div>

          {/* Guardian Address */}
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1.5">
              Guardian Address
            </label>
            <textarea
              value={formData.guarantorAddress}
              onChange={(e) => setFormData({ ...formData, guarantorAddress: e.target.value })}
              className="input-field"
              rows="2"
              placeholder="Complete address of guardian"
            ></textarea>
          </div>

          {/* Guardian ID Number */}
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1.5">
              Guardian Government ID Number
            </label>
            <input
              type="text"
              value={formData.guarantorIdNumber}
              onChange={(e) => setFormData({ ...formData, guarantorIdNumber: e.target.value })}
              className="input-field"
              placeholder="e.g., SSS, UMID, Driver's License"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1.5">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows="3"
              placeholder="Any additional information about the tenant or agreement..."
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
              (currentStep === 1 && (!formData.name || !formData.email || !formData.phone)) ||
              (currentStep === 2 && (!formData.building || !formData.room || !formData.rent || !formData.moveInDate))
            }
          >
            <span className="hidden sm:inline">Next Step</span>
            <span className="sm:hidden">Next</span>
          </button>
        ) : (
          <button type="submit" className="btn-primary text-sm sm:text-base">
            <span className="hidden sm:inline">{isEditing ? 'Update Tenant' : 'Add Tenant'}</span>
            <span className="sm:hidden">{isEditing ? 'Update' : 'Add'}</span>
          </button>
        )}
      </div>
    </>
  );
};

export default TenantWizard;
