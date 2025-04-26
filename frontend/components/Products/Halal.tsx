import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';

import Additives from './Components/Additives';
import Details from './Components/Details';
import Hero from './Components/Hero';
import Ingredients from './Components/Ingredients';
import Nutritional from './Components/Nutritional';
import ProductButtons from './Components/ProductButtons';

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

interface Props {
  productData: ProductData;
  halalStatus: string;
}

const Halal = () => {
  const { theme, globalColors } = useTheme();
  const route = useRoute();
  const { productData } = route.params as Props;

  return (
    <ScrollView className="flex-1 bg-background py-5" contentContainerClassName="items-center">
      <View
        className="w-5/6 flex-col items-center justify-center rounded-3xl border-4  p-3"
        style={{ borderColor: globalColors.Halal }}>
        <View className="rounded-full p-2" style={{ backgroundColor: globalColors.Halal }}>
          <FontAwesome name="check" size={48} color={theme.colors.textSecondary} />
        </View>
        <Text className="text-3xl font-bold " style={{ color: globalColors.Halal }}>
          Halal
        </Text>
      </View>
      <View className="w-5/6 py-2">
        <Hero product={productData} />
        <View className="flex flex-col py-5">
          <Details product={productData} />

          <Ingredients product={productData} />

          <Additives product={productData} />

          <Nutritional product={productData} />
        </View>
      </View>
      <ProductButtons />
    </ScrollView>
  );
};

export default Halal;
