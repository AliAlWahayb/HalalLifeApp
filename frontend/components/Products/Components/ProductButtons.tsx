import { Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import Buttons from 'components/Shared/Buttons/AliButtons';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';

const ProductButtons = () => {
  const [Favoriteicon, setFavoriteicon] = useState(false);

  const handleFavorite = () => {
    setFavoriteicon(!Favoriteicon);
  };
  const handleReport = () => {};

  const { theme } = useTheme();

  return (
    <View className="flex flex-row gap-5 py-6">
      <Buttons
        title="Favorite"
        icon={
          <Fontisto
            name="favorite"
            size={24}
            color={Favoriteicon ? '#DC143C' : theme.colors.textSecondary}
          />
        }
        onPress={handleFavorite}
      />
      <Buttons
        title="Report"
        icon={
          <MaterialCommunityIcons
            name="flag-variant"
            size={30}
            color={theme.colors.textSecondary}
          />
        }
        onPress={handleReport}
      />
    </View>
  );
};

export default ProductButtons;
