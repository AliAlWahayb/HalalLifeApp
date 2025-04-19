import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Restaurant } from './models';

interface SimplifiedMapViewProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

const SimplifiedMapView: React.FC<SimplifiedMapViewProps> = ({
  restaurants,
  onSelectRestaurant,
}) => {
  const renderRestaurantItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.restaurantItem}
      onPress={() => onSelectRestaurant(item)}
    >
      <View style={styles.restaurantContent}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantAddress}>{item.address}</Text>
        
        <View style={styles.tagsContainer}>
          {item.status === 'fully_halal' && (
            <View style={[styles.tagBadge, styles.fullyHalalTag]}>
              <MaterialIcons name="check-circle" size={12} color="white" />
              <Text style={styles.tagText}>Fully Halal</Text>
            </View>
          )}
          {item.status === 'partially_halal' && (
            <View style={[styles.tagBadge, styles.partiallyHalalTag]}>
              <MaterialIcons name="warning" size={12} color="white" />
              <Text style={styles.tagText}>Partially Halal</Text>
            </View>
          )}
          {item.status === 'seafood' && (
            <View style={[styles.tagBadge, styles.seafoodTag]}>
              <Ionicons name="water-outline" size={12} color="white" />
              <Text style={styles.tagText}>Seafood</Text>
            </View>
          )}
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialIcons name="location-on" size={28} color="#2c3e50" />
        <Text style={styles.headerText}>Nearby Halal Restaurants</Text>
      </View>

      <Text style={styles.infoText}>
        Map view is unavailable. Showing list of nearby restaurants.
      </Text>

      <FlatList
        data={restaurants}
        renderItem={renderRestaurantItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#2c3e50',
  },
  infoText: {
    padding: 16,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  restaurantContent: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  fullyHalalTag: {
    backgroundColor: '#4CAF50',
  },
  partiallyHalalTag: {
    backgroundColor: '#FF9800',
  },
  seafoodTag: {
    backgroundColor: '#2196F3',
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#333',
  },
});

export default SimplifiedMapView; 