import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';

import ProductButtons from './Components/ProductButtons';
import Nutritional from './Components/Nutritional';
import Additives from './Components/Additives';
import Ingredients from './Components/Ingredients';
import Details from './Components/Details';
import Hero from './Components/Hero';
import AlternativeCarousel from 'components/Shared/Carousel/AlternativeCarousel';
import Why from './Components/Why';

// Interfaces
interface ProductData {
  code: string;
  product: {
    countries: string;
    origins: string;
    generic_name: string;
    product_name_en: string;
    brands: string;
    brands_tags: string[];
    quantity: string;
    allergens_hierarchy: string[];
    allergens_tags: string[];
    labels_tags: string[];
    additives_tags: string[];
    nutriments: {
      [key: string]: number | string;
    };
    selected_images: {
      front: {
        display: { [key: string]: string };
        small: { [key: string]: string };
        thumb: { [key: string]: string };
      };
    };
    nutriscore_grade: string;
    nova_groups_tags: string[];
    ingredients_analysis_tags: string[];
    ingredients: {
      text: string;
      percent_estimate?: number;
      ingredients?: {
        text: string;
        percent_estimate?: number;
      }[];
    }[];
  };
}

const Haram: React.FC<{ productData: ProductData }> = ({ productData }) => {
  const { theme } = useTheme();
  const { product } = productData;

  const alternatives = [
    {
      title: 'Crunchy Peanut Butter Chocolate - Schogetten',
      img: require('../../assets/Products/image.png'),
    },
    {
      title: 'Crunchy Peanut Butter Chocolate - Schogetten',
      img: require('../../assets/Products/image.png'),
    },
    {
      title: 'Crunchy Peanut Butter Chocolate - Schogetten',
      img: require('../../assets/Products/image.png'),
    },
    {
      title: 'Crunchy Peanut Butter Chocolate - Schogetten',
      img: require('../../assets/Products/image.png'),
    },
    {
      title: 'Crunchy Peanut Butter Chocolate - Schogetten',
      img: require('../../assets/Products/image.png'),
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background py-5" contentContainerClassName="items-center">
      <View className="w-5/6 flex-col items-center justify-center rounded-3xl border-4 border-Haram p-3">
        <View className="rounded-full bg-Haram p-2">
          <FontAwesome name="check" size={48} color={theme.colors.textSecondary} />
        </View>
        <Text className="text-3xl font-bold text-Haram">Haram</Text>
      </View>
      <View className="w-5/6 py-2">
        <Hero product={product} />
        <View className="flex flex-col py-5">
          <Details product={product} />

          <Ingredients product={product} />

          <Additives product={product} />

          <Nutritional product={product} />

          <Why product={product} />
        </View>
      </View>
      <View className="mb-5 flex h-36 w-full flex-col gap-3 ">
        <Text className="text-center text-2xl font-bold">Alternatives</Text>
        <AlternativeCarousel carouselItems={alternatives} />
      </View>
      <ProductButtons />
    </ScrollView>
  );
};

export default Haram;
