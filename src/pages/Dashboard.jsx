import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
  const stats = [
    {
      name: 'Total Buildings',
      value: '12',
      change: '+2 this month',
      trend: 'up',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      color: 'primary'
    },
    {
      name: 'Total Rooms',
      value: '48',
      change: '38 occupied',
      trend: 'neutral',
      icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z',
      color: 'accent'
    },
    {
      name: 'Active Tenants',
      value: '38',
      change: '79% occupancy',
      trend: 'up',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      color: 'primary'
    },
    {
      name: 'Monthly Revenue',
      value: '₱285,000',
      change: '+12% from last month',
      trend: 'up',
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
      color: 'secondary'
    }
  ];

  const recentPayments = [
    { id: 1, tenant: 'Maria Santos', building: 'Building A', room: '101', amount: '₱8,500', date: '2025-12-26', status: 'paid' },
    { id: 2, tenant: 'Jose Reyes', building: 'Building B', room: '205', amount: '₱7,200', date: '2025-12-25', status: 'paid' },
    { id: 3, tenant: 'Ana Cruz', building: 'Building A', room: '303', amount: '₱9,000', date: '2025-12-24', status: 'paid' },
    { id: 4, tenant: 'Pedro Garcia', building: 'Building C', room: '102', amount: '₱6,800', date: '2025-12-20', status: 'pending' },
  ];

  const upcomingDues = [
    { id: 1, tenant: 'Carlos Martinez', building: 'Building B', room: '401', amount: '₱8,500', dueDate: '2025-12-28' },
    { id: 2, tenant: 'Linda Fernandez', building: 'Building A', room: '204', amount: '₱7,500', dueDate: '2025-12-29' },
    { id: 3, tenant: 'Rico Tan', building: 'Building C', room: '306', amount: '₱9,200', dueDate: '2025-12-30' },
  ];

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-neutral-900 mb-2">
          Welcome back! 👋
        </h2>
        <p className="text-neutral-600">
          Here's what's happening with your properties today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <svg className={`w-6 h-6 text-${stat.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              {stat.trend === 'up' && (
                <span className="text-green-600 text-sm">↑</span>
              )}
            </div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">{stat.name}</h3>
            <p className="text-2xl font-bold text-neutral-900 mb-2">{stat.value}</p>
            <p className="text-xs text-neutral-500">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Payments */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Recent Payments</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{payment.tenant}</p>
                  <p className="text-sm text-neutral-500">
                    {payment.building} - Room {payment.room}
                  </p>
                  <p className="text-xs text-neutral-400">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neutral-900">{payment.amount}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-accent-100 text-accent-700'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Dues */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Upcoming Dues</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {upcomingDues.map((due) => (
              <div key={due.id} className="flex items-center justify-between pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{due.tenant}</p>
                  <p className="text-sm text-neutral-500">
                    {due.building} - Room {due.room}
                  </p>
                  <p className="text-xs text-neutral-400">Due: {due.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neutral-900">{due.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="card p-6 text-center hover:shadow-lg transition-shadow group">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 transition-colors">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h4 className="font-medium text-neutral-900">Add Building</h4>
        </button>

        <button className="card p-6 text-center hover:shadow-lg transition-shadow group">
          <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-accent-200 transition-colors">
            <svg className="w-6 h-6 text-accent-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h4 className="font-medium text-neutral-900">Add Room</h4>
        </button>

        <button className="card p-6 text-center hover:shadow-lg transition-shadow group">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 transition-colors">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h4 className="font-medium text-neutral-900">Add Tenant</h4>
        </button>

        <button className="card p-6 text-center hover:shadow-lg transition-shadow group">
          <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary-200 transition-colors">
            <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h4 className="font-medium text-neutral-900">Collect Rent</h4>
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
