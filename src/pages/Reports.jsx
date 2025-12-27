import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedYear, setSelectedYear] = useState('2025');

  const monthlyRevenue = [
    { month: 'January', revenue: 285000, expenses: 45000, profit: 240000 },
    { month: 'December', revenue: 275000, expenses: 42000, profit: 233000 },
    { month: 'November', revenue: 270000, expenses: 40000, profit: 230000 },
    { month: 'October', revenue: 268000, expenses: 41000, profit: 227000 },
  ];

  const buildingPerformance = [
    { building: 'Building A', totalRooms: 20, occupied: 16, revenue: 136000, occupancy: 80 },
    { building: 'Building B', totalRooms: 15, occupied: 12, revenue: 90000, occupancy: 80 },
    { building: 'Building C', totalRooms: 13, occupied: 10, revenue: 85000, occupancy: 77 },
  ];

  const paymentAnalysis = {
    onTime: 28,
    late: 7,
    pending: 3,
    total: 38
  };

  const topTenants = [
    { name: 'Ana Cruz', building: 'Building A', room: '303', totalPaid: 108000, months: 12 },
    { name: 'Maria Santos', building: 'Building A', room: '101', totalPaid: 102000, months: 12 },
    { name: 'Carlos Martinez', building: 'Building B', room: '401', totalPaid: 85000, months: 10 },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-neutral-900">Reports & Analytics</h2>
          <p className="text-neutral-600">Comprehensive insights into your properties</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === 'month'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPeriod('quarter')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === 'quarter'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Quarterly
            </button>
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === 'year'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Yearly
            </button>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-600">Total Revenue</h3>
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900">₱285,000</p>
          <p className="text-sm text-green-600 mt-1">+3.2% from last month</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-600">Total Expenses</h3>
            <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900">₱45,000</p>
          <p className="text-sm text-neutral-500 mt-1">Maintenance & utilities</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-600">Net Profit</h3>
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-accent-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900">₱240,000</p>
          <p className="text-sm text-green-600 mt-1">84.2% profit margin</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-600">Avg Occupancy</h3>
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900">79%</p>
          <p className="text-sm text-neutral-500 mt-1">38 of 48 rooms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Revenue Trend */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Revenue Trend</h3>
          <div className="space-y-4">
            {monthlyRevenue.map((item, index) => (
              <div key={item.month}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-neutral-700">{item.month}</span>
                  <span className="text-sm font-bold text-primary-600">₱{item.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${(item.revenue / 300000) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                  <span>Expenses: ₱{item.expenses.toLocaleString()}</span>
                  <span>Profit: ₱{item.profit.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Analysis */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Payment Analysis</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#e5e5e5"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#0038a8"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${(paymentAnalysis.onTime / paymentAnalysis.total) * 502.4} 502.4`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-neutral-900">
                  {Math.round((paymentAnalysis.onTime / paymentAnalysis.total) * 100)}%
                </span>
                <span className="text-sm text-neutral-600">On-time</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-600 rounded-full mr-2"></div>
                <span className="text-sm text-neutral-700">On-time Payments</span>
              </div>
              <span className="text-sm font-semibold text-neutral-900">{paymentAnalysis.onTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-accent-500 rounded-full mr-2"></div>
                <span className="text-sm text-neutral-700">Late Payments</span>
              </div>
              <span className="text-sm font-semibold text-neutral-900">{paymentAnalysis.late}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-secondary-500 rounded-full mr-2"></div>
                <span className="text-sm text-neutral-700">Pending</span>
              </div>
              <span className="text-sm font-semibold text-neutral-900">{paymentAnalysis.pending}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Building Performance */}
      <div className="card overflow-hidden mb-8">
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900">Building Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Building
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Total Rooms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Occupied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Occupancy Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Monthly Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {buildingPerformance.map((building) => (
                <tr key={building.building} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">{building.building}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">{building.totalRooms}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-primary-600 font-semibold">{building.occupied}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-neutral-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${building.occupancy}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-neutral-900">{building.occupancy}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-neutral-900">₱{building.revenue.toLocaleString()}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Tenants */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Top Tenants by Payment History</h3>
        <div className="space-y-4">
          {topTenants.map((tenant, index) => (
            <div key={tenant.name} className="flex items-center justify-between pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-accent-700 font-bold">#{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{tenant.name}</p>
                  <p className="text-sm text-neutral-500">{tenant.building} - Room {tenant.room}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-neutral-900">₱{tenant.totalPaid.toLocaleString()}</p>
                <p className="text-xs text-neutral-500">{tenant.months} months</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
