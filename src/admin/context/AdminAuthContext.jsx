import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('adminToken');
    if (token) {
      // TODO: Validate token with backend
      setIsAuthenticated(true);
      setUser({ username: 'admin' });
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    // Mock login - will be replaced with real API call
    if (username === 'admin' && password === 'admin123') {
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('adminToken', mockToken);
      setIsAuthenticated(true);
      setUser({ username });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};