import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // { uid, email, displayName }
  isAuthenticated: false,
  loading: true,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.loading = false;
    }
  }
});

export const { setUser, setToken, setLoading, clearAuth } = authSlice.actions;
export default authSlice.reducer;
