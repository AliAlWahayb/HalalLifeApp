import React, { useState, useCallback } from 'react';


export const AuthContext = React.createContext({
  isLoggedIn: false,
  token: null,
  userId: null,
  authType: null, 
  name: null,
  email: null,
  login: (uid: string, token: string, authType?: string, name?: string, email?: string) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authType, setAuthType] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);

  const login = useCallback((uid, token, type = 'email', userName = null, userEmail = null) => {
    setToken(token);
    setUserId(uid);
    setAuthType(type);
    setName(userName);
    setEmail(userEmail);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setAuthType(null);
    setName(null);
    setEmail(null);
  }, []);

  const contextValue = {
    isLoggedIn: !!token,
    token,
    userId,
    authType,
    name,
    email,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
