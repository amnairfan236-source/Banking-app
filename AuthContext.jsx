import React, { createContext, useContext, useState } from 'react';
import { getCurrentUser, setCurrentUser, removeCurrentUser } from '../utils/localStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getCurrentUser());

  const login = (userData) => {
    setCurrentUser(userData);
    setUser(userData); // Naye user ko state mein set karein
  };

  const logout = () => {
    removeCurrentUser();
    setUser(null); // Logout par state bilkul null ho jaye
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);