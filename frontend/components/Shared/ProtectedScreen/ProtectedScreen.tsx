import React, { useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../../context/Auth-context';

const ProtectedScreen = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [accessAllowed, setAccessAllowed] = useState(true);

  useEffect(() => {

    if (!auth.isLoggedIn) {
      Alert.alert('Unauthorized', 'You must be logged in to access this screen.');
      navigation.goBack();
      setAccessAllowed(false);
      return;
    }

    
    if (auth.authType === 'phone' && route.name === 'UserSettings') {
      Alert.alert('Access Restricted', 'You must upgrade your account to access this settings screen.');
      navigation.goBack();
      setAccessAllowed(false);
      return;
    }
  }, [auth.isLoggedIn, auth.authType, route.name]);

  if (!accessAllowed) return null;

  return <>{children}</>;
};

export default ProtectedScreen;
