import React, { useState, useEffect } from 'react';

const BillingWizard = ({ closeModal, isEditing, editingBill, bills, setBills }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    building: editingBill?.building || 'Building A',
    room: editingBill?.room || '',
    tenant: editingBill?.tenant || '',
    billMonth: editingBill?.billMonth || new Date().toISOString().slice(0, 7),
    electricPrevReading: editingBill?.electricPrevReading || '',
    electricCurrReading: editingBill?.electricCurrReading || '',
    electricUnits: editingBill?.electricUnits || '',
    electricRate: editingBill?.electricRate || '12.50',
    electricCost: editingBill?.electricCost || '',
    waterPrevReading: editingBill?.waterPrevReading || '',
    waterCurrReading: editingBill?.waterCurrReading || '',
    waterUnits: editingBill?.waterUnits || '',
    waterRate: editingBill?.waterRate || '25.00',
    waterCost: editingBill?.waterCost || '',
    rent: editingBill?.rent || '',
    maintenanceFee: editingBill?.maintenanceFee || '500',
    otherCharges: editingBill?.otherCharges || '0',
    totalAmount: editingBill?.totalAmount || '',
    status: editingBill?.status || 'unpaid',
    paidDate: editingBill?.paidDate || '',
    attachments: editingBill?.attachments || []
  });

  // Mock room data - in real app, this would come from the Rooms database
  const availableRooms = [
    { id: '101', building: 'Building A', roomNumber: '101', tenant: 'Juan Dela Cruz', rent: '8500' },
    { id: '102', building: 'Building A', roomNumber: '102', tenant: 'Maria Santos', rent: '8500' },
    { id: '103', building: 'Building A', roomNumber: '103', tenant: 'Pedro Garcia', rent: '9000' },
    { id: '201', building: 'Building B', roomNumber: '201', tenant: 'Ana Lopez', rent: '10000' },
    { id: '202', building: 'Building B', roomNumber: '202', tenant: 'Carlos Reyes', rent: '10000' },
    { id: '301', building: 'Building C', roomNumber: '301', tenant: 'Elena Cruz', rent: '7500' }
  ];

  // Calculate electric units when readings change
  useEffect(() => {
    if (formData.electricPrevReading && formData.electricCurrReading) {
      const units = parseFloat(formData.electricCurrReading) - parseFloat(formData.electricPrevReading);
      if (units >= 0) {
        setFormData(prev => ({ ...prev, electricUnits: units.toString() }));
      }
    }
  }, [formData.electricPrevReading, formData.electricCurrReading]);

  // Calculate electric cost when units or rate change
  useEffect(() => {
    if (formData.electricUnits && formData.electricRate) {
      const cost = parseFloat(formData.electricUnits) * parseFloat(formData.electricRate);
      setFormData(prev => ({ ...prev, electricCost: cost.toFixed(2) }));
    }
  }, [formData.electricUnits, formData.electricRate]);

  // Calculate water units when readings change
  useEffect(() => {
    if (formData.waterPrevReading && formData.waterCurrReading) {
      const units = parseFloat(formData.waterCurrReading) - parseFloat(formData.waterPrevReading);
      if (units >= 0) {
        setFormData(prev => ({ ...prev, waterUnits: units.toString() }));
      }
    }
  }, [formData.waterPrevReading, formData.waterCurrReading]);

  // Calculate water cost when units or rate change
  useEffect(() => {
    if (formData.waterUnits && formData.waterRate) {
      const cost = parseFloat(formData.waterUnits) * parseFloat(formData.waterRate);
      setFormData(prev => ({ ...prev, waterCost: cost.toFixed(2) }));
    }
  }, [formData.waterUnits, formData.waterRate]);

  // Calculate total amount
  useEffect(() => {
    const electric = parseFloat(formData.electricCost) || 0;
    const water = parseFloat(formData.waterCost) || 0;
    const rent = parseFloat(formData.rent) || 0;
    const maintenance = parseFloat(formData.maintenanceFee) || 0;
    const other = parseFloat(formData.otherCharges) || 0;
    const total = electric + water + rent + maintenance + other;
    setFormData(prev => ({ ...prev, totalAmount: total.toFixed(2) }));
  }, [formData.electricCost, formData.waterCost, formData.rent, formData.maintenanceFee, formData.otherCharges]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Update existing bill
      setBills(bills.map(bill =>
        bill.id === editingBill.id ? { ...editingBill, ...formData } : bill
      ));
    } else {
      // Add new bill
      const newBill = {
        id: Date.now().toString(),
        ...formData
      };
      setBills([...bills, newBill]);
    }

    closeModal();
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type
    }));
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  const handleRemoveAttachment = (attachmentId) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }));
  };

  return (
    <>
      {/* Step Indicators */}
      <div className="px-4 sm:px-5 py-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-colors ${
                    currentStep >= step
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {step}
                </div>
                <p className="text-[10px] sm:text-xs mt-1 text-neutral-600 text-center">
                  {step === 1 && <span className="hidden sm:inline">Building & Room</span>}
                  {step === 1 && <span className="sm:hidden">Room</span>}
                  {step === 2 && <span className="hidden sm:inline">Utility Readings</span>}
                  {step === 2 && <span className="sm:hidden">Utilities</span>}
                  {step === 3 && <span className="hidden sm:inline">Other Charges</span>}
                  {step === 3 && <span className="sm:hidden">Charges</span>}
                  {step === 4 && <span className="hidden sm:inline">Attachments</span>}
                  {step === 4 && <span className="sm:hidden">Files</span>}
                </p>
              </div>
              {step < totalSteps && (
                <div
                  className={`flex-1 h-1 mx-1 sm:mx-2 rounded transition-colors ${
                    currentStep > step ? 'bg-primary-600' : 'bg-neutral-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-5">
        {/* Step 1: Building & Room Selection */}
        {currentStep === 1 && (
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2 sm:mb-3">
              Building & Room Selection
            </h4>

            {/* Building */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Building <span className="text-secondary-500">*</span>
              </label>
              <select
                required
                value={formData.building}
                onChange={(e) => {
                  setFormData({ ...formData, building: e.target.value, room: '', tenant: '', rent: '' });
                }}
                className="input-field"
              >
                <option value="Building A">Building A</option>
                <option value="Building B">Building B</option>
                <option value="Building C">Building C</option>
              </select>
            </div>

            {/* Room */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Room Number <span className="text-secondary-500">*</span>
              </label>
              <select
                required
                value={formData.room}
                onChange={(e) => {
                  const selectedRoom = availableRooms.find(r => r.id === e.target.value);
                  if (selectedRoom) {
                    setFormData({
                      ...formData,
                      room: selectedRoom.roomNumber,
                      tenant: selectedRoom.tenant,
                      rent: selectedRoom.rent
                    });
                  }
                }}
                className="input-field"
                disabled={!formData.building}
              >
                <option value="">
                  {!formData.building ? 'Select a building first' : 'Select a room'}
                </option>
                {availableRooms
                  .filter(room => room.building === formData.building)
                  .map(room => (
                    <option key={room.id} value={room.id}>
                      Room {room.roomNumber} - {room.tenant}
                    </option>
                  ))
                }
              </select>
            </div>

            {/* Tenant (Auto-filled) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Tenant <span className="text-secondary-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.tenant}
                readOnly
                className="input-field bg-neutral-50"
                placeholder="Select a room first"
              />
              <p className="text-xs text-neutral-500 mt-1">Auto-filled from selected room</p>
            </div>

            {/* Bill Month */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Bill Month <span className="text-secondary-500">*</span>
              </label>
              <input
                type="month"
                required
                value={formData.billMonth}
                onChange={(e) => setFormData({ ...formData, billMonth: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        )}

        {/* Step 2: Utility Readings */}
        {currentStep === 2 && (
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2 sm:mb-3">
              Utility Readings
            </h4>

            {/* Electric Meter Section */}
            <div className="bg-primary-50 p-3 sm:p-4 rounded-lg">
              <h5 className="text-sm font-semibold text-primary-900 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Electric Meter
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Previous Reading (kWh)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.electricPrevReading}
                    onChange={(e) => setFormData({ ...formData, electricPrevReading: e.target.value })}
                    className="input-field"
                    placeholder="1200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Current Reading (kWh) <span className="text-secondary-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.electricCurrReading}
                    onChange={(e) => setFormData({ ...formData, electricCurrReading: e.target.value })}
                    className="input-field"
                    placeholder="1350"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Units Consumed (kWh) <span className="text-secondary-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.electricUnits}
                    onChange={(e) => setFormData({ ...formData, electricUnits: e.target.value })}
                    className="input-field"
                    placeholder="150"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    {formData.electricPrevReading && formData.electricCurrReading
                      ? 'Auto-calculated from readings'
                      : 'Enter manually or provide readings above'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Rate per kWh (₱) <span className="text-secondary-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.electricRate}
                    onChange={(e) => setFormData({ ...formData, electricRate: e.target.value })}
                    className="input-field"
                    placeholder="12.50"
                  />
                </div>
              </div>

              <div className="mt-3 p-3 bg-white rounded-lg border border-primary-200">
                <p className="text-sm font-semibold text-neutral-700">
                  Electric Cost: <span className="text-primary-700">₱{parseFloat(formData.electricCost || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </p>
              </div>
            </div>

            {/* Water Meter Section */}
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
              <h5 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Water Meter
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Previous Reading (m³)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.waterPrevReading}
                    onChange={(e) => setFormData({ ...formData, waterPrevReading: e.target.value })}
                    className="input-field"
                    placeholder="450"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Current Reading (m³) <span className="text-secondary-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.waterCurrReading}
                    onChange={(e) => setFormData({ ...formData, waterCurrReading: e.target.value })}
                    className="input-field"
                    placeholder="480"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Units Consumed (m³) <span className="text-secondary-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.waterUnits}
                    onChange={(e) => setFormData({ ...formData, waterUnits: e.target.value })}
                    className="input-field"
                    placeholder="30"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    {formData.waterPrevReading && formData.waterCurrReading
                      ? 'Auto-calculated from readings'
                      : 'Enter manually or provide readings above'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Rate per m³ (₱) <span className="text-secondary-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.waterRate}
                    onChange={(e) => setFormData({ ...formData, waterRate: e.target.value })}
                    className="input-field"
                    placeholder="25.00"
                  />
                </div>
              </div>

              <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-neutral-700">
                  Water Cost: <span className="text-blue-700">₱{parseFloat(formData.waterCost || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Other Charges */}
        {currentStep === 3 && (
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2 sm:mb-3">
              Other Charges
            </h4>

            {/* Monthly Rent */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Monthly Rent (₱) <span className="text-secondary-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.rent}
                readOnly
                className="input-field bg-neutral-50"
                placeholder="8500"
              />
              <p className="text-xs text-neutral-500 mt-1">Auto-filled from selected room</p>
            </div>

            {/* Maintenance Fee */}
            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1.5">
                Maintenance Fee (₱)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.maintenanceFee}
                onChange={(e) => setFormData({ ...formData, maintenanceFee: e.target.value })}
                className="input-field"
                placeholder="500"
              />
            </div>

            {/* Other Charges */}
            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1.5">
                Other Charges (₱)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.otherCharges}
                onChange={(e) => setFormData({ ...formData, otherCharges: e.target.value })}
                className="input-field"
                placeholder="0"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Additional charges (e.g., parking, late fees, etc.)
              </p>
            </div>

            {/* Total Summary */}
            <div className="bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200 p-4 rounded-lg mt-4">
              <h5 className="text-sm font-semibold text-neutral-700 mb-3">Bill Summary</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Electric:</span>
                  <span className="font-medium">₱{parseFloat(formData.electricCost || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Water:</span>
                  <span className="font-medium">₱{parseFloat(formData.waterCost || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Rent:</span>
                  <span className="font-medium">₱{parseFloat(formData.rent || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Maintenance:</span>
                  <span className="font-medium">₱{parseFloat(formData.maintenanceFee || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Other:</span>
                  <span className="font-medium">₱{parseFloat(formData.otherCharges || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t border-primary-300 pt-2 mt-2"></div>
                <div className="flex justify-between text-base">
                  <span className="font-bold text-neutral-900">Total Amount:</span>
                  <span className="font-bold text-primary-700">₱{parseFloat(formData.totalAmount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Attachments */}
        {currentStep === 4 && (
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-neutral-500 mb-1.5 sm:mb-2">
              Bill Attachments (Optional)
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 mb-2 sm:mb-3">
              Upload photos or PDFs of utility bills, receipts, or related documents.
            </p>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-2">
                Upload Files
              </label>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm text-neutral-600">
                    <span className="font-medium text-primary-600 hover:text-primary-700">Click to upload</span>
                    {' '}or drag and drop
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    PNG, JPG, PDF up to 10MB each
                  </p>
                </label>
              </div>
            </div>

            {/* Uploaded Files Preview */}
            {formData.attachments.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Uploaded Files ({formData.attachments.length})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {formData.attachments.map((attachment) => (
                    <div key={attachment.id} className="relative group">
                      <div className="border border-neutral-200 rounded-lg p-2 hover:border-primary-500 transition-colors">
                        {attachment.type.startsWith('image/') ? (
                          <img
                            src={attachment.url}
                            alt={attachment.name}
                            className="w-full h-24 object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-24 bg-neutral-100 rounded flex items-center justify-center">
                            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <p className="text-xs text-neutral-600 mt-1 truncate">{attachment.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(attachment.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-secondary-500 text-white rounded-full hover:bg-secondary-600 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

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
              (currentStep === 1 && (!formData.building || !formData.room || !formData.tenant || !formData.billMonth)) ||
              (currentStep === 2 && (!formData.electricCurrReading || !formData.electricUnits || !formData.electricRate || !formData.waterCurrReading || !formData.waterUnits || !formData.waterRate))
            }
          >
            <span className="hidden sm:inline">Next Step</span>
            <span className="sm:hidden">Next</span>
          </button>
        ) : (
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn-primary text-sm sm:text-base"
          >
            <span className="hidden sm:inline">{isEditing ? 'Update Bill' : 'Create Bill'}</span>
            <span className="sm:hidden">{isEditing ? 'Update' : 'Create'}</span>
          </button>
        )}
      </div>
    </>
  );
};

export default BillingWizard;
