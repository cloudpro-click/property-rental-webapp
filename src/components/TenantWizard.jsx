import React, { useState } from 'react';

const TenantWizard = ({
  currentStep,
  formData,
  setFormData,
  buildings,
  buildingsLoading,
  availableRooms,
  handleNext,
  handleBack,
  handleSubmit,
  closeModal,
  isEditing = false
}) => {
  const totalSteps = 3;
  const [relationshipSearch, setRelationshipSearch] = useState('');
  const [showRelationshipDropdown, setShowRelationshipDropdown] = useState(false);

  const relationshipOptions = [
    'Parent',
    'Sibling',
    'Spouse',
    'Relative',
    'Friend',
    'Employer',
    'Guardian',
    'Other'
  ];

  const filteredRelationships = relationshipSearch.trim()
    ? relationshipOptions.filter(rel =>
        rel.toLowerCase().includes(relationshipSearch.toLowerCase())
      )
    : relationshipOptions;

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
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field pr-10"
                  placeholder="+63 917 123 4567"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, phoneVerified: !formData.phoneVerified })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
                  title={formData.phoneVerified ? "Verified" : "Not verified"}
                >
                  {formData.phoneVerified ? (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
              </div>
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
            <div className="relative">
              <select
                required
                value={formData.buildingId}
                onChange={(e) => {
                  const selectedBuilding = buildings.find(b => b.building_id === e.target.value);
                  setFormData({
                    ...formData,
                    buildingId: e.target.value,
                    building: selectedBuilding?.name || '',
                    room: '',
                    roomId: ''
                  });
                }}
                className="input-field pl-10"
              >
                <option value="">Select a building</option>
                {buildingsLoading ? (
                  <option disabled>Loading buildings...</option>
                ) : (
                  buildings.map((building) => (
                    <option key={building.building_id} value={building.building_id}>
                      {building.name}
                    </option>
                  ))
                )}
              </select>
              {/* Building Icon */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Room Number (Dropdown based on building) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Room Number <span className="text-secondary-500">*</span>
            </label>
            <div className="relative">
              <select
                required
                value={formData.roomId}
                onChange={(e) => {
                  const selectedRoom = availableRooms.find(r => r.room_id === e.target.value);
                  setFormData({
                    ...formData,
                    roomId: e.target.value,
                    room: selectedRoom?.roomNumber || '',
                    rent: selectedRoom ? selectedRoom.rent.toString() : ''
                  });
                }}
                className="input-field pl-10"
                disabled={!formData.buildingId}
              >
                <option value="">
                  {!formData.buildingId ? 'Select a building first' : 'Select a room'}
                </option>
                {availableRooms
                  .filter(room => room.buildingId === formData.buildingId && room.status === 'vacant' && !room.deleted)
                  .map(room => (
                    <option key={room.room_id} value={room.room_id}>
                      Room {room.roomNumber} - Floor {room.floor} (₱{parseFloat(room.rent).toLocaleString()}/month)
                    </option>
                  ))
                }
              </select>
              {/* Door Icon */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
            {formData.buildingId && availableRooms.filter(r => r.buildingId === formData.buildingId && r.status === 'vacant' && !r.deleted).length === 0 && (
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

          {/* Guardian Relationship - Searchable */}
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1.5">
              Relationship to Tenant
            </label>
            <div className="relative">
              <input
                type="text"
                value={relationshipSearch || formData.guarantorRelationship}
                onChange={(e) => setRelationshipSearch(e.target.value)}
                onFocus={() => setShowRelationshipDropdown(true)}
                placeholder="Search or select relationship..."
                className="input-field pr-10"
              />
              {/* Search Icon or Clear Button */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {relationshipSearch ? (
                  <button
                    type="button"
                    onClick={() => {
                      setRelationshipSearch('');
                      setShowRelationshipDropdown(true);
                    }}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : (
                  <svg className="w-5 h-5 text-neutral-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>

              {/* Dropdown List */}
              {showRelationshipDropdown && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowRelationshipDropdown(false)}
                  ></div>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 max-h-48 overflow-y-auto z-20">
                    {filteredRelationships.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-neutral-600">No relationships found</div>
                    ) : (
                      filteredRelationships.map((relationship) => (
                        <button
                          key={relationship}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, guarantorRelationship: relationship });
                            setRelationshipSearch('');
                            setShowRelationshipDropdown(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-neutral-50 transition-colors ${
                            formData.guarantorRelationship === relationship
                              ? 'bg-primary-50 text-primary-900 font-medium'
                              : 'text-neutral-900'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{relationship}</span>
                            {formData.guarantorRelationship === relationship && (
                              <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
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
              <div className="relative">
                <input
                  type="tel"
                  value={formData.guarantorPhone}
                  onChange={(e) => setFormData({ ...formData, guarantorPhone: e.target.value })}
                  className="input-field pr-10"
                  placeholder="+63 917 123 4567"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, guarantorPhoneVerified: !formData.guarantorPhoneVerified })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
                  title={formData.guarantorPhoneVerified ? "Verified" : "Not verified"}
                >
                  {formData.guarantorPhoneVerified ? (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
              </div>
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
              (currentStep === 1 && (!formData.name || !formData.email || !formData.phone)) ||
              (currentStep === 2 && (!formData.building || !formData.room || !formData.rent || !formData.moveInDate))
            }
          >
            <span className="hidden sm:inline">Next Step</span>
            <span className="sm:hidden">Next</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button type="submit" className="btn-primary text-sm sm:text-base flex items-center justify-center gap-2">
            {isEditing ? (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Update Tenant</span>
                <span className="sm:hidden">Update</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Add Tenant</span>
                <span className="sm:hidden">Add</span>
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default TenantWizard;
