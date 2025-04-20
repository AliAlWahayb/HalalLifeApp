import FontAwesome from '@expo/vector-icons/FontAwesome';
import Accordion from 'components/Shared/Accordion';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';

import ProductButtons from './Components/ProductButtons';

// Interfaces
interface AccordionItem {
  title: string;
  number: number;
}

interface ProductData {
  title: string;
  img: any;
  accordion: AccordionItem[];
}

// Constants
const data: ProductData[] = [
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

const Halal: React.FC = () => {
  const { theme } = useTheme();

  // Memoize the font size calculation to avoid unnecessary recalculations
  const titleFontSize = useMemo(() => {
    const textLength = data[0].title.length;
    if (textLength < 20) return 'text-3xl'; // Larger font for short text
    if (textLength < 40) return 'text-2xl'; // Medium font for medium-length text
    return 'text-xl'; // Smaller font for long text
  }, [data[0].title]);

  return (
    <ScrollView className="flex-1 bg-background py-5" contentContainerClassName="items-center">
      <View className="w-5/6 flex-col items-center justify-center rounded-3xl border-4 border-accent p-3">
        <View className="rounded-full bg-accent p-2">
          <FontAwesome name="check" size={48} color={theme.colors.textSecondary} />
        </View>
        <Text className="text-3xl font-bold text-accent">Halal</Text>
      </View>
      <View className="w-5/6 py-2">
        <View className="flex flex-col items-center">
          <Text className={`${titleFontSize} flex-wrap text-center font-bold text-accent`}>
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
