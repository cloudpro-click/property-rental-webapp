import React, { useState } from 'react';
import PhoneInput from './PhoneInput';

const TenantWizard = ({
  currentStep,
  formData,
  setFormData,
  handleNext,
  handleBack,
  handleSubmit,
  closeModal,
  isEditing = false,
  existingTenants = []
}) => {
  const totalSteps = 3;
  const [relationshipSearch, setRelationshipSearch] = useState('');
  const [showRelationshipDropdown, setShowRelationshipDropdown] = useState(false);
  const [phoneCheckStatus, setPhoneCheckStatus] = useState(null); // null, 'available', 'taken'

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

  // Check phone number uniqueness
  const checkPhoneUniqueness = (phone) => {
    if (!phone || phone.length < 10) {
      setPhoneCheckStatus(null);
      return;
    }

    // Check if phone exists in other tenants (excluding current tenant when editing)
    const phoneExists = existingTenants.some(tenant => {
      // When editing, exclude the current tenant from the check
      if (isEditing && tenant.phone === formData.phone && tenant.id === formData.id) {
        return false;
      }
      return tenant.phone === phone;
    });

    setPhoneCheckStatus(phoneExists ? 'taken' : 'available');
  };

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
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <PhoneInput
                      value={formData.phone}
                      onChange={(value) => {
                        setFormData({ ...formData, phone: value });
                        checkPhoneUniqueness(value);
                      }}
                      placeholder="917 123 4567"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Phone uniqueness indicator */}
                    {phoneCheckStatus === 'taken' && (
                      <div className="flex items-center gap-1 text-xs text-red-600" title="Phone number already exists">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden sm:inline">Taken</span>
                      </div>
                    )}
                    {phoneCheckStatus === 'available' && !isEditing && (
                      <div className="flex items-center gap-1 text-xs text-green-600" title="Phone number is available">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden sm:inline">Available</span>
                      </div>
                    )}
                    {/* Phone verification button */}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, phoneVerified: !formData.phoneVerified })}
                      className="focus:outline-none"
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
                {phoneCheckStatus === 'taken' && (
                  <p className="text-xs text-red-600">This phone number is already registered to another tenant</p>
                )}
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
              <PhoneInput
                value={formData.emergencyContactPhone || ''}
                onChange={(value) => setFormData({ ...formData, emergencyContactPhone: value })}
                placeholder="917 123 4567"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Guardian Details */}
      {currentStep === 2 && (
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-neutral-700 mb-1.5 sm:mb-2">
            Guardian Details
          </h4>
          <p className="text-xs sm:text-sm text-neutral-600 mb-2 sm:mb-3">
            Add guardian or emergency contact information.
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
        </div>
      )}

      {/* Step 3: Additional Information (Optional) */}
      {currentStep === 3 && (
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-neutral-500 mb-1.5 sm:mb-2">
            Additional Information (Optional)
          </h4>
          <p className="text-xs sm:text-sm text-neutral-600 mb-2 sm:mb-3">
            Add any additional notes and attach ID documents if available.
          </p>

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
              placeholder="Any additional information about the tenant..."
            ></textarea>
          </div>

          {/* ID Attachment */}
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1.5">
              Government ID Attachment
            </label>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-4 hover:border-primary-400 transition-colors">
              <input
                type="file"
                id="idAttachment"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, idAttachment: e.target.files[0] })}
                className="hidden"
              />
              <label
                htmlFor="idAttachment"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {formData.idAttachment ? (
                  <>
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-center">
                      <p className="text-sm font-medium text-neutral-900">{formData.idAttachment.name}</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {(formData.idAttachment.size / 1024).toFixed(2)} KB
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData({ ...formData, idAttachment: null });
                        }}
                        className="text-xs text-secondary-600 hover:text-secondary-800 mt-2 font-medium"
                      >
                        Remove file
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="text-center">
                      <p className="text-sm font-medium text-neutral-900">Click to upload ID</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        PNG, JPG, or GIF (max 5MB)
                      </p>
                    </div>
                  </>
                )}
              </label>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              Upload a clear photo of government-issued ID (e.g., Driver's License, SSS, UMID)
            </p>
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
            disabled={currentStep === 1 && (!formData.name || !formData.email || !formData.phone || phoneCheckStatus === 'taken')}
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
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center justify-center gap-2"
            disabled={phoneCheckStatus === 'taken'}
          >
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Register Tenant</span>
                <span className="sm:hidden">Register</span>
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default TenantWizard;
