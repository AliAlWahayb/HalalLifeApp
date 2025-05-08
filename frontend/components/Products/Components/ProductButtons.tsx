import { Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import TwoButtons from 'components/Shared/Buttons/TwoButtons';
import React, { useState } from 'react';
import { useTheme } from 'themes/ThemeProvider';

const ProductButtons = () => {
  const [Favoriteicon, setFavoriteicon] = useState(false);

  const navigation = useNavigation();

  const handleFavorite = () => {
    setFavoriteicon(!Favoriteicon);
  };
  const handleReport = () => {
    (navigation.navigate as any)({ name: 'ReportView' });
  };

  const { theme } = useTheme();

  return (
    <TwoButtons
      title1="Report"
      title2="Favorite"
      icon1={
        <MaterialCommunityIcons name="flag-variant" size={30} color={theme.colors.textSecondary} />
      }
      icon2={
        <Fontisto
          name="favorite"
          size={24}
          color={Favoriteicon ? '#FF2A68' : theme.colors.textSecondary}
        />
      }
      handle1={handleReport}
      handle2={handleFavorite}
    />
  );
};

export default ProductButtons;
