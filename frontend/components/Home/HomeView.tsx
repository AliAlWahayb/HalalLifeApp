import { View, Text, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import React from 'react';
import Buttons from 'components/Shared/components/FormElements/AliButtons';
import Contributors from './Components/Contributors';

const contributorsData = [
  { index: 1, name: 'John Doe', contributions: 100 },
  { index: 2, name: 'Doe John', contributions: 10 },
  { index: 3, name: 'Jane Smith', contributions: 1 },
  { index: 4, name: 'Jane Smith', contributions: 1 },
  { index: 5, name: 'Jane Smith', contributions: 1 },
  { index: 6, name: 'Jane Smith', contributions: 1 },
];

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const HomeView = () => {
  return (
    <ScrollView className="flex-1 flex-col bg-white">
      <View className="flex flex-col items-center  py-5">
        <Text className="pb-2 text-center text-4xl font-bold text-[#5FCE59]">HalalLife</Text>
        <Image
          source={require('../../assets/Home/Home.png')}
          style={{
            width: '75%',
            height: undefined,
            aspectRatio: 1.5,
          }}
          placeholder={{ blurhash }}
          contentFit="contain"
        />
      </View>
      <View className="flex flex-col items-center gap-2 py-5">
        <Text className="text-center text-4xl font-bold text-[#5FCE59]">Fast Navigation</Text>
        <View className="flex flex-col items-center gap-5">
          <View className="flex flex-row  gap-5">
            <Buttons title="Scanner" onPress={() => {}} />
            <Buttons title="Liked" onPress={() => {}} />
          </View>
          <View className="flex flex-row gap-5">
            <Buttons title="Search" onPress={() => {}} />
            <Buttons title="History" onPress={() => {}} />
          </View>
        </View>
      </View>
      <View className="flex flex-col items-center gap-2 py-5">
        <Text className="text-center text-3xl font-bold text-[#5FCE59]">
          Contributors of the month
        </Text>
        <View className="flex flex-col gap-5">
          {contributorsData.map((contributor) => (
            <Contributors
              key={contributor.index}
              index={contributor.index}
              name={contributor.name}
              contributions={contributor.contributions}
              onPress={() => {
                console.log('Follow ' + contributor.name);
              }}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeView;

