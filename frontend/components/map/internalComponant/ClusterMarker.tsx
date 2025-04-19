import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

interface ClusterMarkerProps {
  latitude: number;
  longitude: number;
  count: number;
  onPress: () => void;
}

const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  latitude,
  longitude,
  count,
  onPress,
}) => {
  return (
    <Marker
      coordinate={{
        latitude,
        longitude,
      }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View style={styles.clusterContainer}>
        <Text style={styles.clusterText}>{count}</Text>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  clusterContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
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
  clusterText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ClusterMarker; 