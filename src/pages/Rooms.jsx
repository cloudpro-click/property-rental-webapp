import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import RoomWizard from '../components/RoomWizard';
import ConfirmDialog from '../components/ConfirmDialog';

const Rooms = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [currentStep, setCurrentStep] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRemoveTenantConfirm, setShowRemoveTenantConfirm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddModal]);

  const [rooms, setRooms] = useState([
    { id: 1, building: 'Building A', roomNumber: '101', floor: '1', rent: '₱8,500', status: 'occupied', tenant: 'Maria Santos', tenantEmail: 'maria.santos@email.com', tenantPhone: '+63 917 123 4567', moveInDate: '2024-01-15', electricMeter: 'EM-001-2024', capacity: '2', size: '25', amenities: 'Air Conditioning, Wi-Fi', description: 'Cozy room with good ventilation' },
    { id: 2, building: 'Building A', roomNumber: '102', floor: '1', rent: '₱8,500', status: 'vacant', tenant: null, tenantEmail: null, tenantPhone: null, moveInDate: null, electricMeter: 'EM-002-2024', capacity: '2', size: '25', amenities: 'Air Conditioning, Wi-Fi', description: '' },
    { id: 3, building: 'Building A', roomNumber: '201', floor: '2', rent: '₱9,000', status: 'occupied', tenant: 'Ana Cruz', tenantEmail: 'ana.cruz@email.com', tenantPhone: '+63 918 234 5678', moveInDate: '2024-02-01', electricMeter: 'EM-003-2024', capacity: '3', size: '30', amenities: 'Air Conditioning, Wi-Fi, Balcony', description: 'Spacious room with balcony' },
    { id: 4, building: 'Building B', roomNumber: '101', floor: '1', rent: '₱7,500', status: 'occupied', tenant: 'Jose Reyes', tenantEmail: 'jose.reyes@email.com', tenantPhone: '+63 919 345 6789', moveInDate: '2023-12-10', electricMeter: 'EM-004-2024', capacity: '2', size: '22', amenities: 'Wi-Fi', description: '' },
    { id: 5, building: 'Building B', roomNumber: '205', floor: '2', rent: '₱7,200', status: 'occupied', tenant: 'Linda Fernandez', tenantEmail: 'linda.fernandez@email.com', tenantPhone: '+63 920 456 7890', moveInDate: '2024-03-05', electricMeter: 'EM-005-2024', capacity: '1', size: '18', amenities: 'Wi-Fi, Kitchen', description: 'Studio type' },
    { id: 6, building: 'Building C', roomNumber: '102', floor: '1', rent: '₱6,800', status: 'vacant', tenant: null, tenantEmail: null, tenantPhone: null, moveInDate: null, electricMeter: 'EM-006-2024', capacity: '2', size: '20', amenities: 'Wi-Fi', description: '' },
  ]);

  const [formData, setFormData] = useState({
    building: 'Building A',
    roomNumber: '',
    floor: '',
    rent: '',
    electricMeter: '',
    capacity: '',
    size: '',
    description: '',
    amenities: ''
  });

  const buildings = ['Building A', 'Building B', 'Building C'];

  const filteredRooms = selectedBuilding === 'all'
    ? rooms
    : rooms.filter(room => room.building === selectedBuilding);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingRoom) {
      // Update existing room
      const updatedRoom = {
        ...editingRoom,
        ...formData,
        rent: `₱${formData.rent}`
      };
      setRooms(rooms.map(r => r.id === editingRoom.id ? updatedRoom : r));
    } else {
      // Add new room
      const newRoom = {
        id: rooms.length + 1,
        ...formData,
        rent: `₱${formData.rent}`,
        status: 'vacant',
        tenant: null
      };
      setRooms([...rooms, newRoom]);
    }

    setFormData({
      building: 'Building A',
      roomNumber: '',
      floor: '',
      rent: '',
      electricMeter: '',
      capacity: '',
      size: '',
      description: '',
      amenities: ''
    });
    setCurrentStep(1);
    setShowAddModal(false);
    setEditingRoom(null);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setCurrentStep(1);
    setEditingRoom(null);
    setFormData({
      building: 'Building A',
      roomNumber: '',
      floor: '',
      rent: '',
      electricMeter: '',
      capacity: '',
      size: '',
      description: '',
      amenities: ''
    });
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setFormData({
      building: room.building || 'Building A',
      roomNumber: room.roomNumber || '',
      floor: room.floor || '',
      rent: room.rent ? room.rent.replace('₱', '').replace(',', '') : '',
      electricMeter: room.electricMeter || '',
      capacity: room.capacity || '',
      size: room.size || '',
      description: room.description || '',
      amenities: room.amenities || ''
    });
    setShowAddModal(true);
  };

  const handleDeleteRoom = (room) => {
    setRoomToDelete(room);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (roomToDelete) {
      setRooms(rooms.filter(r => r.id !== roomToDelete.id));
      setRoomToDelete(null);
    }
  };

  const handleViewTenant = (room) => {
    setSelectedRoom(room);
    setShowTenantModal(true);
  };

  const handleRemoveTenant = (room) => {
    setSelectedRoom(room);
    setShowRemoveTenantConfirm(true);
  };

  const confirmRemoveTenant = () => {
    if (selectedRoom) {
      const updatedRooms = rooms.map(r =>
        r.id === selectedRoom.id
          ? { ...r, status: 'vacant', tenant: null, tenantEmail: null, tenantPhone: null, moveInDate: null }
          : r
      );
      setRooms(updatedRooms);
      setSelectedRoom(null);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-neutral-900">Rooms & Units</h2>
          <p className="text-neutral-600">Manage rooms and electric meters</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Room
        </button>
      </div>

      {/* Filter */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedBuilding('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedBuilding === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            All Buildings
          </button>
          {buildings.map((building) => (
            <button
              key={building}
              onClick={() => setSelectedBuilding(building)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedBuilding === building
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {building}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Building
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Room #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Floor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Electric Meter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Rent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">{room.building}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-primary-600">{room.roomNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">{room.floor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-neutral-700">
                      <svg className="w-4 h-4 mr-1 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {room.electricMeter}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-neutral-900">
                      <svg className="w-4 h-4 mr-1 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {room.capacity} {room.capacity === '1' ? 'person' : 'persons'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-neutral-900">{room.rent}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {room.tenant ? (
                      <button
                        onClick={() => handleViewTenant(room)}
                        className="text-sm text-primary-600 hover:text-primary-900 font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {room.tenant}
                      </button>
                    ) : (
                      <span className="text-sm text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      room.status === 'occupied'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {room.status === 'occupied' ? 'Occupied' : 'Vacant'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === room.id ? null : room.id)}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === room.id && (
                        <>
                          {/* Backdrop to close menu */}
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          ></div>

                          {/* Menu */}
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20">
                            <button
                              onClick={() => {
                                handleEditRoom(room);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center"
                            >
                              <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit Room
                            </button>

                            {room.status === 'occupied' ? (
                              <>
                                <button
                                  onClick={() => {
                                    handleViewTenant(room);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  View Tenant
                                </button>

                                <button
                                  onClick={() => {
                                    handleRemoveTenant(room);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-accent-700 hover:bg-accent-50 flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-2 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                                  </svg>
                                  Remove Tenant
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  // Navigate to Tenants page or open add tenant modal
                                  setOpenMenuId(null);
                                  // TODO: Implement add tenant functionality
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Add Tenant
                              </button>
                            )}

                            <div className="border-t border-neutral-200 my-1"></div>

                            <button
                              onClick={() => {
                                handleDeleteRoom(room);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-secondary-700 hover:bg-secondary-50 flex items-center"
                            >
                              <svg className="w-4 h-4 mr-2 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete Room
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Room Wizard Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-50 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="min-h-screen px-2 sm:px-4 flex items-center justify-center py-4 sm:py-8">
            <div
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-900">
                    {editingRoom ? 'Edit Room' : 'Add New Room'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-neutral-400 hover:text-neutral-600 p-1"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((step) => (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all ${
                          step < currentStep
                            ? 'bg-green-500 text-white'
                            : step === currentStep
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-200 text-neutral-500'
                        }`}>
                          {step < currentStep ? (
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            step
                          )}
                        </div>
                        <span className="text-[10px] sm:text-xs mt-1 sm:mt-1.5 text-neutral-600 text-center">
                          {step === 1 ? 'Basic' : step === 2 ? 'Rent' : 'Details'}
                        </span>
                      </div>
                      {step < 3 && (
                        <div className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 rounded ${
                          step < currentStep ? 'bg-green-500' : 'bg-neutral-200'
                        }`}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Wizard Content */}
              <form onSubmit={handleSubmit}>
                <div className="p-4 sm:p-5 min-h-[320px] sm:min-h-[380px]">
                  <RoomWizard
                    currentStep={currentStep}
                    formData={formData}
                    setFormData={setFormData}
                    buildings={buildings}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    handleSubmit={handleSubmit}
                    closeModal={closeModal}
                    isEditing={!!editingRoom}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Details Modal */}
      {showTenantModal && selectedRoom && (
        <div
          className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowTenantModal(false)}
        >
          <div
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-neutral-900">Tenant Details</h3>
                    <p className="text-sm text-neutral-600">
                      {selectedRoom.building} - Room {selectedRoom.roomNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTenantModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 p-1"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* Tenant Name */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Full Name</label>
                <p className="text-base font-semibold text-neutral-900">{selectedRoom.tenant}</p>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Email Address</label>
                  <div className="flex items-center text-sm text-neutral-900">
                    <svg className="w-4 h-4 mr-2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {selectedRoom.tenantEmail || '-'}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Phone Number</label>
                  <div className="flex items-center text-sm text-neutral-900">
                    <svg className="w-4 h-4 mr-2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {selectedRoom.tenantPhone || '-'}
                  </div>
                </div>
              </div>

              {/* Move-in Date */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Move-in Date</label>
                <div className="flex items-center text-sm text-neutral-900">
                  <svg className="w-4 h-4 mr-2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {selectedRoom.moveInDate || '-'}
                </div>
              </div>

              {/* Monthly Rent */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                <label className="block text-xs font-medium text-primary-700 mb-1">Monthly Rent</label>
                <p className="text-lg font-bold text-primary-900">{selectedRoom.rent}</p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-neutral-50 px-5 py-4 sm:px-6 flex justify-between gap-3 rounded-b-xl sm:rounded-b-2xl">
              <button
                onClick={() => handleRemoveTenant(selectedRoom)}
                className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 font-medium transition-colors text-sm"
              >
                Remove Tenant
              </button>
              <button
                onClick={() => setShowTenantModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Tenant Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showRemoveTenantConfirm}
        onClose={() => {
          setShowRemoveTenantConfirm(false);
          setShowTenantModal(false);
        }}
        onConfirm={confirmRemoveTenant}
        title="Remove Tenant"
        message={`Are you sure you want to remove ${selectedRoom?.tenant} from Room ${selectedRoom?.roomNumber}? This will mark the room as vacant.`}
        confirmText="Remove Tenant"
        cancelText="Cancel"
        type="warning"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Room"
        message={`Are you sure you want to delete Room ${roomToDelete?.roomNumber} in ${roomToDelete?.building}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </DashboardLayout>
  );
};

export default Rooms;
