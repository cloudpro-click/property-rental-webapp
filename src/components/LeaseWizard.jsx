import React, { useState, useEffect } from 'react';

const LeaseWizard = ({
  isOpen,
  currentStep,
  formData,
  setFormData,
  handleNext,
  handleBack,
  handleSubmit,
  closeModal,
  isEditing = false,
  properties = [],
  rooms = [],
  tenants = [],
  isSubmitting = false
}) => {
  const totalSteps = 4;
  const [roomFilter, setRoomFilter] = useState('vacant'); // vacant, occupied (default: vacant only)
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertySearch, setPropertySearch] = useState('');
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [tenantSearch, setTenantSearch] = useState('');
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [selectedTenants, setSelectedTenants] = useState([]); // Array of selected tenants
  const [primaryTenantId, setPrimaryTenantId] = useState(null); // ID of primary tenant
  const [filteredProperties, setFilteredProperties] = useState([]);

  // Filter properties based on search
  useEffect(() => {
    if (propertySearch.trim() === '') {
      setFilteredProperties(properties.slice(0, 5)); // Show first 5
    } else {
      const search = propertySearch.toLowerCase();
      const filtered = properties.filter(property =>
        property.name.toLowerCase().includes(search)
      ).slice(0, 5);
      setFilteredProperties(filtered);
    }
  }, [propertySearch, properties]);

  // Filter rooms based on property and status
  useEffect(() => {
    if (!formData.propertyId) {
      setFilteredRooms([]);
      return;
    }

    let filtered = rooms.filter(room => room.building_id === formData.propertyId);

    if (roomFilter === 'vacant') {
      filtered = filtered.filter(room => room.status === 'vacant');
    } else if (roomFilter === 'occupied') {
      filtered = filtered.filter(room => room.status === 'occupied' && room.occupancy?.available_slots > 0);
    }

    setFilteredRooms(filtered);
  }, [formData.propertyId, roomFilter, rooms]);

  // Filter tenants based on search
  useEffect(() => {
    if (tenantSearch.trim() === '') {
      setFilteredTenants(tenants.slice(0, 5)); // Show first 5
    } else {
      const search = tenantSearch.toLowerCase();
      const filtered = tenants.filter(tenant =>
        tenant.name.toLowerCase().includes(search) ||
        tenant.email.toLowerCase().includes(search) ||
        tenant.phone.includes(search)
      ).slice(0, 5);
      setFilteredTenants(filtered);
    }
  }, [tenantSearch, tenants]);

  // Handle property selection
  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setPropertySearch(property.name);
    setShowPropertyDropdown(false);
    setFormData({
      ...formData,
      propertyId: property.building_id,
      roomId: '',
      roomNumber: '',
      floor: '',
      capacity: 0
    });
  };

  // Handle room selection
  const handleRoomSelect = (room) => {
    setFormData({
      ...formData,
      roomId: room.room_id,
      roomNumber: room.roomNumber,
      floor: room.floor,
      capacity: room.capacity,
      rent: room.rent,
      isAddingRoommate: room.status === 'occupied'
    });
  };

  // Handle adding tenant to selection
  const handleAddTenant = (tenant) => {
    // Prevent duplicates
    if (selectedTenants.find(t => t.tenant_id === tenant.tenant_id)) {
      return;
    }

    const newTenants = [...selectedTenants, tenant];
    setSelectedTenants(newTenants);

    // Set first tenant as primary by default
    if (!primaryTenantId && newTenants.length === 1) {
      setPrimaryTenantId(tenant.tenant_id);
    }

    // Update formData with primary tenant info for backward compatibility
    if (newTenants.length === 1) {
      setFormData({
        ...formData,
        tenantId: tenant.tenant_id,
        tenantName: tenant.name,
        tenantEmail: tenant.email,
        tenantPhone: tenant.phone
      });
    }

    setTenantSearch('');
    setShowTenantDropdown(false);
  };

  // Remove tenant from selection
  const handleRemoveTenant = (tenantId) => {
    const newTenants = selectedTenants.filter(t => t.tenant_id !== tenantId);
    setSelectedTenants(newTenants);

    // If removed tenant was primary, set new primary
    if (primaryTenantId === tenantId && newTenants.length > 0) {
      setPrimaryTenantId(newTenants[0].tenant_id);
    } else if (newTenants.length === 0) {
      setPrimaryTenantId(null);
    }

    // Update formData
    if (newTenants.length > 0) {
      const primaryTenant = newTenants.find(t => t.tenant_id === (primaryTenantId === tenantId ? newTenants[0].tenant_id : primaryTenantId));
      setFormData({
        ...formData,
        tenantId: primaryTenant.tenant_id,
        tenantName: primaryTenant.name,
        tenantEmail: primaryTenant.email,
        tenantPhone: primaryTenant.phone
      });
    } else {
      setFormData({
        ...formData,
        tenantId: '',
        tenantName: '',
        tenantEmail: '',
        tenantPhone: ''
      });
    }
  };

  // Set primary tenant
  const handleSetPrimary = (tenantId) => {
    setPrimaryTenantId(tenantId);
    const primaryTenant = selectedTenants.find(t => t.tenant_id === tenantId);
    if (primaryTenant) {
      setFormData({
        ...formData,
        tenantId: primaryTenant.tenant_id,
        tenantName: primaryTenant.name,
        tenantEmail: primaryTenant.email,
        tenantPhone: primaryTenant.phone
      });
    }
  };

  // Validate current step
  const isStepValid = () => {
    switch (currentStep) {
      case 1: // Room Selection
        return formData.propertyId && formData.roomId;
      case 2: // Tenant Selection
        return selectedTenants.length > 0 && primaryTenantId;
      case 3: // Payment & Terms
        return formData.startDate && formData.rent && formData.rent > 0 && formData.moveInDate;
      case 4: // Review
        return true;
      default:
        return false;
    }
  };

  // Step indicators
  const steps = [
    { number: 1, title: 'Room', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { number: 2, title: 'Tenants', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { number: 3, title: 'Terms', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { number: 4, title: 'Review', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Step Indicators */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all ${
                    currentStep === step.number
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                      : currentStep > step.number
                      ? 'bg-green-600 text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {currentStep > step.number ? (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                    </svg>
                  )}
                </div>
                <span className={`mt-2 text-xs sm:text-sm font-medium ${
                  currentStep === step.number ? 'text-primary-600' : 'text-neutral-600'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded ${
                  currentStep > step.number ? 'bg-green-600' : 'bg-neutral-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} className="space-y-6">
        {/* STEP 1: Room Selection */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4">Select Room</h3>

              {/* Property Selection - Searchable */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Property <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={propertySearch}
                    onChange={(e) => {
                      setPropertySearch(e.target.value);
                      setShowPropertyDropdown(true);
                      if (e.target.value === '') {
                        setSelectedProperty(null);
                        setFormData({ ...formData, propertyId: '', roomId: '', roomNumber: '', floor: '', capacity: 0 });
                      }
                    }}
                    onFocus={() => setShowPropertyDropdown(true)}
                    placeholder="Search property..."
                    className="input-field pr-10"
                    required
                  />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>

                  {/* Property Dropdown */}
                  {showPropertyDropdown && filteredProperties.length > 0 && !selectedProperty && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredProperties.map(property => (
                        <button
                          key={property.building_id}
                          type="button"
                          onClick={() => handlePropertySelect(property)}
                          className="w-full px-4 py-3 text-left hover:bg-primary-50 border-b border-neutral-100 last:border-b-0"
                        >
                          <div className="font-medium text-neutral-900">{property.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Room Status Filter */}
              {formData.propertyId && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Room Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRoomFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        roomFilter === 'all'
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      All Rooms
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoomFilter('vacant')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        roomFilter === 'vacant'
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      Vacant Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoomFilter('occupied')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        roomFilter === 'occupied'
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      Add Roommate
                    </button>
                  </div>
                </div>
              )}

              {/* Room Cards */}
              {formData.propertyId && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredRooms.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500">
                      <svg className="w-12 h-12 mx-auto mb-2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-sm">No rooms available</p>
                    </div>
                  ) : (
                    filteredRooms.map(room => (
                      <button
                        key={room.room_id}
                        type="button"
                        onClick={() => handleRoomSelect(room)}
                        className={`w-full border-2 rounded-lg p-4 text-left transition-all ${
                          formData.roomId === room.room_id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 hover:border-primary-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-neutral-900">Room {room.roomNumber}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                room.status === 'vacant'
                                  ? 'bg-green-100 text-green-800'
                                  : room.status === 'occupied'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                              </span>
                            </div>
                            <div className="text-sm text-neutral-600 space-y-1">
                              <div>Floor {room.floor} • Capacity: {room.capacity}</div>
                              <div className="font-medium text-primary-600">₱{room.rent?.toLocaleString()}/month</div>
                              {room.status === 'occupied' && room.occupancy && (
                                <div className="text-xs text-blue-600">
                                  {room.occupancy.current_tenants}/{room.capacity} occupied • {room.occupancy.available_slots} slot(s) available
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Tenant Selection */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4">Select Tenants</h3>

              {/* Info Box for Adding Roommate */}
              {formData.isAddingRoommate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-blue-900 text-sm">Adding Roommate</p>
                      <p className="text-sm text-blue-700">This tenant will share Room {formData.roomNumber} with existing tenant(s).</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tenant Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Search and Add Tenants
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={tenantSearch}
                    onChange={(e) => {
                      setTenantSearch(e.target.value);
                      setShowTenantDropdown(true);
                    }}
                    onFocus={() => setShowTenantDropdown(true)}
                    placeholder="Search by name, email, or phone"
                    className="input-field pr-10"
                  />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>

                  {/* Tenant Dropdown */}
                  {showTenantDropdown && filteredTenants.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredTenants.map(tenant => (
                        <button
                          key={tenant.tenant_id}
                          type="button"
                          onClick={() => handleAddTenant(tenant)}
                          className="w-full px-4 py-3 text-left hover:bg-primary-50 border-b border-neutral-100 last:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={selectedTenants.find(t => t.tenant_id === tenant.tenant_id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-neutral-900">{tenant.name}</div>
                              <div className="text-sm text-neutral-600">{tenant.email}</div>
                              <div className="text-sm text-neutral-500">{tenant.phone}</div>
                            </div>
                            {selectedTenants.find(t => t.tenant_id === tenant.tenant_id) && (
                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Tenants Display */}
              {selectedTenants.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-neutral-700">
                      Selected Tenants ({selectedTenants.length})
                    </label>
                    {selectedTenants.length > 1 && (
                      <p className="text-xs text-neutral-500">One must be designated as Primary</p>
                    )}
                  </div>

                  {selectedTenants.map(tenant => (
                    <div
                      key={tenant.tenant_id}
                      className={`border-2 rounded-lg p-3 transition-all ${
                        primaryTenantId === tenant.tenant_id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-neutral-900 truncate">{tenant.name}</p>
                            {primaryTenantId === tenant.tenant_id && (
                              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary-600 text-white whitespace-nowrap">
                                PRIMARY
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-600 truncate">{tenant.email}</p>
                          <p className="text-sm text-neutral-500">{tenant.phone}</p>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-2">
                            {primaryTenantId !== tenant.tenant_id && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimary(tenant.tenant_id)}
                                className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                              >
                                Set as Primary
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveTenant(tenant.tenant_id)}
                              className="text-xs text-red-600 hover:text-red-800 font-medium ml-auto"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Info about Primary Tenant */}
                  {primaryTenantId && (
                    <div className="bg-accent-50 border border-accent-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-accent-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-accent-800">
                          The PRIMARY tenant is responsible for rent payment.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Create New Tenant Link */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                  onClick={() => {
                    // TODO: Open Tenant Wizard
                    alert('Create New Tenant - To be implemented');
                  }}
                >
                  + Create New Tenant
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Lease Terms */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4">Lease Terms</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Lease Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Lease End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input-field"
                    disabled={formData.isOpenEnded}
                  />
                  <div className="mt-2 flex items-center">
                    <input
                      type="checkbox"
                      id="openEnded"
                      checked={formData.isOpenEnded}
                      onChange={(e) => setFormData({ ...formData, isOpenEnded: e.target.checked, endDate: '' })}
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="openEnded" className="ml-2 text-sm text-neutral-700">
                      Open-ended lease
                    </label>
                  </div>
                </div>

                {/* Monthly Rent */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Monthly Rent <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">₱</span>
                    <input
                      type="number"
                      value={formData.rent}
                      onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                      className="input-field pl-8"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                {/* Move-in Date */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Move-in Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.moveInDate}
                    onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* Utility Bills Inclusion */}
              <div className="mt-4 border-t border-neutral-200 pt-4">
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Utilities Included in Rent
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.includesElectric || false}
                      onChange={(e) => setFormData({ ...formData, includesElectric: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <div className="ml-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-sm font-medium text-neutral-900">Electric Bill</span>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.includesWater || false}
                      onChange={(e) => setFormData({ ...formData, includesWater: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <div className="ml-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span className="text-sm font-medium text-neutral-900">Water Bill</span>
                    </div>
                  </label>
                </div>
                <p className="text-xs text-neutral-500 mt-2">Select utilities that are included in the monthly rent</p>
              </div>

              {/* Notes */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Any additional notes about this lease..."
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-3">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3">Review & Confirm</h3>

              {/* Compact Review Layout */}
              <div className="border border-neutral-200 rounded-lg divide-y divide-neutral-200">
                {/* Room Information */}
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-neutral-700 mb-2">Room Details</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Property:</span>
                      <span className="font-medium text-neutral-900">{selectedProperty?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Room:</span>
                      <span className="font-medium text-neutral-900">{formData.roomNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Floor:</span>
                      <span className="font-medium text-neutral-900">{formData.floor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Capacity:</span>
                      <span className="font-medium text-neutral-900">{formData.capacity}</span>
                    </div>
                  </div>
                </div>

                {/* Tenant Information */}
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-neutral-700 mb-2">
                    {selectedTenants.length > 1 ? `Tenants (${selectedTenants.length})` : 'Tenant'}
                  </h4>
                  <div className="space-y-2">
                    {selectedTenants.map(tenant => (
                      <div key={tenant.tenant_id} className="flex items-center justify-between text-sm bg-neutral-50 rounded p-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-900 truncate">{tenant.name}</span>
                            {primaryTenantId === tenant.tenant_id && (
                              <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-primary-600 text-white whitespace-nowrap">
                                PRIMARY
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-neutral-600 truncate">{tenant.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lease Terms */}
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-neutral-700 mb-2">Lease Terms</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Monthly Rent:</span>
                      <span className="font-semibold text-primary-600">₱{parseFloat(formData.rent).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Move-in:</span>
                      <span className="font-medium text-neutral-900">
                        {new Date(formData.moveInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Lease Start:</span>
                      <span className="font-medium text-neutral-900">
                        {new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Lease End:</span>
                      <span className="font-medium text-neutral-900">
                        {formData.isOpenEnded ? (
                          <span className="text-green-600 italic">Open</span>
                        ) : (
                          new Date(formData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Utilities */}
                {(formData.includesElectric || formData.includesWater) && (
                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-neutral-700 mb-2">Utilities Included</h4>
                    <div className="flex gap-2 flex-wrap">
                      {formData.includesElectric && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent-50 text-accent-700 rounded text-xs">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Electric
                        </span>
                      )}
                      {formData.includesWater && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                          Water
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {formData.notes && (
                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-neutral-700 mb-1">Notes</h4>
                    <p className="text-sm text-neutral-600">{formData.notes}</p>
                  </div>
                )}
              </div>

              {/* Warning for Review */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-blue-800">
                    Please review all details carefully before submitting. Click "Create Lease" below to confirm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-neutral-200">
          <button
            type="button"
            onClick={currentStep === 1 ? closeModal : handleBack}
            className="btn-secondary text-sm sm:text-base"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center gap-2"
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="hidden sm:inline">Creating...</span>
                  <span className="sm:hidden">Creating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="hidden sm:inline">Create Lease</span>
                  <span className="sm:hidden">Create</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default LeaseWizard;
