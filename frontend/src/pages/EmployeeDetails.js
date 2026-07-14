import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { PageLoader } from '../components/Loader';
import { ErrorState } from '../components/ErrorState';
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  Calendar, 
  Phone, 
  Mail, 
  Briefcase, 
  ShieldAlert, 
  Clock, 
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ConfirmationModal } from '../components/Modal';
import toast from 'react-hot-toast';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/employees/${id}`);
      setEmployee(response.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to retrieve employee information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/employees/${id}`);
      toast.success('Employee profile deleted successfully.');
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete employee profile.');
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDetails} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      
      {/* Back navigation */}
      <div>
        <Link
          to="/employees"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </Link>
      </div>

      {/* Main card */}
      <div className="glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-900/30 overflow-hidden shadow-sm">
        
        {/* Header Profile Banner */}
        <div className="px-8 py-10 bg-gradient-to-r from-emerald-600/10 to-teal-650/10 dark:from-emerald-500/5 dark:to-teal-500/5 border-b border-slate-200/50 dark:border-slate-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold text-2xl flex items-center justify-center shadow-sm">
              {employee.fullName ? employee.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'E'}
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-extrabold text-slate-800 dark:text-slate-100">{employee.fullName}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{employee.designation}</p>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-3">
            <Link
              to={`/employees/${id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-350 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit Details
            </Link>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Profile
            </button>
          </div>
        </div>

        {/* Detailed Metrics Panel */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Core Info */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Information</h3>
            
            <div className="space-y-4">
              {/* Department */}
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-505 dark:text-slate-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{employee.department}</span>
                </div>
              </div>

              {/* Joining Date */}
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-505 dark:text-slate-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Joining</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {employee.joiningDate ? format(new Date(employee.joiningDate), 'MMMM dd, yyyy') : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-505 dark:text-slate-400">
                  {employee.status === 'Active' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-500" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                  <span className={`inline-flex items-center px-2 py-0.5 mt-0.5 rounded-full text-xs font-bold ${
                    employee.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                  }`}>
                    {employee.status}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact & Metadata */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact & History</h3>

            <div className="space-y-4">
              {/* Email Address */}
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-505 dark:text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                  <a href={`mailto:${employee.email}`} className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 hover:underline">
                    {employee.email}
                  </a>
                </div>
              </div>

              {/* Mobile Phone */}
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-505 dark:text-slate-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Mobile Phone</span>
                  <a href={`tel:${employee.mobile}`} className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 hover:underline">
                    {employee.mobile}
                  </a>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-505 dark:text-slate-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Last Modified</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {employee.updatedAt ? format(new Date(employee.updatedAt), 'PPp') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Delete Confirmation Dialog Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Employee Profile"
        message="Are you sure you want to remove this employee profile from the active registry? This will permanently delete the record from the database."
        confirmText="Confirm Delete"
        loading={deleteLoading}
      />

    </div>
  );
};

export default EmployeeDetails;
