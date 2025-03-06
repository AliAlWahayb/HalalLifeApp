import FontAwesome from '@expo/vector-icons/FontAwesome';
import Accordion from 'components/Shared/components/Accordion';
import { Image } from 'expo-image';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import ProductButtons from './Components/ProductButtons';

const data = [
  {
    title: 'Crunchy Peanut Butter Chocolate - Schogetten',
    img: require('../../assets/Products/image.png'),
    accordion: [
      {
        title: 'Details',
        number: 1,
      },
      {
        title: 'Additives',
        number: 1,
      },
      {
        title: 'Nutritional Facts',
        number: 1,
      },
    ],
  },
];

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const Halal = () => {
  const calculateFontSize = (text: string | any[]) => {
    const textLength = text.length;
    if (textLength < 20) return 'text-3xl'; // Larger font for short text
    if (textLength < 40) return 'text-2xl'; // Medium font for medium-length text
    return 'text-xl'; // Smaller font for long text
  };
  return (
    <ScrollView
      contentContainerStyle={{ alignItems: 'center' }}
      className="flex-1 flex-col  bg-white py-5 ">
      <View className="flex w-5/6 flex-col items-center justify-center rounded-3xl border-4 border-[#77C273] p-3">
        <View className="rounded-full bg-[#77C273] p-2">
          <FontAwesome name="check" size={48} color="white" />
        </View>
        <Text className="text-3xl font-bold text-[#77C273]">Halal</Text>
      </View>
      <View className="w-5/6 py-2">
        <View className="flex flex-col items-center">
          <Text
            className={`flex-wrap text-center ${calculateFontSize(data[0].title)} font-bold text-[#77C273]`}>
            {data[0].title}
          </Text>
          <Image
            source={data[0].img}
            placeholder={{ blurhash }}
            contentFit="contain"
            style={{ width: '50%', height: 150, aspectRatio: 1.5 }}
            alt="product image"
          />
        </View>
        <View className="flex flex-col py-5">
          {data[0].accordion.map((item, index) => (
            <Accordion key={index} title={item.title} number={item.number}>
              <View className="flex w-full items-center justify-center">
                <Text>Video</Text>
              </View>
            </Accordion>
          ))}
        </View>
      </View>
      <ProductButtons />
    </ScrollView>
  );
};

export default Halal;
