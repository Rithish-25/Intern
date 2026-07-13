import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeDetails from './pages/EmployeeDetails';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Authentication Views (Blocked for signed in sessions) */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* Secure Dashboard View Layouts */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employees" element={<EmployeeList />} />
                <Route path="/employees/add" element={<AddEmployee />} />
                <Route path="/employees/:id" element={<EmployeeDetails />} />
                <Route path="/employees/:id/edit" element={<EditEmployee />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Generic Page Fallbacks */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        
        {/* Global Toast configurations */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              borderRadius: '16px',
              fontSize: '14px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '12px 16px'
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#f8fafc'
              }
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f8fafc'
              }
            }
          }}
        />
      </AuthProvider>
    </Provider>
  );
}

export default App;
