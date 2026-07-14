import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchEmployees, 
  deleteEmployee, 
  setFilters, 
  setPageNum, 
  resetFilters, 
  clearStatus 
} from '../store/slices/employeeSlice';
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender 
} from '@tanstack/react-table';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Eye, 
  Pencil, 
  Trash2, 
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../components/Modal';
import { Spinner, Skeleton } from '../components/Loader';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { list, pagination, filters, loading, error, successMsg } = useSelector((state) => state.employees);

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Trigger search on input change
  const [searchTerm, setSearchTerm] = useState(filters.search);

  // Available departments for filtering
  const departments = ['Engineering', 'HR', 'Marketing', 'Sales', 'Finance', 'Design', 'Operations'];

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch, filters.page, filters.search, filters.department, filters.status, filters.sortBy, filters.sortOrder]);

  // Handle local search input debounce or submit
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(setFilters({ search: searchTerm }));
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch]);

  useEffect(() => {
    if (successMsg) {
      toast.success(successMsg);
      dispatch(clearStatus());
      dispatch(fetchEmployees()); // Reload list
    }
    if (error) {
      toast.error(error);
      dispatch(clearStatus());
    }
  }, [successMsg, error, dispatch]);

  const handleSort = (field) => {
    const isAsc = filters.sortBy === field && filters.sortOrder === 'asc';
    dispatch(setFilters({
      sortBy: field,
      sortOrder: isAsc ? 'desc' : 'asc'
    }));
  };

  const handleSortChange = (value) => {
    if (value === 'default') {
      dispatch(setFilters({ sortBy: 'createdAt', sortOrder: 'desc' }));
    } else if (value === 'joiningDate-asc') {
      dispatch(setFilters({ sortBy: 'joiningDate', sortOrder: 'asc' }));
    } else if (value === 'joiningDate-desc') {
      dispatch(setFilters({ sortBy: 'joiningDate', sortOrder: 'desc' }));
    } else if (value === 'status') {
      dispatch(setFilters({ sortBy: 'status', sortOrder: 'asc' }));
    }
  };

  const getSortValue = () => {
    if (filters.sortBy === 'createdAt') return 'default';
    if (filters.sortBy === 'status') return 'status';
    if (filters.sortBy === 'joiningDate' && filters.sortOrder === 'asc') return 'joiningDate-asc';
    return 'joiningDate-desc';
  };

  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await dispatch(deleteEmployee(deleteId)).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    dispatch(resetFilters());
  };

  const getSortIcon = (field) => {
    if (filters.sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />;
    }
    return filters.sortOrder === 'asc' 
      ? <ArrowUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
      : <ArrowDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />;
  };

  // TanStack Table setup
  const columns = useMemo(() => [
    {
      accessorKey: 'fullName',
      header: () => (
        <button 
          onClick={() => handleSort('fullName')} 
          className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-100 font-semibold whitespace-nowrap"
        >
          Full Name {getSortIcon('fullName')}
        </button>
      ),
      cell: (info) => <span className="font-semibold text-slate-800 dark:text-slate-200">{info.getValue()}</span>
    },
    {
      accessorKey: 'email',
      header: () => (
        <button 
          onClick={() => handleSort('email')} 
          className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-100 font-semibold whitespace-nowrap"
        >
          Email {getSortIcon('email')}
        </button>
      ),
      cell: (info) => <span className="text-slate-600 dark:text-slate-400">{info.getValue()}</span>
    },
    {
      accessorKey: 'department',
      header: () => (
        <button 
          onClick={() => handleSort('department')} 
          className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-100 font-semibold whitespace-nowrap"
        >
          Department {getSortIcon('department')}
        </button>
      ),
      cell: (info) => <span className="text-slate-655 dark:text-slate-400">{info.getValue()}</span>
    },
    {
      accessorKey: 'designation',
      header: () => (
        <button 
          onClick={() => handleSort('designation')} 
          className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-100 font-semibold whitespace-nowrap"
        >
          Designation {getSortIcon('designation')}
        </button>
      ),
      cell: (info) => <span className="text-slate-655 dark:text-slate-400">{info.getValue()}</span>
    },
    {
      accessorKey: 'joiningDate',
      header: () => (
        <button 
          onClick={() => handleSort('joiningDate')} 
          className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-100 font-semibold whitespace-nowrap"
        >
          Joining Date {getSortIcon('joiningDate')}
        </button>
      ),
      cell: (info) => <span className="text-slate-600 dark:text-slate-400 whitespace-nowrap">{format(new Date(info.getValue()), 'MMM dd, yyyy')}</span>
    },
    {
      accessorKey: 'status',
      header: () => (
        <button 
          onClick={() => handleSort('status')} 
          className="flex items-center justify-center w-full gap-1 hover:text-slate-800 dark:hover:text-slate-100 font-semibold whitespace-nowrap"
        >
          Status {getSortIcon('status')}
        </button>
      ),
      cell: (info) => {
        const val = info.getValue();
        return (
          <div className="flex justify-center">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
              val === 'Active' 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
            }`}>
              {val}
            </span>
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: () => <span className="flex justify-center">Actions</span>,
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex justify-center items-center gap-1.5">
            <button
              onClick={() => navigate(`/employees/${row._id}`)}
              className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => navigate(`/employees/${row._id}/edit`)}
              className="p-2 text-slate-550 hover:text-slate-750 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Edit Profile"
            >
              <Pencil className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => handleOpenDelete(row._id)}
              className="p-2 text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
              title="Delete Profile"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>
        );
      }
    }
  ], [filters, navigate]);

  const table = useReactTable({
    data: list,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Employee Directory
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Displaying corporate staff records database.
          </p>
        </div>
        <Link
          to="/employees/add"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold text-sm shadow-md shadow-emerald-600/10 transition-all hover:shadow-lg flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </Link>
      </div>

      {/* Query Filters Control Panel */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-slate-900/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by employee name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Selection Grid */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Filter */}
          <div className="relative">
            <select
              value={filters.department}
              onChange={(e) => dispatch(setFilters({ department: e.target.value }))}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer min-w-[140px]"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-450 pointer-events-none">
              <Filter className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer min-w-[130px]"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-450 pointer-events-none">
              <Filter className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Sort Option Dropdown */}
          <div className="relative">
            <select
              value={getSortValue()}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer min-w-[140px]"
            >
              <option value="default">Sort: Default</option>
              <option value="joiningDate-asc">Sort: Asc</option>
              <option value="joiningDate-desc">Sort: Des</option>
              <option value="status">Sort: Status</option>
            </select>
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-450 pointer-events-none">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Reset Filters */}
          <button
            onClick={handleReset}
            className="p-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 text-sm font-semibold"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Employee Table Viewport */}
      {loading ? (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/50 dark:border-slate-900/30 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : list.length > 0 ? (
        <div className="glass-panel rounded-2xl border border-slate-200/50 dark:border-slate-900/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="bg-slate-100/40 dark:bg-slate-900/20 border-b border-slate-200/50 dark:border-slate-900/30 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-6 py-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-900/30">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-100/10 dark:hover:bg-slate-900/10 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Navigation Controller */}
          <div className="px-6 py-4 bg-slate-100/10 dark:bg-slate-900/10 border-t border-slate-200/50 dark:border-slate-900/30 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing page <strong>{pagination.page}</strong> of <strong>{pagination.pages || 1}</strong> ({pagination.total} records)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1 || loading}
                onClick={() => dispatch(setPageNum(pagination.page - 1))}
                className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-105 dark:hover:bg-slate-900 transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
              <button
                disabled={pagination.page >= pagination.pages || loading}
                onClick={() => dispatch(setPageNum(pagination.page + 1))}
                className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-105 dark:hover:bg-slate-900 transition-colors disabled:opacity-40"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Delete Confirmation Overlay Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Employee Profile"
        message="Are you sure you want to remove this employee profile from the active registry? This will permanently delete the record from the database."
        confirmText="Confirm Delete"
        loading={deleteLoading}
      />

    </div>
  );
};

export default EmployeeList;
