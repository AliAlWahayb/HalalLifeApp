import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Buttons from 'components/Shared/Buttons/Buttons';
import Profile from '../Profile';


const ProfileCard = ({
  name,
  location,
  bio,
  followers,
  following,
  photos,
  img,
}: {
  name: string;
  location: string;
  bio: string;
  followers: number;
  following: number;
  photos: number;
  img: any;
}) => {
  return (
    <View className=" bg-white items-center pt-32 pb-8 px-4 relative ">
      
      <View className="absolute -top-1 mt-2">
        <Image
          source={img}
          contentFit="cover"
          style={{ width: 120, height: 120, borderRadius: 9999 }}
        />
      </View>

      <Text className='text-xl font-bold text-gray-800 mt-6'>{name}</Text>
      <Text className='text-sm text-gray-400'>{location}</Text>
      <Text className='mt-4 text-center text-gray-600'>{bio}</Text>

      <View className='flex-row justify-around w-full mt-6 px-4'>
        <View className='items-center'>
            <Text className='text-lg font-bold text-gray-700'>{followers}</Text>
            <Text className='text-xs text-gray-400'>Followers</Text>
        </View>

        <View className='items-center'>
            <Text className='text-lg font-bold text-gray-700'>{photos}</Text>
            <Text className='text-xs text-gray-400'>Photos</Text>
        </View>

        <View className='items-center'>
            <Text className='text-lg font-bold text-gray-700'>{following}</Text>
            <Text className='text-xs text-gray-400'>Following</Text>
        </View>
      </View>

      </View>
      )
    };
    
    export default ProfileCard;
  