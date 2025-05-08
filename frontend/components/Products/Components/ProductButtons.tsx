import { Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AliButtons from 'components/Shared/Buttons/AliButtons';
import TwoButtons from 'components/Shared/Buttons/TwoButtons';
import React, { useState } from 'react';
import { View } from 'react-native';
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
    <View className="flex-row items-center justify-between py-6">
      <AliButtons
        title="Report"
        onPress={handleReport}
        icon={
          <MaterialCommunityIcons
            name="flag-variant"
            size={30}
            color={theme.colors.textSecondary}
          />
        }
      />
    </View>
  );
};

export default ProductButtons;
