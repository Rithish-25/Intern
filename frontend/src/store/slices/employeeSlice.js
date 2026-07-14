import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const fetchEmployees = createAsyncThunk(
  'employees/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { employees } = getState();
      const { page, limit, search, department, status, sortBy, sortOrder } = employees.filters;
      
      const response = await api.get('/employees', {
        params: { page, limit, search, department, status, sortBy, sortOrder }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to retrieve employees list');
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/create',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await api.post('/employees', employeeData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.response?.data?.errors || 'Failed to create employee profile');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, employeeData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/employees/${id}`, employeeData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.response?.data?.errors || 'Failed to update employee details');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/employees/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete employee profile');
    }
  }
);

const initialState = {
  list: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  },
  filters: {
    page: 1,
    limit: 10,
    search: '',
    department: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  loading: false,
  error: null,
  successMsg: null
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPageNum: (state, action) => {
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearStatus: (state) => {
      state.error = null;
      state.successMsg = null;
    },
    resetEmployeeState: (state) => {
      state.list = [];
      state.pagination = initialState.pagination;
      state.filters = initialState.filters;
      state.loading = false;
      state.error = null;
      state.successMsg = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees List
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.employees;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Employee
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = 'Employee profile created successfully.';
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = 'Employee profile updated successfully.';
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = 'Employee deleted successfully.';
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, setPageNum, resetFilters, clearStatus, resetEmployeeState } = employeeSlice.actions;
export default employeeSlice.reducer;
