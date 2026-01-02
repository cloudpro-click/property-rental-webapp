import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import TenantWizard from '../components/TenantWizard';

const Tenants = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMoveOutModal, setShowMoveOutModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [moveOutDate, setMoveOutDate] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, available
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [viewModalTab, setViewModalTab] = useState('personal'); // personal, guardian, lease, documents

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

  // Available rooms (from Rooms module - in real app, this would come from shared state/API)
  const [availableRooms] = useState([
    { id: '1', building: 'Building A', roomNumber: '101', floor: '1', rent: '₱8,500', status: 'occupied' },
    { id: '2', building: 'Building A', roomNumber: '102', floor: '1', rent: '₱8,500', status: 'vacant' },
    { id: '3', building: 'Building A', roomNumber: '201', floor: '2', rent: '₱9,000', status: 'occupied' },
    { id: '4', building: 'Building A', roomNumber: '202', floor: '2', rent: '₱9,000', status: 'vacant' },
    { id: '5', building: 'Building A', roomNumber: '203', floor: '2', rent: '₱9,000', status: 'vacant' },
    { id: '6', building: 'Building B', roomNumber: '101', floor: '1', rent: '₱7,500', status: 'occupied' },
    { id: '7', building: 'Building B', roomNumber: '102', floor: '1', rent: '₱7,500', status: 'vacant' },
    { id: '8', building: 'Building B', roomNumber: '205', floor: '2', rent: '₱7,200', status: 'occupied' },
    { id: '9', building: 'Building B', roomNumber: '206', floor: '2', rent: '₱7,200', status: 'vacant' },
    { id: '10', building: 'Building C', roomNumber: '101', floor: '1', rent: '₱6,800', status: 'vacant' },
    { id: '11', building: 'Building C', roomNumber: '102', floor: '1', rent: '₱6,800', status: 'vacant' },
    { id: '12', building: 'Building C', roomNumber: '201', floor: '2', rent: '₱7,000', status: 'vacant' },
  ]);

  const [tenants, setTenants] = useState([
    {
      id: 1,
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+63 917 123 4567',
      building: 'Building A',
      room: '101',
      rent: '₱8,500',
      moveInDate: '2024-01-15',
      moveOutDate: null,
      status: 'active',
      balance: '₱0',
      rentalHistory: []
    },
    {
      id: 2,
      name: 'Jose Reyes',
      email: 'jose.reyes@email.com',
      phone: '+63 918 234 5678',
      building: 'Building B',
      room: '205',
      rent: '₱7,200',
      moveInDate: '2024-03-01',
      moveOutDate: null,
      status: 'active',
      balance: '₱0',
      rentalHistory: []
    },
    {
      id: 3,
      name: 'Ana Cruz',
      email: 'ana.cruz@email.com',
      phone: '+63 919 345 6789',
      building: 'Building A',
      room: '201',
      rent: '₱9,000',
      moveInDate: '2024-02-10',
      moveOutDate: null,
      status: 'active',
      balance: '₱0',
      rentalHistory: []
    },
    {
      id: 4,
      name: 'Pedro Garcia',
      email: 'pedro.garcia@email.com',
      phone: '+63 920 456 7890',
      building: 'Building C',
      room: '102',
      rent: '₱6,800',
      moveInDate: '2024-06-01',
      moveOutDate: null,
      status: 'active',
      balance: '₱6,800',
      rentalHistory: []
    },
    {
      id: 5,
      name: 'Linda Fernandez',
      email: 'linda.fernandez@email.com',
      phone: '+63 921 567 8901',
      building: null,
      room: null,
      rent: null,
      moveInDate: '2023-05-10',
      moveOutDate: '2024-08-15',
      status: 'moved-out',
      balance: '₱0',
      rentalHistory: [
        {
          building: 'Building B',
          room: '206',
          rent: '₱7,200',
          moveInDate: '2023-05-10',
          moveOutDate: '2024-08-15'
        }
      ]
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    phoneVerified: false,
    dateOfBirth: '',
    idNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    guarantorName: '',
    guarantorRelationship: '',
    guarantorEmail: '',
    guarantorPhone: '',
    guarantorPhoneVerified: false,
    guarantorAddress: '',
    notes: '',
    idAttachment: null
  });

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTenant = {
      id: tenants.length + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      phoneVerified: formData.phoneVerified,
      building: null, // Will be assigned via lease
      buildingId: null,
      room: null,
      roomId: null,
      rent: null,
      moveInDate: null,
      moveOutDate: null,
      status: 'available', // New status for tenants without lease
      balance: '₱0',
      rentalHistory: [],
      // Additional fields stored but not displayed in table
      dateOfBirth: formData.dateOfBirth,
      idNumber: formData.idNumber,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactPhone: formData.emergencyContactPhone,
      guarantorName: formData.guarantorName,
      guarantorRelationship: formData.guarantorRelationship,
      guarantorEmail: formData.guarantorEmail,
      guarantorPhone: formData.guarantorPhone,
      guarantorPhoneVerified: formData.guarantorPhoneVerified,
      guarantorAddress: formData.guarantorAddress,
      notes: formData.notes
    };

    setTenants([...tenants, newTenant]);

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      phoneVerified: false,
      dateOfBirth: '',
      idNumber: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      guarantorName: '',
      guarantorRelationship: '',
      guarantorEmail: '',
      guarantorPhone: '',
      guarantorPhoneVerified: false,
      guarantorAddress: '',
      notes: '',
      idAttachment: null
    });
    setCurrentStep(1);
    setShowAddModal(false);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setCurrentStep(1);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      phoneVerified: false,
      dateOfBirth: '',
      idNumber: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      guarantorName: '',
      guarantorRelationship: '',
      guarantorEmail: '',
      guarantorPhone: '',
      guarantorPhoneVerified: false,
      guarantorAddress: '',
      notes: '',
      idAttachment: null
    });
  };

  // Fill form with demo data
  const fillDemoData = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      name: 'Carlos Rivera',
      email: 'carlos.rivera@email.com',
      phone: '+63 922 678 9012',
      phoneVerified: true,
      dateOfBirth: '1990-05-15',
      idNumber: 'SSS-1234-5678-9012',
      emergencyContactName: 'Maria Rivera',
      emergencyContactPhone: '+63 917 111 2222',
      building: 'Building A',
      buildingId: '',
      room: '2', // Room 102 in Building A
      roomId: '',
      rent: '8500',
      moveInDate: today,
      securityDeposit: '8500',
      advanceRent: '1',
      contractDuration: '12',
      guarantorName: 'Roberto Santos',
      guarantorRelationship: 'Parent',
      guarantorEmail: 'roberto.santos@email.com',
      guarantorPhone: '+63 918 333 4444',
      guarantorPhoneVerified: true,
      guarantorAddress: '456 Magsaysay Avenue, Quezon City, Metro Manila 1100',
      notes: 'Demo tenant data for testing purposes'
    });
  };

  // Handle Move Out
  const handleMoveOut = (tenant) => {
    setSelectedTenant(tenant);
    setMoveOutDate(new Date().toISOString().split('T')[0]); // Today's date
    setShowMoveOutModal(true);
  };

  const confirmMoveOut = () => {
    if (selectedTenant && moveOutDate) {
      const updatedTenants = tenants.map(t => {
        if (t.id === selectedTenant.id) {
          // Add current rental to history
          const newHistory = [...(t.rentalHistory || []), {
            building: t.building,
            room: t.room,
            rent: t.rent,
            moveInDate: t.moveInDate,
            moveOutDate: moveOutDate
          }];

          return {
            ...t,
            building: null,
            room: null,
            rent: null,
            moveOutDate: moveOutDate,
            status: 'moved-out',
            rentalHistory: newHistory
          };
        }
        return t;
      });
      setTenants(updatedTenants);
      setShowMoveOutModal(false);
      setSelectedTenant(null);
      setMoveOutDate('');
    }
  };

  // Handle Re-activate Tenant
  const handleReactivate = (tenant) => {
    setSelectedTenant(tenant);
    setFormData({
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      phoneVerified: tenant.phoneVerified || false,
      dateOfBirth: tenant.dateOfBirth || '',
      idNumber: tenant.idNumber || '',
      emergencyContactName: tenant.emergencyContactName || '',
      emergencyContactPhone: tenant.emergencyContactPhone || '',
      building: '',
      buildingId: '',
      room: '',
      roomId: '',
      rent: '',
      moveInDate: new Date().toISOString().split('T')[0],
      securityDeposit: '',
      advanceRent: '',
      contractDuration: '',
      guarantorName: tenant.guarantorName || '',
      guarantorRelationship: tenant.guarantorRelationship || '',
      guarantorEmail: tenant.guarantorEmail || '',
      guarantorPhone: tenant.guarantorPhone || '',
      guarantorPhoneVerified: tenant.guarantorPhoneVerified || false,
      guarantorAddress: tenant.guarantorAddress || '',
      notes: 'Returning tenant'
    });
    setShowReactivateModal(true);
  };

  const confirmReactivate = (e) => {
    e.preventDefault();

    const selectedRoom = availableRooms.find(r => r.id === formData.room);

    const updatedTenants = tenants.map(t => {
      if (t.id === selectedTenant.id) {
        return {
          ...t,
          building: formData.building,
          room: selectedRoom ? selectedRoom.roomNumber : formData.room,
          rent: `₱${formData.rent}`,
          moveInDate: formData.moveInDate,
          moveOutDate: null,
          status: 'active',
          securityDeposit: formData.securityDeposit,
          advanceRent: formData.advanceRent,
          contractDuration: formData.contractDuration,
          notes: formData.notes
        };
      }
      return t;
    });

    setTenants(updatedTenants);
    setShowReactivateModal(false);
    setSelectedTenant(null);
    setCurrentStep(1);
  };

  // Handle View Tenant Details
  const handleViewTenant = (tenant) => {
    setSelectedTenant(tenant);
    setShowViewModal(true);
  };

  // Handle Edit Tenant
  const handleEditTenant = (tenant) => {
    setSelectedTenant(tenant);
    setFormData({
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      phoneVerified: tenant.phoneVerified || false,
      dateOfBirth: tenant.dateOfBirth || '',
      idNumber: tenant.idNumber || '',
      emergencyContactName: tenant.emergencyContactName || '',
      emergencyContactPhone: tenant.emergencyContactPhone || '',
      guarantorName: tenant.guarantorName || '',
      guarantorRelationship: tenant.guarantorRelationship || '',
      guarantorEmail: tenant.guarantorEmail || '',
      guarantorPhone: tenant.guarantorPhone || '',
      guarantorPhoneVerified: tenant.guarantorPhoneVerified || false,
      guarantorAddress: tenant.guarantorAddress || '',
      notes: tenant.notes || '',
      idAttachment: null
    });
    setShowEditModal(true);
  };

  // Confirm Edit Tenant
  const confirmEditTenant = (e) => {
    e.preventDefault();

    const updatedTenants = tenants.map(t => {
      if (t.id === selectedTenant.id) {
        return {
          ...t,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          phoneVerified: formData.phoneVerified,
          dateOfBirth: formData.dateOfBirth,
          idNumber: formData.idNumber,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone,
          guarantorName: formData.guarantorName,
          guarantorRelationship: formData.guarantorRelationship,
          guarantorEmail: formData.guarantorEmail,
          guarantorPhone: formData.guarantorPhone,
          guarantorPhoneVerified: formData.guarantorPhoneVerified,
          guarantorAddress: formData.guarantorAddress,
          notes: formData.notes
        };
      }
      return t;
    });

    setTenants(updatedTenants);
    setShowEditModal(false);
    setSelectedTenant(null);
    setCurrentStep(1);
    setFormData({
      name: '',
      email: '',
      phone: '',
      phoneVerified: false,
      dateOfBirth: '',
      idNumber: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      guarantorName: '',
      guarantorRelationship: '',
      guarantorEmail: '',
      guarantorPhone: '',
      guarantorPhoneVerified: false,
      guarantorAddress: '',
      notes: '',
      idAttachment: null
    });
  };

  // Filter tenants by status and search query
  const filteredTenants = tenants
    .filter(t => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'available') return t.status === 'available' || !t.status;
      return t.status === statusFilter;
    })
    .filter(t => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(query) ||
        t.email.toLowerCase().includes(query) ||
        t.phone.toLowerCase().includes(query) ||
        (t.building && t.building.toLowerCase().includes(query)) ||
        (t.room && t.room.toLowerCase().includes(query))
      );
    });

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-neutral-900">Tenants</h2>
          <p className="text-neutral-600">Manage your tenant information and history</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Register Tenant
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Search by name, email, phone, building, or room..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
              statusFilter === 'all'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All ({tenants.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
              statusFilter === 'active'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Currently Leased ({tenants.filter(t => t.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('available')}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
              statusFilter === 'available'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Available ({tenants.filter(t => t.status === 'available' || !t.status).length})
          </button>
        </div>
        {searchQuery && (
          <div className="text-sm text-neutral-600">
            Found <span className="font-semibold text-neutral-900">{filteredTenants.length}</span> result{filteredTenants.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Registered</p>
              <p className="text-2xl font-bold text-neutral-900">{tenants.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Currently Leased</p>
              <p className="text-2xl font-bold text-neutral-900">
                {tenants.filter(t => t.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Available</p>
              <p className="text-2xl font-bold text-neutral-900">
                {tenants.filter(t => t.status === 'available' || !t.status).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="card overflow-hidden">
        {filteredTenants.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <svg className="w-16 h-16 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <p className="text-lg font-medium text-neutral-900 mb-1">
                  {statusFilter === 'all' && searchQuery === ''
                    ? 'No Tenants Registered'
                    : statusFilter === 'active'
                    ? 'No Tenants Currently Leased'
                    : statusFilter === 'available'
                    ? 'No Available Tenants'
                    : 'No Tenants Found'
                  }
                </p>
                <p className="text-sm text-neutral-600 mb-3">
                  {statusFilter === 'all' && searchQuery === ''
                    ? 'Start by registering your first tenant to manage their information and leases.'
                    : searchQuery !== ''
                    ? `No tenants match your search "${searchQuery}". Try a different search term.`
                    : statusFilter === 'active'
                    ? 'No tenants are currently in active leases.'
                    : 'No tenants are available for assignment to rooms.'
                  }
                </p>
                {statusFilter === 'all' && searchQuery === '' && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Register First Tenant
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Current Lease
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Registration Date
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
                {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-neutral-50 transition-colors">
                  {/* Tenant Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-700 font-semibold text-lg">
                          {tenant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-neutral-900">{tenant.name}</div>
                        {tenant.phoneVerified && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-green-600">Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">{tenant.phone}</div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-600">{tenant.email}</div>
                  </td>

                  {/* Current Lease */}
                  <td className="px-6 py-4">
                    {tenant.status === 'active' && tenant.building && tenant.room ? (
                      <div className="min-w-[140px]">
                        <div className="text-sm font-medium text-neutral-900">{tenant.building}</div>
                        <div className="text-xs text-neutral-500">Room {tenant.room}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-neutral-400">-</span>
                    )}
                  </td>

                  {/* Registration Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">
                      {tenant.registrationDate || new Date().toLocaleDateString()}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      tenant.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {tenant.status === 'active' ? 'Leased' : 'Available'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2 justify-end">
                      {/* Direct Action Buttons */}
                      <button
                        onClick={() => handleViewTenant(tenant)}
                        className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleEditTenant(tenant)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Edit Tenant"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Add Tenant Wizard Modal */}
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
                    Register New Tenant
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={fillDemoData}
                      className="px-3 py-1.5 bg-accent-100 text-accent-700 rounded-lg hover:bg-accent-200 font-medium transition-colors text-xs sm:text-sm flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="hidden sm:inline">Fill Demo Data</span>
                      <span className="sm:hidden">Demo</span>
                    </button>
                    <button
                      onClick={closeModal}
                      className="text-neutral-400 hover:text-neutral-600 p-1"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((step) => {
                    const getStepIcon = (stepNum) => {
                      if (stepNum === 1) {
                        return (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        );
                      } else if (stepNum === 2) {
                        return (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        );
                      } else if (stepNum === 3) {
                        return (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                            {step === 1 ? 'Tenant Info' : step === 2 ? 'Guardian' : 'Documents'}
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
                  <TenantWizard
                    currentStep={currentStep}
                    formData={formData}
                    setFormData={setFormData}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    handleSubmit={handleSubmit}
                    closeModal={closeModal}
                    isEditing={false}
                    existingTenants={tenants}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Move Out Modal */}
      {showMoveOutModal && (
        <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-neutral-200">
              <h3 className="text-xl font-display font-bold text-neutral-900">Move Out Tenant</h3>
            </div>

            <div className="p-5">
              <p className="text-neutral-700 mb-4">
                Mark <span className="font-semibold">{selectedTenant?.name}</span> as moved out? Their rental history will be preserved.
              </p>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Move-out Date <span className="text-secondary-500">*</span>
                </label>
                <input
                  type="date"
                  value={moveOutDate}
                  onChange={(e) => setMoveOutDate(e.target.value)}
                  className="input-field"
                />
              </div>

              {selectedTenant?.rentalHistory && selectedTenant.rentalHistory.length > 0 && (
                <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
                  <p className="text-xs font-medium text-neutral-700 mb-2">Previous Rentals:</p>
                  {selectedTenant.rentalHistory.map((history, index) => (
                    <div key={index} className="text-xs text-neutral-600">
                      {history.building} - Room {history.room} ({history.moveInDate} to {history.moveOutDate})
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-neutral-200 flex gap-3">
              <button
                onClick={() => {
                  setShowMoveOutModal(false);
                  setSelectedTenant(null);
                  setMoveOutDate('');
                }}
                className="flex-1 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmMoveOut}
                className="flex-1 px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg font-medium transition-colors"
              >
                Confirm Move Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Re-activate Tenant Wizard Modal */}
      {showReactivateModal && (
        <div
          className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-50 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowReactivateModal(false);
              setSelectedTenant(null);
              setCurrentStep(1);
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-900">
                        Re-activate Tenant
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                        Welcome back, <span className="font-semibold text-neutral-900">{selectedTenant?.name}</span>!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowReactivateModal(false);
                      setSelectedTenant(null);
                      setCurrentStep(1);
                    }}
                    className="text-neutral-400 hover:text-neutral-600 p-1"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={confirmReactivate}>
                <div className="p-4 sm:p-5">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Returning Tenant Info Banner */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-green-900">Returning Tenant</p>
                          <p className="text-xs sm:text-sm text-green-700 mt-1">
                            Personal information will be retained from previous rental. Please select a new room and update rental details below.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rental History */}
                    {selectedTenant?.rentalHistory && selectedTenant.rentalHistory.length > 0 && (
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm font-semibold text-neutral-900">Previous Rental History</p>
                        </div>
                        <div className="space-y-2">
                          {selectedTenant.rentalHistory.map((history, index) => (
                            <div key={index} className="bg-white border border-neutral-200 rounded-lg p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <p className="text-sm font-medium text-neutral-900">
                                      {history.building} - Room {history.room}
                                    </p>
                                  </div>
                                  <p className="text-xs text-neutral-600 ml-6">
                                    {history.moveInDate} to {history.moveOutDate}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-neutral-900">{history.rent}</p>
                                  <p className="text-xs text-neutral-500">per month</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Info Box */}
                    <div className="border-t border-neutral-200 pt-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex-1">
                            <p className="font-medium text-blue-900 mb-1">Room Assignment</p>
                            <p className="text-sm text-blue-700">
                              After reactivating, you can assign this tenant to a room by creating a lease from the Rooms page.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Tenant Details Modal */}
      {showViewModal && selectedTenant && (
        <div
          className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-50 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowViewModal(false);
              setSelectedTenant(null);
              setViewModalTab('personal');
            }
          }}
        >
          <div className="min-h-screen px-2 sm:px-4 flex items-center justify-center py-4 sm:py-8">
            <div
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-3xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 font-bold text-xl">
                        {selectedTenant.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-900">
                        {selectedTenant.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 mt-0.5 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {selectedTenant.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedTenant(null);
                      setViewModalTab('personal');
                    }}
                    className="text-neutral-400 hover:text-neutral-600 p-1"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 overflow-x-auto">
                  <button
                    onClick={() => setViewModalTab('personal')}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      viewModalTab === 'personal'
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Personal</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewModalTab('guardian')}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      viewModalTab === 'guardian'
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Guardian</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewModalTab('lease')}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      viewModalTab === 'lease'
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>Lease Info</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewModalTab('documents')}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      viewModalTab === 'documents'
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Documents</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
                {/* Personal Information Tab */}
                {viewModalTab === 'personal' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Personal Information
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 rounded-lg p-4">
                        <div>
                          <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Full Name</p>
                          <p className="text-sm font-medium text-neutral-900">{selectedTenant.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Email Address</p>
                          <p className="text-sm font-medium text-neutral-900">{selectedTenant.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Phone Number</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-neutral-900">{selectedTenant.phone}</p>
                            {selectedTenant.phoneVerified && (
                              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20" title="Verified">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        {selectedTenant.dateOfBirth && (
                          <div>
                            <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Date of Birth</p>
                            <p className="text-sm font-medium text-neutral-900">{selectedTenant.dateOfBirth}</p>
                          </div>
                        )}
                        {selectedTenant.idNumber && (
                          <div className="sm:col-span-2">
                            <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Government ID Number</p>
                            <p className="text-sm font-medium text-neutral-900">{selectedTenant.idNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    {(selectedTenant.emergencyContactName || selectedTenant.emergencyContactPhone) && (
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Emergency Contact
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-red-50 border border-red-200 rounded-lg p-4">
                          {selectedTenant.emergencyContactName && (
                            <div>
                              <p className="text-xs text-red-700 mb-1 uppercase tracking-wide">Name</p>
                              <p className="text-sm font-medium text-neutral-900">{selectedTenant.emergencyContactName}</p>
                            </div>
                          )}
                          {selectedTenant.emergencyContactPhone && (
                            <div>
                              <p className="text-xs text-red-700 mb-1 uppercase tracking-wide">Phone</p>
                              <p className="text-sm font-medium text-neutral-900">{selectedTenant.emergencyContactPhone}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Additional Notes */}
                    {selectedTenant.notes && (
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          Additional Notes
                        </h4>
                        <p className="text-sm text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                          {selectedTenant.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Guardian/Guarantor Tab */}
                {viewModalTab === 'guardian' && (
                  <div className="space-y-4">
                    {selectedTenant.guarantorName ? (
                      <>
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Guarantor Information
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 rounded-lg p-4">
                            <div>
                              <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Full Name</p>
                              <p className="text-sm font-medium text-neutral-900">{selectedTenant.guarantorName}</p>
                            </div>
                            {selectedTenant.guarantorRelationship && (
                              <div>
                                <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Relationship</p>
                                <p className="text-sm font-medium text-neutral-900">{selectedTenant.guarantorRelationship}</p>
                              </div>
                            )}
                            {selectedTenant.guarantorEmail && (
                              <div>
                                <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Email</p>
                                <p className="text-sm font-medium text-neutral-900">{selectedTenant.guarantorEmail}</p>
                              </div>
                            )}
                            {selectedTenant.guarantorPhone && (
                              <div>
                                <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Phone</p>
                                <p className="text-sm font-medium text-neutral-900">{selectedTenant.guarantorPhone}</p>
                              </div>
                            )}
                            {selectedTenant.guarantorAddress && (
                              <div className="sm:col-span-2">
                                <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Address</p>
                                <p className="text-sm font-medium text-neutral-900">{selectedTenant.guarantorAddress}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <svg className="w-16 h-16 text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-neutral-600 font-medium">No Guardian Information</p>
                        <p className="text-sm text-neutral-500 mt-1">Guardian details not provided for this tenant</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Lease Information Tab */}
                {viewModalTab === 'lease' && (
                  <div className="space-y-4">
                    {(selectedTenant.building || selectedTenant.status === 'active') ? (
                      <>
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Current Lease Details
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 rounded-lg p-4">
                            {selectedTenant.building && (
                              <div>
                                <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Building</p>
                                <p className="text-sm font-medium text-neutral-900">{selectedTenant.building}</p>
                              </div>
                            )}
                            {selectedTenant.room && (
                              <div>
                                <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Room Number</p>
                                <p className="text-sm font-medium text-neutral-900">{selectedTenant.room}</p>
                              </div>
                            )}
                            {selectedTenant.rent && (
                              <div>
                                <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Monthly Rent</p>
                                <p className="text-sm font-semibold text-primary-600">{selectedTenant.rent}</p>
                              </div>
                            )}
                            {selectedTenant.moveInDate && (
                              <div>
                                <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Move-in Date</p>
                                <p className="text-sm font-medium text-neutral-900">{selectedTenant.moveInDate}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Lease Status</p>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                selectedTenant.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : selectedTenant.status === 'available'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-neutral-100 text-neutral-800'
                              }`}>
                                {selectedTenant.status === 'active' ? 'In Lease' : selectedTenant.status === 'available' ? 'Available' : 'Moved Out'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <svg className="w-16 h-16 text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p className="text-neutral-600 font-medium">No Active Lease</p>
                        <p className="text-sm text-neutral-500 mt-1">This tenant is currently not assigned to any room</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Documents Tab */}
                {viewModalTab === 'documents' && (
                  <div className="space-y-4">
                    {selectedTenant.idAttachment ? (
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Government ID Document
                        </h4>
                        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                          <img
                            src={selectedTenant.idAttachment}
                            alt="Government ID"
                            className="w-full rounded-lg shadow-md"
                          />
                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-xs text-neutral-600">Government-issued ID</p>
                            <button
                              onClick={() => window.open(selectedTenant.idAttachment, '_blank')}
                              className="text-xs text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              View Full Size
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <svg className="w-16 h-16 text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-neutral-600 font-medium">No Documents Uploaded</p>
                        <p className="text-sm text-neutral-500 mt-1">No ID documents have been uploaded for this tenant</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-5 border-t border-neutral-200 flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedTenant(null);
                    setViewModalTab('personal');
                  }}
                  className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewModalTab('personal');
                    handleEditTenant(selectedTenant);
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Tenant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tenant Modal */}
      {showEditModal && selectedTenant && (
        <div
          className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-50 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEditModal(false);
              setSelectedTenant(null);
              setCurrentStep(1);
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-900">
                        Edit Tenant
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                        Update tenant information
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedTenant(null);
                      setCurrentStep(1);
                    }}
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
                        return (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        );
                      } else if (stepNum === 2) {
                        return (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        );
                      } else if (stepNum === 3) {
                        return (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                            {step === 1 ? 'Tenant Info' : step === 2 ? 'Guardian' : 'Documents'}
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
              <form onSubmit={confirmEditTenant}>
                <div className="p-4 sm:p-5 min-h-[320px] sm:min-h-[380px]">
                  <TenantWizard
                    currentStep={currentStep}
                    formData={formData}
                    setFormData={setFormData}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    handleSubmit={confirmEditTenant}
                    closeModal={() => {
                      setShowEditModal(false);
                      setSelectedTenant(null);
                      setCurrentStep(1);
                    }}
                    isEditing={true}
                    existingTenants={tenants}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Tenants;
