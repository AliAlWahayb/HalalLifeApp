import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from 'themes/ThemeProvider';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotification?: boolean;
  showProfile?: boolean;
  customLeftComponent?: React.ReactNode;
  customRightComponent?: React.ReactNode;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title = 'HalalLife',
  showBack = false,
  showSearch = true,
  showNotification = true,
  showProfile = true,
  customLeftComponent,
  customRightComponent,
  onSearchPress,
  onNotificationPress,
  onProfilePress,
  onBackPress,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      // @ts-ignore - Need to fix typing for navigation
      navigation.navigate('UserProfile', { userId: '1' });
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle="dark-content"
      />

      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.background, borderBottomColor: 'rgba(0,0,0,0.05)' },
        ]}>
        {/* Left Side */}
        <View style={styles.leftContainer}>
          {customLeftComponent || (
            <>
              {showBack ? (
                <TouchableOpacity style={styles.iconButton} onPress={handleBackPress}>
                  <Icon name="arrow-left" size={18} color={theme.colors.textPrimary} />
                </TouchableOpacity>
              ) : (
                <View style={styles.titleContainer}>
                  <Text style={[styles.titleText, { color: theme.colors.primary }]}>
                    Halal<Text style={{ color: theme.colors.textPrimary }}>Life</Text>
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Center/Title */}
        {title && showBack && (
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]} numberOfLines={1}>
            {title}
          </Text>
        )}

        {/* Right Side */}
        <View style={styles.rightContainer}>
          {customRightComponent || (
            <>
              {showSearch && (
                <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
                  <Icon name="search" size={18} color={theme.colors.textPrimary} />
                </TouchableOpacity>
              )}

              {showNotification && (
                <TouchableOpacity style={styles.iconButton} onPress={onNotificationPress}>
                  <Icon name="bell" size={18} color={theme.colors.textPrimary} />
                </TouchableOpacity>
              )}

              {showProfile && (
                <TouchableOpacity style={styles.iconButton} onPress={handleProfilePress}>
                  <Icon name="user" size={18} color={theme.colors.textPrimary} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 44 : 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    margin: 5,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 2,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;