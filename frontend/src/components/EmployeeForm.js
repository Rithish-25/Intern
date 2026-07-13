import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, User, Mail, Phone, Calendar, Briefcase, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

// Zod validation rules
const employeeFormSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().min(1, 'Email address is required').email('Invalid email address'),
  mobile: z.string().trim().regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  department: z.string().min(1, 'Please select a department'),
  designation: z.string().trim().min(1, 'Designation is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  status: z.enum(['Active', 'Inactive'], {
    invalid_type_error: 'Status must be Active or Inactive'
  })
});

const EmployeeForm = ({ 
  initialValues = {
    fullName: '',
    email: '',
    mobile: '',
    department: '',
    designation: '',
    joiningDate: '',
    status: 'Active'
  }, 
  onSubmit, 
  isSubmitting = false, 
  buttonText = 'Save Employee' 
}) => {
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: initialValues
  });

  const departments = ['Engineering', 'HR', 'Marketing', 'Sales', 'Finance', 'Design', 'Operations'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="form-employee">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <User className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="E.g. Sarah Connor"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                errors.fullName ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' : ''
              }`}
              {...register('fullName')}
            />
          </div>
          {errors.fullName && (
            <p className="flex items-center gap-1 mt-1 text-xs text-rose-500">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Mail className="w-5 h-5" />
            </span>
            <input
              type="email"
              placeholder="sarah.connor@company.com"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                errors.email ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' : ''
              }`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1 mt-1 text-xs text-rose-500">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Mobile Number (10 Digits)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Phone className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="9876543210"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                errors.mobile ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' : ''
              }`}
              {...register('mobile')}
            />
          </div>
          {errors.mobile && (
            <p className="flex items-center gap-1 mt-1 text-xs text-rose-500">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.mobile.message}
            </p>
          )}
        </div>

        {/* Department Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Department
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Briefcase className="w-5 h-5" />
            </span>
            <select
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer ${
                errors.department ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' : ''
              }`}
              {...register('department')}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          {errors.department && (
            <p className="flex items-center gap-1 mt-1 text-xs text-rose-500">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.department.message}
            </p>
          )}
        </div>

        {/* Designation */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Designation
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <FileText className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="E.g. Senior Frontend Engineer"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                errors.designation ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' : ''
              }`}
              {...register('designation')}
            />
          </div>
          {errors.designation && (
            <p className="flex items-center gap-1 mt-1 text-xs text-rose-500">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.designation.message}
            </p>
          )}
        </div>

        {/* Joining Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Joining Date
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Calendar className="w-5 h-5" />
            </span>
            <input
              type="date"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer ${
                errors.joiningDate ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' : ''
              }`}
              {...register('joiningDate')}
            />
          </div>
          {errors.joiningDate && (
            <p className="flex items-center gap-1 mt-1 text-xs text-rose-500">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.joiningDate.message}
            </p>
          )}
        </div>

        {/* Status selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Status
          </label>
          <div className="flex gap-4 mt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                value="Active"
                className="h-4.5 w-4.5 text-emerald-600 border-slate-350 focus:ring-emerald-500"
                {...register('status')}
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                value="Inactive"
                className="h-4.5 w-4.5 text-emerald-600 border-slate-350 focus:ring-emerald-500"
                {...register('status')}
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Inactive</span>
            </label>
          </div>
          {errors.status && (
            <p className="flex items-center gap-1 mt-1 text-xs text-rose-500">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.status.message}
            </p>
          )}
        </div>

      </div>

      {/* Action triggers */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-900/30">
        <Link
          to="/employees"
          className="px-5 py-3 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-sm font-semibold transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-50 dark:hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving record...' : buttonText}
        </button>
      </div>

    </form>
  );
};

export default EmployeeForm;
