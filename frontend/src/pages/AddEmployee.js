import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployee, clearStatus } from '../store/slices/employeeSlice';
import { useNavigate } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';
import toast from 'react-hot-toast';

const AddEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMsg } = useSelector((state) => state.employees);

  // Clear state on unmount
  useEffect(() => {
    return () => dispatch(clearStatus());
  }, [dispatch]);

  // Track operation feedback
  useEffect(() => {
    if (successMsg) {
      toast.success(successMsg);
      dispatch(clearStatus());
      navigate('/employees');
    }
    if (error) {
      // If error is an object (validation errors), we handle it.
      if (typeof error === 'object') {
        const firstErrField = Object.keys(error)[0];
        toast.error(`${firstErrField}: ${error[firstErrField][0]}`);
      } else {
        toast.error(error);
      }
      dispatch(clearStatus());
    }
  }, [successMsg, error, dispatch, navigate]);

  const handleSubmit = (data) => {
    dispatch(createEmployee(data));
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          Add Employee
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Register a new team member in the employee database registry.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-200/50 dark:border-slate-900/30">
        <EmployeeForm 
          onSubmit={handleSubmit} 
          isSubmitting={loading} 
          buttonText="Add Employee" 
        />
      </div>
    </div>
  );
};

export default AddEmployee;
