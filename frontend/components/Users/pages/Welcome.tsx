import { useNavigation } from '@react-navigation/native';
import { auth } from 'components/firebase/firebase-config';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useContext, useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, Alert } from 'react-native';

import FacebookImage from '../../../assets/Social/FacebookImge.png';
import GoogleImage from '../../../assets/Social/GoogleImge.png';
import WelcomeImge from '../../../assets/Welcome/WelcomeImge.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


import 'react-native-get-random-values'; // Import this for uuid to work in React Native
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from 'components/context/Auth-context';
import { signInAnonymously } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

// Define the key for storing the anonymous ID
const ANONYMOUS_ID_KEY = 'anonymous_user_id';

// Function to get or generate the anonymous ID
export const getAnonymousId = async () => {
  try {
    let anonymousId = await AsyncStorage.getItem(ANONYMOUS_ID_KEY);
    if (!anonymousId) {
      anonymousId = uuidv4();
      await AsyncStorage.setItem(ANONYMOUS_ID_KEY, anonymousId);
      console.log('Generated and stored new anonymous ID:', anonymousId);
    } else {
      console.log('Retrieved existing anonymous ID:', anonymousId);
    }
    return anonymousId;
  } catch (e) {
    console.error('Error getting or setting anonymous ID:', e);
    // Handle error appropriately, maybe return null or throw
    return null;
  }
};

const Welcome = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const authCtx = useContext(AuthContext); // Get the AuthContext

  // Handle the "skip" button press for anonymous login using Firebase Auth
  const HandleSkip = async () => {
    try {
      // Sign in anonymously using Firebase Authentication
      // Call signInAnonymously as a function with the auth instance
      const userCredential = await signInAnonymously(auth);
      const firebaseUser = userCredential.user;

      // Get the Firebase ID token for the anonymous user
      const token = await firebaseUser.getIdToken();

      // console.log('Firebase Anonymous User signed in:', firebaseUser.uid);

      // Use the auth context's login function to update the app's state
      // Pass the Firebase UID as the userId and the Firebase ID token
      // Set authType to 'anonymous'
      authCtx.login(firebaseUser.uid, token, 'anonymous');

      // Navigate to the main part of the app
      navigation.getParent()?.navigate('Navigation');
    } catch (error) {
      console.error('Error signing in anonymously with Firebase:', error);
      // Display a user-friendly error message
      Alert.alert(
        'Anonymous Login Failed',
        'Could not start anonymous session. Please try again later.'
      );
    }
  };

  // Facebook Login
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: '1070907185073532',
  });

  // Google Login
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    clientId: '497137676414-lvkl90tf2eqjoscbm9us0qo2oetc234l.apps.googleusercontent.com',
  });

  // Handle Facebook login response
  useEffect(() => {
    if (fbResponse?.type === 'success' && fbResponse.authentication) {
      (async () => {
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${fbResponse.authentication.accessToken}&fields=id,name,picture.type(large)`
        );
        const userInfo = await userInfoResponse.json();
        setUser(userInfo);
      })();
    }
  }, [fbResponse]);

  // Handle Google login response
  useEffect(() => {
    if (googleResponse?.type === 'success' && googleResponse.authentication) {
      fetch('http://127.0.0.1:8000/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleResponse.authentication.accessToken }),
      });
    }
  }, [googleResponse]);

  // Facebook login press
  const handleFacebookLogin = async () => {
    const result = await fbPromptAsync();
    if (result.type !== 'success') {
      alert('Uh oh, something went wrong');
    }
  };

  return (
    <ImageBackground
      source={WelcomeImge}
      className="flex-1 items-center justify-center p-5"
      resizeMode="cover">
      <View className="absolute inset-0 bg-black opacity-50" />

      <TouchableOpacity
        onPress={HandleSkip}
        className="absolute right-8 top-12 rounded-full bg-[#77C273] px-4 py-2">
        <Text className="text-1xl font-bold text-white">skip</Text>
      </TouchableOpacity>

      <View className="items-left fixed mb-28 flex flex-col">
        <Text className="text-6xl font-bold text-white">Welcome to </Text>
        <Text className="text-5xl font-bold text-green-500">HalalLife</Text>
        <Text className="ml-4 text-lg font-bold text-gray-200">Your favourite Halal</Text>
        <Text className="mb-40 ml-4 text-lg font-bold text-gray-200">Community</Text>
      </View>

      <View className="flex flex-col items-center">
        <Text className="text-1xl font-bold text-gray-400">Sign in with</Text>
      </View>

      <View className="mt-4 flex-row">
        <TouchableOpacity
          onPress={handleFacebookLogin}
          className="flex flex-row items-center rounded-full bg-white px-6 py-4">
          <Image source={FacebookImage} className="mr-2 h-6 w-6" />
          <Text className="font-semibold text-black">Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => googlePromptAsync()}
          className="ml-20 flex flex-row items-center rounded-full bg-white px-6 py-4">
          <Image source={GoogleImage} className="mr-2 h-6 w-6" />
          <Text className="font-semibold text-black">Google</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Registration', { isLogin: false })}
          className="m-4 rounded-full bg-black px-8 py-4">
          <Text className="text-lg font-semibold text-white">Start with email or phone</Text>
        </TouchableOpacity>
      </View>

      <Text className="mt-4 text-gray-300">
        Already have an account?{' '}
        <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
          <Text className="text-gray-400 underline">Log In</Text>
        </TouchableOpacity>
      </Text>
    </ImageBackground>
  );
};

export default Welcome;
