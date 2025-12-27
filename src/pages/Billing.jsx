import React, { useState, useEffect } from 'react';
import BillingWizard from '../components/BillingWizard';
import ConfirmDialog from '../components/ConfirmDialog';

const Billing = () => {
  const [bills, setBills] = useState([
    {
      id: '1',
      building: 'Building A',
      room: '101',
      tenant: 'Juan Dela Cruz',
      billMonth: '2025-01',
      electricPrevReading: '1200',
      electricCurrReading: '1350',
      electricUnits: '150',
      electricRate: '12.50',
      electricCost: '1875.00',
      waterPrevReading: '450',
      waterCurrReading: '480',
      waterUnits: '30',
      waterRate: '25.00',
      waterCost: '750.00',
      rent: '8500',
      maintenanceFee: '500',
      otherCharges: '0',
      totalAmount: '11625.00',
      status: 'paid',
      paidDate: '2025-01-15',
      attachments: []
    },
    {
      id: '2',
      building: 'Building A',
      room: '102',
      tenant: 'Maria Santos',
      billMonth: '2025-01',
      electricPrevReading: '980',
      electricCurrReading: '1120',
      electricUnits: '140',
      electricRate: '12.50',
      electricCost: '1750.00',
      waterPrevReading: '320',
      waterCurrReading: '345',
      waterUnits: '25',
      waterRate: '25.00',
      waterCost: '625.00',
      rent: '8500',
      maintenanceFee: '500',
      otherCharges: '200',
      totalAmount: '11575.00',
      status: 'unpaid',
      paidDate: '',
      attachments: []
    },
    {
      id: '3',
      building: 'Building B',
      room: '201',
      tenant: 'Pedro Garcia',
      billMonth: '2024-12',
      electricPrevReading: '2100',
      electricCurrReading: '2280',
      electricUnits: '180',
      electricRate: '12.50',
      electricCost: '2250.00',
      waterPrevReading: '670',
      waterCurrReading: '705',
      waterUnits: '35',
      waterRate: '25.00',
      waterCost: '875.00',
      rent: '10000',
      maintenanceFee: '500',
      otherCharges: '0',
      totalAmount: '13625.00',
      status: 'overdue',
      paidDate: '',
      attachments: []
    }
  ]);

  const [filteredBills, setFilteredBills] = useState(bills);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Calculate stats
  const totalBilled = bills.reduce((sum, bill) => sum + parseFloat(bill.totalAmount), 0);
  const totalCollected = bills.filter(b => b.status === 'paid').reduce((sum, bill) => sum + parseFloat(bill.totalAmount), 0);
  const outstanding = totalBilled - totalCollected;

  // Filter bills based on search and status
  useEffect(() => {
    let filtered = bills;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bill => bill.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(bill =>
        bill.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.building.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBills(filtered);
  }, [bills, searchTerm, statusFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  const handleAddBill = () => {
    setIsEditing(false);
    setEditingBill(null);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleEditBill = (bill) => {
    setIsEditing(true);
    setEditingBill(bill);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleDeleteBill = (bill) => {
    setBillToDelete(bill);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    setBills(bills.filter(b => b.id !== billToDelete.id));
    setBillToDelete(null);
  };

  const handleMarkAsPaid = (billId) => {
    setBills(bills.map(bill =>
      bill.id === billId
        ? { ...bill, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
        : bill
    ));
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingBill(null);
    document.body.style.overflow = 'auto';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Paid</span>;
      case 'unpaid':
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-accent-100 text-accent-800">Unpaid</span>;
      case 'overdue':
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-secondary-100 text-secondary-800">Overdue</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-800">{status}</span>;
    }
  };

  const formatCurrency = (amount) => {
    return `₱${parseFloat(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMonth = (dateString) => {
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 mb-2">
          Billing & Utilities
        </h1>
        <p className="text-neutral-600">Manage monthly utility bills and rent collection</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card bg-gradient-to-br from-primary-50 to-white border-primary-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-neutral-600 mb-1">Total Billed</p>
              <p className="text-xl sm:text-2xl font-bold text-primary-700">{formatCurrency(totalBilled)}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-white border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-neutral-600 mb-1">Total Collected</p>
              <p className="text-xl sm:text-2xl font-bold text-green-700">{formatCurrency(totalCollected)}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-secondary-50 to-white border-secondary-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-neutral-600 mb-1">Outstanding</p>
              <p className="text-xl sm:text-2xl font-bold text-secondary-700">{formatCurrency(outstanding)}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary-100 flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Status Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                statusFilter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                statusFilter === 'paid'
                  ? 'bg-green-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setStatusFilter('unpaid')}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                statusFilter === 'unpaid'
                  ? 'bg-accent-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Unpaid
            </button>
            <button
              onClick={() => setStatusFilter('overdue')}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                statusFilter === 'overdue'
                  ? 'bg-secondary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Overdue
            </button>
          </div>

          {/* Search and Add */}
          <div className="flex gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Search tenant, room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={handleAddBill}
              className="btn-primary whitespace-nowrap"
            >
              <span className="hidden sm:inline">Add Bill</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Building/Room
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Bill Month
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Electric
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Water
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-neutral-500">
                    No bills found
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-neutral-900">{bill.building}</div>
                      <div className="text-xs text-neutral-500">Room {bill.room}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-900">{bill.tenant}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700">{formatMonth(bill.billMonth)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-sm font-medium text-neutral-900">{formatCurrency(bill.electricCost)}</div>
                      <div className="text-xs text-neutral-500">{bill.electricUnits} kWh</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-sm font-medium text-neutral-900">{formatCurrency(bill.waterCost)}</div>
                      <div className="text-xs text-neutral-500">{bill.waterUnits} m³</div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-neutral-900">
                      {formatCurrency(bill.totalAmount)}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(bill.status)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === bill.id ? null : bill.id);
                          }}
                          className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5 text-neutral-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {openMenuId === bill.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)}></div>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20">
                              <button
                                onClick={() => {
                                  handleEditBill(bill);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit Bill
                              </button>

                              {bill.status !== 'paid' && (
                                <button
                                  onClick={() => {
                                    handleMarkAsPaid(bill.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Mark as Paid
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  handleDeleteBill(bill);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-secondary-700 hover:bg-secondary-50 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Bill
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Bill Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-neutral-200">
              <h2 className="text-lg sm:text-xl font-display font-bold text-neutral-900">
                {isEditing ? 'Edit Bill' : 'Add New Bill'}
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: Implement form submission
                closeModal();
              }}
            >
              <BillingWizard
                closeModal={closeModal}
                isEditing={isEditing}
                editingBill={editingBill}
                bills={bills}
                setBills={setBills}
              />
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Bill"
        message={`Are you sure you want to delete the bill for ${billToDelete?.tenant} (${billToDelete?.building} - Room ${billToDelete?.room})? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Billing;
