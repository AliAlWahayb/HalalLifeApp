import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

interface CustomMarkerProps {
  latitude: number;
  longitude: number;
  status: 'fully_halal' | 'partially_halal' | 'seafood';
  id: string;
  onPress: () => void;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({
  latitude,
  longitude,
  status,
  id,
  onPress,
}) => {
  const getMarkerContent = () => {
    switch (status) {
      case 'fully_halal':
        return (
          <View style={[styles.markerContainer, styles.fullyHalalMarker]}>
            <MaterialIcons name="check" size={16} color="white" />
          </View>
        );
      case 'partially_halal':
        return (
          <View style={[styles.markerContainer, styles.partiallyHalalMarker]}>
            <MaterialIcons name="warning" size={16} color="white" />
          </View>
        );
      case 'seafood':
        return (
          <View style={[styles.markerContainer, styles.seafoodMarker]}>
            <FontAwesome5 name="fish" size={14} color="white" />
          </View>
        );
      default:
        return <View style={styles.markerContainer} />;
    }
  };

  return (
    <Marker
      coordinate={{
        latitude,
        longitude,
      }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      {getMarkerContent()}
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fullyHalalMarker: {
    backgroundColor: '#4CAF50', // Green
  },
  partiallyHalalMarker: {
    backgroundColor: '#FF9800', // Orange
  },
  seafoodMarker: {
    backgroundColor: '#2196F3', // Blue
  },
});

export default CustomMarker; 