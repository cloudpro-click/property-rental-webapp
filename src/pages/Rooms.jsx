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
    { id: 1, building: 'Building A', roomNumber: '101', floor: '1', rent: '₱8,500', status: 'occupied', tenant: 'Maria Santos', electricMeter: 'EM-001-2024', capacity: '2', size: '25', amenities: 'Air Conditioning, Wi-Fi', description: 'Cozy room with good ventilation' },
    { id: 2, building: 'Building A', roomNumber: '102', floor: '1', rent: '₱8,500', status: 'vacant', tenant: null, electricMeter: 'EM-002-2024', capacity: '2', size: '25', amenities: 'Air Conditioning, Wi-Fi', description: '' },
    { id: 3, building: 'Building A', roomNumber: '201', floor: '2', rent: '₱9,000', status: 'occupied', tenant: 'Ana Cruz', electricMeter: 'EM-003-2024', capacity: '3', size: '30', amenities: 'Air Conditioning, Wi-Fi, Balcony', description: 'Spacious room with balcony' },
    { id: 4, building: 'Building B', roomNumber: '101', floor: '1', rent: '₱7,500', status: 'occupied', tenant: 'Jose Reyes', electricMeter: 'EM-004-2024', capacity: '2', size: '22', amenities: 'Wi-Fi', description: '' },
    { id: 5, building: 'Building B', roomNumber: '205', floor: '2', rent: '₱7,200', status: 'occupied', tenant: 'Linda Fernandez', electricMeter: 'EM-005-2024', capacity: '1', size: '18', amenities: 'Wi-Fi, Kitchen', description: 'Studio type' },
    { id: 6, building: 'Building C', roomNumber: '102', floor: '1', rent: '₱6,800', status: 'vacant', tenant: null, electricMeter: 'EM-006-2024', capacity: '2', size: '20', amenities: 'Wi-Fi', description: '' },
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
                    <div className="text-sm text-neutral-900">{room.tenant || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      room.status === 'occupied'
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEditRoom(room)}
                      className="text-primary-600 hover:text-primary-900 mr-3 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room)}
                      className="text-secondary-600 hover:text-secondary-900 font-medium"
                    >
                      Delete
                    </button>
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
