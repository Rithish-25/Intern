import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';
import { Spinner, Skeleton } from '../components/Loader';
import { ErrorState } from '../components/ErrorState';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { cards, charts, recentEmployees, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const loadData = () => {
    dispatch(fetchDashboardStats());
  };

  if (loading && !cards.total) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  // Formatting status data for Donut Chart
  const statusData = charts.status.map(item => ({
    name: item.name,
    value: item.value
  }));

  // Render Dashboard
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Real-time metrics, analytics, and recent activity logs.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-panel p-6 rounded-2xl shadow-sm flex items-center gap-5 border border-slate-200/50 dark:border-slate-900/30"
        >
          <div className="p-4 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Employees</span>
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">{cards.total}</span>
          </div>
        </motion.div>

        {/* Active Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-panel p-6 rounded-2xl shadow-sm flex items-center gap-5 border border-slate-200/50 dark:border-slate-900/30"
        >
          <div className="p-4 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Active Staff</span>
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">{cards.active}</span>
          </div>
        </motion.div>

        {/* Inactive Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-panel p-6 rounded-2xl shadow-sm flex items-center gap-5 border border-slate-200/50 dark:border-slate-900/30"
        >
          <div className="p-4 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-455">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Inactive Staff</span>
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">{cards.inactive}</span>
          </div>
        </motion.div>
      </div>

      {/* Chart Layout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Distribution Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/50 dark:border-slate-900/30">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6">
            Employees by Department
          </h3>
          <div className="h-72">
            {charts.department.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.department} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.08)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(15, 23, 42, 0.9)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-450">
                No department records available
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/50 dark:border-slate-900/30">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6">
            Status Distribution
          </h3>
          <div className="h-72 flex items-center justify-center">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === 'Active' ? '#10b981' : '#f43f5e'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(15, 23, 42, 0.9)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-450">
                No status data available
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Recent Employees Table */}
      <div className="glass-panel rounded-2xl border border-slate-200/50 dark:border-slate-900/30 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200/50 dark:border-slate-900/30 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Recently Added Employees
          </h3>
          <Link
            to="/employees"
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-450 hover:text-emerald-700 flex items-center gap-1 hover:underline"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {recentEmployees.length > 0 ? (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100/40 dark:bg-slate-900/20 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Designation</th>
                  <th className="px-6 py-4">Joining Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-900/30">
                {recentEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-100/10 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{emp.fullName}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{emp.department}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{emp.designation}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {format(new Date(emp.joiningDate), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 flex justify-center">
                      <span className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-bold ${
                        emp.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No employee records created yet.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
