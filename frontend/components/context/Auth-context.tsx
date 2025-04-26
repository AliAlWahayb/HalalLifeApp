import React, { useState, useCallback, useEffect } from 'react';

export const AuthContext = React.createContext({
  isLoggedIn: false,
  token: null,
  userId: null,
  login: (uid: string, token: string) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = useCallback((uid, token) => {
    setToken(token);
    setUserId(uid);

  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    
  }, []);

  const contextValue = {
    isLoggedIn: !!token,
    token,
    userId,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
