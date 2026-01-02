import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import RoomWizard from '../components/RoomWizard';
import ConfirmDialog from '../components/ConfirmDialog';
import TenantTypeBadge from '../components/TenantTypeBadge';
import OccupancyIndicator from '../components/OccupancyIndicator';
import PromoteTenantModal from '../components/PromoteTenantModal';
import { GET_ALL_AMENITIES, GET_ALL_PROPERTIES, GET_ROOMS_BY_BUILDING, CREATE_ROOM, UPDATE_ROOM, DELETE_ROOM } from '../lib/graphql-queries';

const Rooms = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(''); // Empty string means no building selected yet
  const [showDeleted, setShowDeleted] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRemoveTenantConfirm, setShowRemoveTenantConfirm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [buildingSearch, setBuildingSearch] = useState('');
  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [tenantToPromote, setTenantToPromote] = useState(null);
  const [showAllTenantsModal, setShowAllTenantsModal] = useState(false);
  const [roomForTenants, setRoomForTenants] = useState(null);

  // GraphQL Query - Fetch all amenities (lookup data - can be cached)
  const { data: amenitiesData, loading: amenitiesLoading } = useQuery(GET_ALL_AMENITIES, {
    fetchPolicy: 'cache-first', // Lookup data can be cached
    onError: (error) => {
      console.error('Error fetching amenities:', error);
    }
  });

  // GraphQL Query - Fetch all buildings/properties (transactional - real-time)
  const { data: buildingsData, loading: buildingsLoading } = useQuery(GET_ALL_PROPERTIES, {
    fetchPolicy: 'network-only', // Transactional data must be real-time
    nextFetchPolicy: 'network-only',
    onError: (error) => {
      console.error('Error fetching buildings:', error);
    }
  });

  // GraphQL Query - Fetch rooms by building (only query we use)
  // We removed "All Buildings" option to avoid expensive Scan operations
  const [getRoomsByBuilding, { data: roomsData, loading: roomsLoading, refetch: refetchRooms }] = useLazyQuery(GET_ROOMS_BY_BUILDING, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    onError: (error) => {
      console.error('Error fetching rooms by building:', error);
    }
  });

  // Get amenities from GraphQL response
  const amenities = amenitiesData?.getAllAmenities?.amenities || [];

  // Get buildings from GraphQL response
  const buildings = buildingsData?.getAllProperties?.properties || [];

  // Filter buildings based on search
  const filteredBuildings = React.useMemo(() => {
    if (!buildingSearch.trim()) return buildings;
    const searchLower = buildingSearch.toLowerCase();
    return buildings.filter(building =>
      building.name.toLowerCase().includes(searchLower)
    );
  }, [buildings, buildingSearch]);

  // Get rooms from GraphQL response (only from getRoomsByBuilding)
  const apiRooms = roomsData?.getRoomsByBuilding?.rooms || [];

  // Auto-select first building when buildings are loaded
  useEffect(() => {
    if (buildings.length > 0 && !selectedBuilding) {
      setSelectedBuilding(buildings[0].building_id);
    }
  }, [buildings, selectedBuilding]);

  // Trigger getRoomsByBuilding when a building is selected
  useEffect(() => {
    if (selectedBuilding) {
      getRoomsByBuilding({
        variables: {
          building_id: selectedBuilding
        }
      });
    }
  }, [selectedBuilding, getRoomsByBuilding]);

  // GraphQL Mutations for rooms
  const [createRoom, { loading: createLoading }] = useMutation(CREATE_ROOM, {
    onCompleted: (data) => {
      if (data.createRoom.success) {
        toast.success('Room created successfully!');
        refetchRooms();
        closeModal();
      } else {
        toast.error(data.createRoom.message || 'Failed to create room');
      }
    },
    onError: (error) => {
      console.error('Create room error:', error);
      toast.error(error.message || 'Failed to create room');
    }
  });

  const [updateRoom, { loading: updateLoading }] = useMutation(UPDATE_ROOM, {
    onCompleted: (data) => {
      if (data.updateRoom.success) {
        toast.success('Room updated successfully!');
        refetchRooms();
        closeModal();
      } else {
        toast.error(data.updateRoom.message || 'Failed to update room');
      }
    },
    onError: (error) => {
      console.error('Update room error:', error);
      toast.error(error.message || 'Failed to update room');
    }
  });

  const [deleteRoom, { loading: deleteLoading }] = useMutation(DELETE_ROOM, {
    onCompleted: (data) => {
      if (data.deleteRoom.success) {
        toast.success('Room deleted successfully!');
        refetchRooms();
        setShowDeleteConfirm(false);
        setRoomToDelete(null);
      } else {
        toast.error(data.deleteRoom.message || 'Failed to delete room');
      }
    },
    onError: (error) => {
      console.error('Delete room error:', error);
      toast.error(error.message || 'Failed to delete room');
    }
  });

  // Transform API rooms to match local structure
  const allRooms = apiRooms.map((room, index) => {
    // MOCK DATA: Add multi-tenant data to demonstrate UI
    // This will be replaced with real API data later
    const capacity = parseInt(room.capacity) || 1;
    let mockTenants = [];
    let mockCurrentOccupancy = 0;

    // Add mock tenants to some occupied rooms for demonstration
    if (room.status === 'occupied' && room.tenant) {
      // Room 0: Primary tenant only (1/2 capacity)
      // Room 1: Primary + 1 roommate (2/2 capacity)
      // Room 2: Primary + 2 roommates (3/3 capacity)
      const shouldHaveRoommates = index % 3 === 1 || index % 3 === 2;
      const roommateCount = index % 3 === 1 ? 1 : (index % 3 === 2 ? 2 : 0);

      // Primary tenant (from existing API data)
      mockTenants.push({
        tenant_id: `tenant_${room.room_id}_primary`,
        name: room.tenant.name,
        email: room.tenant.email || `${room.tenant.name.toLowerCase().replace(' ', '.')}@email.com`,
        phone: room.tenant.phone || '+639171234567',
        isPrimary: true,
        role: 'primary',
        moveInDate: room.tenant.moveInDate || new Date().toISOString(),
        status: 'active'
      });

      // Add roommates for demonstration
      if (shouldHaveRoommates) {
        for (let i = 0; i < roommateCount; i++) {
          mockTenants.push({
            tenant_id: `tenant_${room.room_id}_roommate_${i + 1}`,
            name: `Roommate ${i + 1}`,
            email: `roommate${i + 1}.${room.roomNumber}@email.com`,
            phone: `+63917${Math.floor(1000000 + Math.random() * 9000000)}`,
            isPrimary: false,
            role: 'secondary',
            moveInDate: new Date(Date.now() - (30 - i * 10) * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active'
          });
        }
      }

      mockCurrentOccupancy = mockTenants.length;
    }

    return {
      id: room.room_id,
      room_id: room.room_id,
      building: room.building?.name || '',
      buildingId: room.building_id,
      roomNumber: room.roomNumber,
      floor: room.floor?.toString() || '',
      rent: room.rent ? `₱${room.rent.toLocaleString()}` : '₱0',
      rentAmount: room.rent || 0,
      status: room.status || 'vacant',

      // Legacy single tenant fields (for backward compatibility)
      tenant: room.tenant?.name || null,
      tenantEmail: room.tenant?.email || null,
      tenantPhone: room.tenant?.phone || null,
      moveInDate: room.tenant?.moveInDate || null,

      // NEW: Multi-tenant fields (MOCK DATA - will come from API later)
      tenants: mockTenants,
      primaryTenant: mockTenants.find(t => t.isPrimary) || null,
      currentOccupancy: mockCurrentOccupancy,

      electricMeter: room.electricMeter || '',
      capacity: room.capacity?.toString() || '1',
      capacityNum: parseInt(room.capacity) || 1,
      size: room.size?.toString() || '',
      amenities: room.amenities || '',
      description: room.description || '',
      hasSeparateMeter: room.hasSeparateMeter,
      deleted: room.deleted || false,
      deletedBy: room.audit?.deleted_by || null,
      deletedDate: room.audit?.deleted_date || null
    };
  });

  // Calculate room count for the currently selected building only
  const currentBuildingRoomCount = React.useMemo(() => {
    return allRooms.filter(room => !room.deleted).length;
  }, [allRooms]);

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

  const [formData, setFormData] = useState({
    building: '',
    buildingId: '',
    roomNumber: '',
    floor: '',
    rent: '',
    hasSeparateMeter: undefined,
    electricMeter: '',
    capacity: '',
    size: '',
    description: '',
    amenities: ''
  });

  // Filter rooms by deleted status only (building filter is now handled by the query)
  let filteredRooms = allRooms;

  // Filter out deleted rooms if showDeleted is false
  if (!showDeleted) {
    filteredRooms = filteredRooms.filter(room => !room.deleted);
  }

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare input for GraphQL mutation
    const roomInput = {
      building_id: formData.buildingId,
      roomNumber: formData.roomNumber,
      floor: parseInt(formData.floor),
      hasSeparateMeter: formData.hasSeparateMeter,
      electricMeter: formData.hasSeparateMeter ? formData.electricMeter : null,
      rent: parseFloat(formData.rent),
      capacity: parseInt(formData.capacity),
      size: formData.size ? parseFloat(formData.size) : null,
      description: formData.description || null,
      amenities: formData.amenities || null
    };

    try {
      if (editingRoom) {
        // Update existing room
        await updateRoom({
          variables: {
            room_id: editingRoom.room_id,
            input: roomInput
          }
        });
      } else {
        // Create new room
        await createRoom({
          variables: {
            input: roomInput
          }
        });
      }
    } catch (error) {
      // Error handling is done in mutation onError callback
      console.error('Submit error:', error);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setCurrentStep(1);
    setEditingRoom(null);
    setFormData({
      building: '',
      buildingId: '',
      roomNumber: '',
      floor: '',
      rent: '',
      hasSeparateMeter: undefined,
      electricMeter: '',
      capacity: '',
      size: '',
      description: '',
      amenities: ''
    });
  };

  // Fill form with demo data
  const fillDemoData = () => {
    // Use first building from API if available
    const firstBuilding = buildings.length > 0 ? buildings[0] : null;
    setFormData({
      building: firstBuilding?.name || '',
      buildingId: firstBuilding?.building_id || '',
      roomNumber: '301',
      floor: '3',
      rent: '9500',
      hasSeparateMeter: true,
      electricMeter: 'EM-301-2024',
      capacity: '2',
      size: '28',
      description: 'Corner unit with excellent natural lighting and ventilation. Newly renovated with modern fixtures.',
      amenities: 'AC, WIFI, BATH_PRIVATE, WATER_HEATER'
    });
  };

  const handleEditRoom = (room) => {
    console.log('Editing room:', room);
    setEditingRoom(room);
    setFormData({
      building: room.building || '',
      buildingId: room.buildingId || '',
      roomNumber: room.roomNumber || '',
      floor: room.floor?.toString() || '',
      rent: room.rent ? room.rent.replace('₱', '').replace(/,/g, '') : '',
      hasSeparateMeter: room.hasSeparateMeter !== undefined ? room.hasSeparateMeter : (room.electricMeter ? true : false),
      electricMeter: room.electricMeter || '',
      capacity: room.capacity?.toString() || '',
      size: room.size?.toString() || '',
      description: room.description || '',
      amenities: room.amenities || ''
    });
    setShowAddModal(true);
  };

  const handleDeleteRoom = (room) => {
    setRoomToDelete(room);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (roomToDelete) {
      try {
        await deleteRoom({
          variables: {
            room_id: roomToDelete.room_id
          }
        });
      } catch (error) {
        // Error handling is done in mutation onError callback
        console.error('Delete error:', error);
      }
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

  // NEW: Multi-tenant handlers
  const handlePromoteTenant = (tenant, room) => {
    setTenantToPromote({ tenant, room });
    setShowPromoteModal(true);
  };

  const confirmPromoteTenant = async () => {
    // TODO: Call GraphQL mutation when API is ready
    toast.success(`${tenantToPromote.tenant.name} promoted to primary tenant!`);
    setShowPromoteModal(false);
    setTenantToPromote(null);
    // For now, just show success - actual promotion will be implemented with API
  };

  const handleShowAllTenants = (room) => {
    setRoomForTenants(room);
    setShowAllTenantsModal(true);
  };

  const handleAddRoommate = (room) => {
    toast.info(`"Add Roommate" feature will open TenantWizard with tenantType='roommate' and pre-selected room`);
    // TODO: Open TenantWizard with tenantType='roommate' prop when API is ready
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
          <p className="text-neutral-600">
            {selectedBuilding ? (
              <>
                {buildings.find(b => b.building_id === selectedBuilding)?.name || 'Building'}
                <span className="mx-2">•</span>
                {currentBuildingRoomCount} {currentBuildingRoomCount === 1 ? 'room' : 'rooms'}
              </>
            ) : (
              'Select a building to view rooms'
            )}
          </p>
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

      {/* Filter & Stats */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Building Filter Dropdown */}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2 text-neutral-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="text-sm font-medium hidden sm:inline">Filter:</span>
            </div>

            <div className="relative flex-1 max-w-xs">
              {/* Searchable Input */}
              <input
                type="text"
                value={buildingSearch}
                onChange={(e) => setBuildingSearch(e.target.value)}
                onFocus={() => setShowBuildingDropdown(true)}
                placeholder={selectedBuilding ? buildings.find(b => b.building_id === selectedBuilding)?.name : "Search buildings..."}
                className="w-full bg-white border border-neutral-300 rounded-lg pl-10 pr-10 py-2.5 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-neutral-400 transition-colors"
              />
              {/* Building Icon */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              {/* Search Icon or Clear Button */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {buildingSearch ? (
                  <button
                    onClick={() => {
                      setBuildingSearch('');
                      setShowBuildingDropdown(true);
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
              {showBuildingDropdown && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowBuildingDropdown(false)}
                  ></div>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 max-h-60 overflow-y-auto z-20">
                    {buildingsLoading ? (
                      <div className="px-4 py-3 text-sm text-neutral-600">Loading buildings...</div>
                    ) : filteredBuildings.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-neutral-600">No buildings found</div>
                    ) : (
                      filteredBuildings.map((building) => (
                        <button
                          key={building.building_id}
                          onClick={() => {
                            setSelectedBuilding(building.building_id);
                            setBuildingSearch('');
                            setShowBuildingDropdown(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-neutral-50 transition-colors ${
                            selectedBuilding === building.building_id
                              ? 'bg-primary-50 text-primary-900 font-medium'
                              : 'text-neutral-900'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{building.name}</span>
                            {selectedBuilding === building.building_id && (
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

          {/* Quick Stats & Show Deleted Toggle */}
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{allRooms.filter(r => !r.deleted && r.status === 'occupied').length} Occupied</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              <span className="font-medium">{allRooms.filter(r => !r.deleted && r.status === 'vacant').length} Vacant</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="font-medium">{allRooms.filter(r => r.deleted).length} Deleted</span>
            </div>

            {/* Show Deleted Toggle */}
            <div className="flex items-center gap-2 ml-auto">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDeleted}
                  onChange={(e) => setShowDeleted(e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-white border-neutral-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span className="text-sm text-neutral-700 font-medium">Show deleted rooms</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="card overflow-hidden">
        {!selectedBuilding ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <svg className="w-16 h-16 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div>
                <p className="text-lg font-medium text-neutral-900 mb-1">No Building Selected</p>
                <p className="text-sm text-neutral-600">Please select a building from the dropdown above to view its rooms</p>
              </div>
            </div>
          </div>
        ) : roomsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm text-neutral-600">Loading rooms...</p>
            </div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <svg className="w-16 h-16 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div>
                <p className="text-lg font-medium text-neutral-900 mb-1">No Rooms Found</p>
                <p className="text-sm text-neutral-600 mb-3">
                  {showDeleted
                    ? `This building doesn't have any rooms yet.`
                    : `This building doesn't have any active rooms. Toggle "Show deleted rooms" to see all.`
                  }
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors text-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add First Room
                </button>
              </div>
            </div>
          </div>
        ) : (
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
                    Occupancy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Rent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Tenant(s)
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
                <tr key={room.id} className={`transition-colors ${room.deleted ? 'bg-red-50 border-l-4 border-red-500' : 'hover:bg-neutral-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${room.deleted ? 'text-neutral-500' : 'text-neutral-900'}`}>
                      {room.building}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${room.deleted ? 'text-neutral-500' : 'text-primary-600'}`}>
                        {room.roomNumber}
                      </span>
                      {room.deleted && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
                          DELETED
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${room.deleted ? 'text-neutral-400' : 'text-neutral-900'}`}>{room.floor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm ${room.deleted ? 'text-neutral-400' : 'text-neutral-700'}`}>
                      <svg className={`w-4 h-4 mr-1 ${room.deleted ? 'text-neutral-400' : 'text-accent-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {room.electricMeter}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm ${room.deleted ? 'text-neutral-400' : 'text-neutral-900'}`}>
                      <svg className={`w-4 h-4 mr-1 ${room.deleted ? 'text-neutral-400' : 'text-neutral-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {room.capacity} {room.capacity === '1' ? 'person' : 'persons'}
                    </div>
                  </td>
                  {/* NEW: Occupancy Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {room.status === 'occupied' ? (
                      <OccupancyIndicator
                        currentOccupancy={room.currentOccupancy || 0}
                        capacity={room.capacityNum || 1}
                        showAdd={!room.deleted && room.currentOccupancy < room.capacityNum}
                        onAddClick={() => handleAddRoommate(room)}
                      />
                    ) : (
                      <span className="text-sm text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-semibold ${room.deleted ? 'text-neutral-400' : 'text-neutral-900'}`}>{room.rent}</div>
                  </td>
                  {/* UPDATED: Tenant(s) Column - Multi-tenant display */}
                  <td className="px-6 py-4">
                    {room.tenants?.length > 0 ? (
                      <div className="min-w-[200px]">
                        {/* Primary Tenant */}
                        {room.primaryTenant && (
                          <button
                            onClick={() => !room.deleted && handleViewTenant(room)}
                            disabled={room.deleted}
                            className={`text-sm font-medium flex items-center gap-2 mb-1 ${room.deleted ? 'text-neutral-400 cursor-not-allowed' : 'text-primary-600 hover:text-primary-900'}`}
                          >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="truncate">{room.primaryTenant.name}</span>
                            <TenantTypeBadge isPrimary={true} size="sm" />
                          </button>
                        )}

                        {/* Roommates Count */}
                        {room.tenants.length > 1 && (
                          <button
                            onClick={() => !room.deleted && handleShowAllTenants(room)}
                            disabled={room.deleted}
                            className={`text-xs flex items-center gap-1 ${room.deleted ? 'text-neutral-400 cursor-not-allowed' : 'text-neutral-600 hover:text-primary-600'}`}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>+{room.tenants.length - 1} roommate{room.tenants.length > 2 ? 's' : ''}</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {room.deleted ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Deleted
                      </span>
                    ) : (
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        room.status === 'occupied'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {room.status === 'occupied' ? 'Occupied' : 'Vacant'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {room.deleted ? (
                      <div className="text-xs text-neutral-400 italic">
                        No actions available
                      </div>
                    ) : (
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
                                  {/* View All Tenants (NEW for multi-tenant) */}
                                  {room.tenants?.length > 1 ? (
                                    <button
                                      onClick={() => {
                                        handleShowAllTenants(room);
                                        setOpenMenuId(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center justify-between"
                                    >
                                      <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        View All Tenants
                                      </div>
                                      <span className="text-xs text-neutral-500">{room.tenants.length}</span>
                                    </button>
                                  ) : (
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
                                  )}

                                  {/* Add Roommate (NEW - shown if capacity available) */}
                                  {room.currentOccupancy < room.capacityNum && (
                                    <button
                                      onClick={() => {
                                        handleAddRoommate(room);
                                        setOpenMenuId(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center"
                                    >
                                      <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m0-3h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                      </svg>
                                      Add Roommate
                                    </button>
                                  )}

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
                                    Move Out Tenant...
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
                    )}
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-900">
                      {editingRoom ? 'Edit Room' : 'Add New Room'}
                    </h3>
                    {!editingRoom && (
                      <button
                        type="button"
                        onClick={fillDemoData}
                        className="px-3 py-1.5 text-xs sm:text-sm font-medium text-accent-700 bg-accent-50 hover:bg-accent-100 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="hidden sm:inline">Fill Demo Data</span>
                        <span className="sm:hidden">Demo</span>
                      </button>
                    )}
                  </div>
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
                  {[1, 2, 3].map((step) => {
                    const getStepIcon = (stepNum) => {
                      if (stepNum === 1) {
                        // Basic Info - Door/Room icon
                        return (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        );
                      } else if (stepNum === 2) {
                        // Rent - Currency/Money icon
                        return (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        );
                      } else {
                        // Details - List/Checklist icon
                        return (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        );
                      }
                    };

                    return (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all ${
                            step < currentStep
                              ? 'bg-green-500 text-white'
                              : step === currentStep
                              ? 'bg-primary-600 text-white'
                              : 'bg-neutral-200 text-neutral-500'
                          }`}>
                            {getStepIcon(step)}
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
                    );
                  })}
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
                    buildingsLoading={buildingsLoading}
                    amenities={amenities}
                    amenitiesLoading={amenitiesLoading}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    handleSubmit={handleSubmit}
                    closeModal={closeModal}
                    isEditing={!!editingRoom}
                    isSubmitting={createLoading || updateLoading}
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
        message={`Are you sure you want to delete Room ${roomToDelete?.roomNumber} in ${roomToDelete?.building}?\n\nNote: The room will be marked as deleted but will remain in the system. The room number cannot be reused.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* NEW: Promote Tenant Modal */}
      <PromoteTenantModal
        isOpen={showPromoteModal}
        onClose={() => setShowPromoteModal(false)}
        currentPrimary={tenantToPromote?.room?.primaryTenant}
        tenantToPromote={tenantToPromote?.tenant}
        rent={tenantToPromote?.room?.rentAmount}
        onConfirm={confirmPromoteTenant}
        loading={false}
      />

      {/* NEW: All Tenants Modal */}
      {showAllTenantsModal && roomForTenants && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowAllTenantsModal(false)}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-5 sm:px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    All Tenants - Room {roomForTenants.roomNumber}
                  </h2>
                  <p className="text-sm text-neutral-600 mt-1">
                    {roomForTenants.building} • {roomForTenants.currentOccupancy}/{roomForTenants.capacityNum} occupied
                  </p>
                </div>
                <button
                  onClick={() => setShowAllTenantsModal(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                {roomForTenants.tenants?.map((tenant, index) => (
                  <div
                    key={tenant.tenant_id}
                    className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-bold text-lg">
                            {tenant.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900">{tenant.name}</h3>
                          <TenantTypeBadge isPrimary={tenant.isPrimary} size="sm" />
                        </div>
                      </div>

                      {/* Actions for secondary tenants */}
                      {!tenant.isPrimary && (
                        <button
                          onClick={() => {
                            setShowAllTenantsModal(false);
                            handlePromoteTenant(tenant, roomForTenants);
                          }}
                          className="text-xs text-primary-600 hover:text-primary-800 font-medium px-3 py-1.5 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                          Promote to Primary
                        </button>
                      )}
                    </div>

                    {/* Contact Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{tenant.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600">
                        <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{tenant.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600 sm:col-span-2">
                        <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Moved in: {new Date(tenant.moveInDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Rent info for primary tenant */}
                    {tenant.isPrimary && (
                      <div className="mt-3 pt-3 border-t border-neutral-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-600">Monthly Rent Responsibility:</span>
                          <span className="font-semibold text-primary-600">{roomForTenants.rent}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 sm:px-6 py-4 border-t border-neutral-200 flex justify-end">
                <button
                  onClick={() => setShowAllTenantsModal(false)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Rooms;
