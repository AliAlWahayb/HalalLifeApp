import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth'; // Import necessary functions
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export const firebaseConfig = {
  apiKey: 'AIzaSyBX34UyroyxeDgDW9DXHSU92_Nc5FucIT4',
  authDomain: 'lifehalal-268df.firebaseapp.com',
  projectId: 'lifehalal-268df',
  storageBucket: 'lifehalal-268df.appspot.com',
  messagingSenderId: '497137676414',
  appId: '1:497137676414:web:d28c1d2445f8c85d98e82f',
  measurementId: 'G-V92M8M6S04',
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, auth, firebaseConfig };