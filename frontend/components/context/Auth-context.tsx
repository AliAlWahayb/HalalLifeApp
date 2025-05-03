import React, { useState, useCallback, useEffect } from 'react'; // Import useEffect
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Define the key for storing authentication data
const AUTH_STORAGE_KEY = 'authData';

// Define the shape of the AuthContext
export const AuthContext = React.createContext({
  isLoggedIn: false,
  token: null,
  userId: null,
  authType: null,
  name: null,
  email: null,
  // Login function signature updated to match usage
  login: (uid: string, token: string, authType?: string, name?: string, email?: string) => {},
  logout: () => {},
});

// AuthProvider component to wrap your app and provide the context
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authType, setAuthType] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true); // State to track if auth is being loaded

  // Function to load authentication data from AsyncStorage on app start
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedAuthData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (storedAuthData) {
          const { userId, token, authType, name, email } = JSON.parse(storedAuthData);
          setUserId(userId);
          setToken(token);
          setAuthType(authType);
          setName(name);
          setEmail(email);
        }
      } catch (error) {
      } finally {
        setIsInitializing(false); // Mark initialization as complete
      }
    };

    loadAuthData();
  }, []); // Run only once on component mount

  // Login function to update the state and persist data
  const login = useCallback(
    async (uid, token, type = 'email', userName = null, userEmail = null) => {
      setToken(token);
      setUserId(uid);
      setAuthType(type);
      setName(userName);
      setEmail(userEmail);

      // Persist the login state to AsyncStorage
      try {
        const authData = JSON.stringify({
          userId: uid,
          token,
          authType: type,
          name: userName,
          email: userEmail,
        });
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, authData);
      } catch (error) {
      }
    },
    []
  );

  // Logout function to clear the state and remove data from storage
  const logout = useCallback(async () => {
    // Make logout async
    setToken(null);
    setUserId(null);
    setAuthType(null);
    setName(null);
    setEmail(null);

    // Clear persisted login state from AsyncStorage
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      console.log('Removed auth data from storage.');
    } catch (error) {
      console.error('Failed to remove auth data from storage:', error);
    }
  }, []);

  // Value provided to consumers of the context
  const contextValue = {
    isLoggedIn: !!token, // Determine login status based on token presence
    token,
    userId,
    authType,
    name,
    email,
    login,
    logout,
  };

  // Optionally, you might render a loading indicator while initializing
  if (isInitializing) {
    return null; // Or a loading spinner component
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
