import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateEmployee, clearStatus } from '../store/slices/employeeSlice';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';
import api from '../services/api';
import { PageLoader } from '../components/Loader';
import { ErrorState } from '../components/ErrorState';
import toast from 'react-hot-toast';

const EditEmployee = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, successMsg } = useSelector((state) => state.employees);

  const [employee, setEmployee] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const loadEmployeeDetails = async () => {
    setFetchLoading(true);
    setFetchError(null);
    try {
      const response = await api.get(`/employees/${id}`);
      setEmployee(response.data.data);
    } catch (err) {
      console.error(err);
      setFetchError(err.response?.data?.message || 'Failed to retrieve employee information.');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    loadEmployeeDetails();
  }, [id]);

  useEffect(() => {
    return () => dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (successMsg) {
      toast.success(successMsg);
      dispatch(clearStatus());
      navigate('/employees');
    }
    if (error) {
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
    dispatch(updateEmployee({ id, employeeData: data }));
  };

  if (fetchLoading) {
    return <PageLoader />;
  }

  if (fetchError) {
    return <ErrorState message={fetchError} onRetry={loadEmployeeDetails} />;
  }

  // Format the joiningDate into YYYY-MM-DD input standard
  const initialValues = {
    fullName: employee.fullName,
    email: employee.email,
    mobile: employee.mobile,
    department: employee.department,
    designation: employee.designation,
    joiningDate: employee.joiningDate ? employee.joiningDate.split('T')[0] : '',
    status: employee.status
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          Edit Employee
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Modify the active details of this employee profile.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-200/50 dark:border-slate-900/30">
        <EmployeeForm 
          initialValues={initialValues} 
          onSubmit={handleSubmit} 
          isSubmitting={loading} 
          buttonText="Update Employee" 
        />
      </div>
    </div>
  );
};

export default EditEmployee;
