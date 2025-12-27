import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Rooms = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState('all');

  const [rooms, setRooms] = useState([
    { id: 1, building: 'Building A', roomNumber: '101', floor: '1', rent: '₱8,500', status: 'occupied', tenant: 'Maria Santos', electricMeter: 'EM-001-2024' },
    { id: 2, building: 'Building A', roomNumber: '102', floor: '1', rent: '₱8,500', status: 'vacant', tenant: null, electricMeter: 'EM-002-2024' },
    { id: 3, building: 'Building A', roomNumber: '201', floor: '2', rent: '₱9,000', status: 'occupied', tenant: 'Ana Cruz', electricMeter: 'EM-003-2024' },
    { id: 4, building: 'Building B', roomNumber: '101', floor: '1', rent: '₱7,500', status: 'occupied', tenant: 'Jose Reyes', electricMeter: 'EM-004-2024' },
    { id: 5, building: 'Building B', roomNumber: '205', floor: '2', rent: '₱7,200', status: 'occupied', tenant: 'Linda Fernandez', electricMeter: 'EM-005-2024' },
    { id: 6, building: 'Building C', roomNumber: '102', floor: '1', rent: '₱6,800', status: 'vacant', tenant: null, electricMeter: 'EM-006-2024' },
  ]);

  const [formData, setFormData] = useState({
    building: 'Building A',
    roomNumber: '',
    floor: '',
    rent: '',
    electricMeter: ''
  });

  const buildings = ['Building A', 'Building B', 'Building C'];

  const filteredRooms = selectedBuilding === 'all'
    ? rooms
    : rooms.filter(room => room.building === selectedBuilding);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRoom = {
      id: rooms.length + 1,
      ...formData,
      rent: `₱${formData.rent}`,
      status: 'vacant',
      tenant: null
    };
    setRooms([...rooms, newRoom]);
    setFormData({ building: 'Building A', roomNumber: '', floor: '', rent: '', electricMeter: '' });
    setShowAddModal(false);
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
                    <button className="text-primary-600 hover:text-primary-900 mr-3">Edit</button>
                    <button className="text-secondary-600 hover:text-secondary-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold text-neutral-900">Add New Room</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Building
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

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Room Number
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

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Floor
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

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Electric Meter Number
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

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Monthly Rent (₱)
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

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Rooms;
