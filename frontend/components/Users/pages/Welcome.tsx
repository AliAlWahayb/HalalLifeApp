import { useNavigation } from '@react-navigation/native';
import { View, Text, ImageBackground, TouchableOpacity, Image } from 'react-native';

import FacebookImage from '../../../assets/Social/FacebookImge.png';
import GoogleImage from '../../../assets/Social/GoogleImge.png';
import WelcomeImge from '../../../assets/Welcome/WelcomeImge.png';
import Buttons from '../../Shared/components/FormElements/Buttons';

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={WelcomeImge}
      className="flex-1 items-center justify-center p-5"
      resizeMode="cover">
      <View className="absolute inset-0 bg-black opacity-50" />

      <TouchableOpacity
        onPress={() => navigation.getParent()?.navigate('Navigation')}
        className="absolute right-8 top-12  rounded-full bg-[#77C273] px-4 py-2">
        <Text className="text-1xl  font-bold text-white ">skip</Text>
      </TouchableOpacity>

      <View className="items-left fixed mb-28 flex flex-col">
        <Text className="text-6xl font-bold text-white">Welcome to </Text>
        <Text className="text-5xl font-bold text-green-500">HalalLife</Text>
        <Text className="ml-4 text-lg  font-bold text-gray-200">Your favourite Halal</Text>
        <Text className="mb-40 ml-4 text-lg font-bold text-gray-200">Community</Text>
      </View>

      <View className="flex flex-col items-center ">
        <Text className="text-1xl font-bold text-gray-400 ">Sign in with</Text>
      </View>

      <View className=" mt-4  flex-row">
        <TouchableOpacity className="flex flex-row items-center rounded-full bg-white px-6 py-4  ">
          <Image source={FacebookImage} className="mr-2 h-6 w-6" />
          <Text className="font-semibold text-black">Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity className="ml-20 flex flex-row items-center rounded-full bg-white px-6 py-4">
          <Image source={GoogleImage} className="mr-2 h-6 w-6" />
          <Text className="font-semibold text-black">Google</Text>
        </TouchableOpacity>
      </View>

      <View className="">
        <TouchableOpacity
          onPress={() => navigation.navigate('Registration', { isLogin: false })}
          className="m-4 rounded-full bg-black px-8 py-4">
          <Text className="text-lg font-semibold text-white">Start with email or phone</Text>
        </TouchableOpacity>
      </View>

      <Text className="mt-4 text-gray-300 ">
        {' '}
        Already have an account?
        <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
          <Text className="text-gray-400 underline ">Log In</Text>
        </TouchableOpacity>
      </Text>
    </ImageBackground>
  );
};

export default Welcome;
