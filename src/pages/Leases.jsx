import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import LeaseWizard from '../components/LeaseWizard';
import { GET_ALL_LEASES, CREATE_LEASE, TERMINATE_LEASE } from '../lib/graphql-queries';

const Leases = () => {
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, expired, closed
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [selectedLease, setSelectedLease] = useState(null);
  const [terminationDate, setTerminationDate] = useState('');

  // Lease Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaseFormData, setLeaseFormData] = useState({
    propertyId: '',
    roomId: '',
    roomNumber: '',
    floor: '',
    capacity: 0,
    rent: '',
    tenantId: '',
    tenantName: '',
    tenantEmail: '',
    tenantPhone: '',
    startDate: '',
    endDate: '',
    isOpenEnded: false,
    moveInDate: '',
    notes: '',
    isAddingRoommate: false
  });
  const [terminationReason, setTerminationReason] = useState('');

  // GraphQL Query for Leases
  const { data: leasesData, loading: leasesLoading, error: leasesError, refetch: refetchLeases } = useQuery(GET_ALL_LEASES, {
    variables: { page: { limit: 100, offset: 0 } }
  });

  // GraphQL Mutations
  const [createLease] = useMutation(CREATE_LEASE, {
    onCompleted: (data) => {
      if (data.createLease.success) {
        toast.success('Lease created successfully!');
        refetchLeases();
        closeLeaseModal();
      } else {
        toast.error(data.createLease.message || 'Failed to create lease');
      }
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create lease');
      setIsSubmitting(false);
    }
  });

  const [terminateLease] = useMutation(TERMINATE_LEASE, {
    onCompleted: (data) => {
      if (data.terminateLease.success) {
        toast.success(`Lease ${selectedLease.lease_id} closed successfully!`);
        refetchLeases();
        setShowTerminateModal(false);
        setSelectedLease(null);
        setTerminationDate('');
        setTerminationReason('');
      } else {
        toast.error(data.terminateLease.message || 'Failed to terminate lease');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to terminate lease');
    }
  });

  // Extract leases from API response
  const leases = leasesData?.getAllLeases?.leases || [];

  // Transform API data for display (map API fields to UI-expected format)
  const transformedLeases = useMemo(() => {
    return leases.map(lease => ({
      lease_id: lease.lease_id,
      room_id: lease.room_id,
      building_id: lease.building_id,
      building_name: lease.building?.name || 'Unknown Building',
      room_number: lease.room?.roomNumber || 'N/A',
      floor: lease.room?.floor || 0,
      lease_start_date: lease.start_date,
      lease_end_date: lease.end_date,
      monthly_rent: lease.monthly_rent,
      status: lease.status?.code?.toLowerCase() || 'active',
      tenants: (lease.tenants || []).map(tenant => ({
        tenant_id: tenant.tenant_id,
        first_name: tenant.first_name || '',
        last_name: tenant.family_name || '',
        name: `${tenant.first_name || ''} ${tenant.family_name || ''}`.trim(),
        email: tenant.email,
        phone: tenant.phone,
        role: tenant.tenant_id === lease.primary_tenant_id ? 'primary' : 'secondary',
        move_in_date: lease.move_in_date,
        status: 'active'
      })),
      termination_date: lease.termination_date,
      termination_reason: lease.termination_reason,
      created_date: lease.audit?.created_date,
      created_by: lease.audit?.created_by
    }));
  }, [leases]);

  // Filter leases
  const filteredLeases = useMemo(() => {
    return transformedLeases.filter(lease => {
      const matchesStatus = statusFilter === 'all' || lease.status === statusFilter;
      const matchesSearch = searchQuery === '' ||
        lease.building_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lease.room_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lease.tenants.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lease.lease_id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [transformedLeases, statusFilter, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => ({
    total: transformedLeases.length,
    active: transformedLeases.filter(l => l.status === 'active').length,
    expired: transformedLeases.filter(l => l.status === 'expired').length,
    closed: transformedLeases.filter(l => l.status === 'closed').length,
    totalRevenue: transformedLeases
      .filter(l => l.status === 'active')
      .reduce((sum, l) => sum + (l.monthly_rent || 0), 0)
  }), [transformedLeases]);

  const handleViewLease = (lease) => {
    setSelectedLease(lease);
    setShowViewModal(true);
    setOpenMenuId(null);
  };

  const handleTerminateLease = (lease) => {
    setSelectedLease(lease);
    setShowTerminateModal(true);
    setOpenMenuId(null);
  };

  const confirmCloseLease = () => {
    terminateLease({
      variables: {
        lease_id: selectedLease.lease_id,
        input: {
          termination_date: terminationDate,
          reason: terminationReason || null
        }
      }
    });
  };

  // Lease Wizard Handlers
  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitLease = (e, wizardData) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build the lease input from wizard data
    const leaseInput = {
      room_id: wizardData.roomId,
      tenant_ids: wizardData.selectedTenantIds || [wizardData.tenantId],
      primary_tenant_id: wizardData.primaryTenantId || wizardData.tenantId,
      start_date: wizardData.startDate,
      end_date: wizardData.isOpenEnded ? null : wizardData.endDate,
      is_open_ended: wizardData.isOpenEnded || false,
      monthly_rent: parseFloat(wizardData.rent),
      move_in_date: wizardData.moveInDate,
      includes_water: wizardData.includesWater || false,
      includes_electric: wizardData.includesElectric || false,
      notes: wizardData.notes || null
    };

    createLease({
      variables: {
        input: leaseInput
      }
    });
  };

  const closeLeaseModal = () => {
    setShowAddModal(false);
    setCurrentStep(1);
    setLeaseFormData({
      propertyId: '',
      roomId: '',
      roomNumber: '',
      floor: '',
      capacity: 0,
      rent: '',
      tenantId: '',
      tenantName: '',
      tenantEmail: '',
      tenantPhone: '',
      startDate: '',
      endDate: '',
      isOpenEnded: false,
      moveInDate: '',
      notes: '',
      isAddingRoommate: false
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  const getRoleColor = (role) => {
    return role === 'primary'
      ? 'bg-primary-100 text-primary-800 border-primary-300'
      : 'bg-neutral-100 text-neutral-700 border-neutral-300';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null; // Open lease
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">Leases</h1>
            <p className="text-sm sm:text-base text-neutral-600">Manage rental agreements and tenant leases</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add New Lease</span>
            <span className="sm:hidden">Add Lease</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-neutral-600 mb-1">Total Leases</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-neutral-600 mb-1">Active</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-neutral-600 mb-1">Expired</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.expired}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-neutral-600 mb-1">Closed</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.closed}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-neutral-600 mb-1">Monthly Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-primary-600">₱{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="w-full sm:w-96">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by building, room, tenant, or lease ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Active ({stats.active})
              </button>
              <button
                onClick={() => setStatusFilter('expired')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'expired'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Expired ({stats.expired})
              </button>
              <button
                onClick={() => setStatusFilter('closed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'closed'
                    ? 'bg-red-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Closed ({stats.closed})
              </button>
            </div>
          </div>
        </div>

        {/* Leases List */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Lease ID
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Property & Room
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Primary Tenant
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Tenants
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Lease Period
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Rent
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-right text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {leasesLoading ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <svg className="w-10 h-10 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm text-neutral-500">Loading leases...</p>
                      </div>
                    </td>
                  </tr>
                ) : (leasesError || leasesData?.getAllLeases?.success === false) ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-lg font-medium text-red-600">Failed to Load Leases</p>
                        <p className="text-sm text-red-500 max-w-md">
                          {leasesError?.message || leasesData?.getAllLeases?.message || 'Unknown error'}
                        </p>
                        <button
                          onClick={() => refetchLeases()}
                          className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                        >
                          Retry
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : filteredLeases.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-sm text-neutral-500">
                      No leases found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredLeases.map((lease) => {
                    const primaryTenant = lease.tenants.find(t => t.role === 'primary');
                    const daysRemaining = getDaysRemaining(lease.lease_end_date);

                    return (
                      <tr key={lease.lease_id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-4 sm:px-5 py-4">
                          <div className="text-sm font-medium text-primary-600">{lease.lease_id}</div>
                        </td>

                        <td className="px-4 sm:px-5 py-4">
                          <div className="text-sm font-medium text-neutral-900">{lease.building_name}</div>
                          <div className="text-sm text-neutral-500">Room {lease.room_number} • Floor {lease.floor}</div>
                        </td>

                        <td className="px-4 sm:px-5 py-4">
                          {primaryTenant && (
                            <div>
                              <div className="text-sm font-medium text-neutral-900">{primaryTenant.name}</div>
                              <div className="text-sm text-neutral-500">{primaryTenant.phone}</div>
                            </div>
                          )}
                        </td>

                        <td className="px-4 sm:px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {lease.tenants.slice(0, 3).map((tenant) => (
                                <div
                                  key={tenant.tenant_id}
                                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                                  title={tenant.name}
                                >
                                  {(tenant.first_name || '?')[0]}{(tenant.last_name || '?')[0]}
                                </div>
                              ))}
                            </div>
                            <span className="text-sm font-medium text-neutral-700">
                              {lease.tenants.length} {lease.tenants.length === 1 ? 'Tenant' : 'Tenants'}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 sm:px-5 py-4">
                          <div className="text-sm text-neutral-900">{formatDate(lease.lease_start_date)}</div>
                          <div className="text-sm text-neutral-500">
                            to {lease.lease_end_date ? formatDate(lease.lease_end_date) : <span className="text-sm text-green-600 italic font-medium">Open</span>}
                          </div>
                          {lease.status === 'active' && daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30 && (
                            <div className="text-xs text-orange-600 font-medium mt-1">
                              {daysRemaining} days left
                            </div>
                          )}
                        </td>

                        <td className="px-4 sm:px-5 py-4">
                          <div className="text-sm font-semibold text-neutral-900">₱{(lease.monthly_rent || 0).toLocaleString()}</div>
                          <div className="text-xs text-neutral-500">per month</div>
                        </td>

                        <td className="px-4 sm:px-5 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(lease.status)}`}>
                            {(lease.status || 'unknown').charAt(0).toUpperCase() + (lease.status || 'unknown').slice(1)}
                          </span>
                        </td>

                        <td className="px-4 sm:px-5 py-4 text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === lease.lease_id ? null : lease.lease_id)}
                              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5 text-neutral-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>

                            {openMenuId === lease.lease_id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setOpenMenuId(null)}
                                ></div>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20">
                                  <button
                                    onClick={() => handleViewLease(lease)}
                                    className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center"
                                  >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Details
                                  </button>

                                  {lease.status === 'active' && (
                                    <button
                                      onClick={() => handleTerminateLease(lease)}
                                      className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center"
                                    >
                                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                      Close Lease
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Lease Modal */}
      {showViewModal && selectedLease && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Lease Details</h2>
                <p className="text-sm text-neutral-600">{selectedLease.lease_id}</p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Property Information */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Property Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Building</p>
                    <p className="text-sm font-medium text-neutral-900">{selectedLease.building_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Room Number</p>
                    <p className="text-sm font-medium text-neutral-900">Room {selectedLease.room_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Floor</p>
                    <p className="text-sm font-medium text-neutral-900">Floor {selectedLease.floor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Monthly Rent</p>
                    <p className="text-sm font-semibold text-primary-600">₱{selectedLease.monthly_rent.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Lease Period */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Lease Period</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Start Date</p>
                    <p className="text-sm font-medium text-neutral-900">{formatDate(selectedLease.lease_start_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">End Date</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {selectedLease.lease_end_date ? formatDate(selectedLease.lease_end_date) : <span className="text-green-600 italic font-medium">Open</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedLease.status)}`}>
                      {selectedLease.status.charAt(0).toUpperCase() + selectedLease.status.slice(1)}
                    </span>
                  </div>
                  {selectedLease.status === 'active' && selectedLease.lease_end_date && (
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Days Remaining</p>
                      <p className="text-sm font-medium text-neutral-900">{getDaysRemaining(selectedLease.lease_end_date)} days</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tenants */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  Tenants ({selectedLease.tenants.length})
                </h3>
                <div className="space-y-3">
                  {selectedLease.tenants.map((tenant) => (
                    <div
                      key={tenant.tenant_id}
                      className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                            {tenant.first_name[0]}{tenant.last_name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-neutral-900">{tenant.name}</p>
                            <p className="text-xs text-neutral-500">{tenant.tenant_id}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getRoleColor(tenant.role)}`}>
                          {tenant.role === 'primary' ? 'PRIMARY' : 'ROOMMATE'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-neutral-600">Email</p>
                          <p className="text-neutral-900">{tenant.email}</p>
                        </div>
                        <div>
                          <p className="text-neutral-600">Phone</p>
                          <p className="text-neutral-900">{tenant.phone}</p>
                        </div>
                        <div>
                          <p className="text-neutral-600">Move-in Date</p>
                          <p className="text-neutral-900">{formatDate(tenant.move_in_date)}</p>
                        </div>
                        <div>
                          <p className="text-neutral-600">Status</p>
                          <p className={`font-medium ${tenant.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                            {tenant.status === 'active' ? 'Active' : 'Moved Out'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Created Info */}
              <div className="border-t border-neutral-200 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-600">Created Date</p>
                    <p className="text-neutral-900">{formatDate(selectedLease.created_date)}</p>
                  </div>
                  <div>
                    <p className="text-neutral-600">Created By</p>
                    <p className="text-neutral-900">{selectedLease.created_by}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-neutral-200 px-6 py-4 flex justify-end gap-3">
              {selectedLease.status === 'active' && (
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleTerminateLease(selectedLease);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors text-sm"
                >
                  Terminate Lease
                </button>
              )}
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Lease Modal */}
      {showTerminateModal && selectedLease && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Close Lease</h3>
                  <p className="text-sm text-neutral-600">{selectedLease.lease_id}</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> This will close the lease and all tenants will be moved out. This action cannot be undone.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Closure Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={terminationDate}
                  onChange={(e) => setTerminationDate(e.target.value)}
                  className="w-full input-field"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Reason for Closure (Optional)
                </label>
                <textarea
                  value={terminationReason}
                  onChange={(e) => setTerminationReason(e.target.value)}
                  className="w-full input-field"
                  rows="2"
                  placeholder="e.g., Tenant requested early termination, lease violation, etc."
                />
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium text-neutral-900">Affected Tenants:</p>
                {selectedLease.tenants.filter(t => t.status === 'active').map((tenant) => (
                  <div key={tenant.tenant_id} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-900">{tenant.name}</span>
                    <span className={`ml-auto px-2 py-0.5 rounded text-xs font-semibold border ${getRoleColor(tenant.role)}`}>
                      {tenant.role === 'primary' ? 'PRIMARY' : 'ROOMMATE'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowTerminateModal(false);
                  setSelectedLease(null);
                  setTerminationDate('');
                }}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmCloseLease}
                disabled={!terminationDate}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Closure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lease Modal with Wizard */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-4 sm:px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900">Create New Lease</h2>
                <p className="text-xs sm:text-sm text-neutral-600">Step {currentStep} of 4</p>
              </div>
              <button
                onClick={closeLeaseModal}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Wizard Content */}
            <div className="p-4 sm:p-6">
              <LeaseWizard
                isOpen={showAddModal}
                currentStep={currentStep}
                formData={leaseFormData}
                setFormData={setLeaseFormData}
                handleNext={handleNext}
                handleBack={handleBack}
                handleSubmit={handleSubmitLease}
                closeModal={closeLeaseModal}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Leases;
