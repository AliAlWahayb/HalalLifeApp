import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Linking,
  Dimensions,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'fully_halal' | 'partially_halal' | 'seafood';
  rating: number;
  price_level: number;
  hours: string;
  phone: string;
  website: string;
  description: string;
  photo_url: string;
}

interface RestaurantDetailsProps {
  restaurant: Restaurant | null;
  visible: boolean;
  onClose: () => void;
  openInGoogleMaps: (restaurant: Restaurant) => void;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  restaurant,
  visible,
  onClose,
  openInGoogleMaps,
}) => {
  if (!restaurant) return null;

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'fully_halal':
        return <MaterialIcons name="check-circle" size={24} color="#4CAF50" />;
      case 'partially_halal':
        return <MaterialIcons name="warning" size={24} color="#FF9800" />;
      case 'seafood':
        return <FontAwesome5 name="fish" size={20} color="#2196F3" />;
      default:
        return null;
    }
  };

  const formatPriceLevel = (level: number) => {
    return '$'.repeat(level);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'fully_halal':
        return 'Fully Halal';
      case 'partially_halal':
        return 'Partially Halal';
      case 'seafood':
        return 'Seafood';
      default:
        return '';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.modalOverlay} 
        onPress={onClose}
      >
        <Pressable style={styles.detailPanel} onPress={e => e.stopPropagation()}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          <View style={styles.detailHeader}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.statusContainer}>
              {renderStatusIcon(restaurant.status)}
              <Text style={styles.statusText}>
                {getStatusText(restaurant.status)}
              </Text>
            </View>
          </View>

          <View style={styles.detailInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color="#555" />
              <Text style={styles.addressText}>{restaurant.address}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color="#555" />
              <Text style={styles.hoursText}>{restaurant.hours}</Text>
            </View>
            
            <View style={styles.ratingRow}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{restaurant.rating}</Text>
              </View>
              <Text style={styles.priceText}>
                {formatPriceLevel(restaurant.price_level)}
              </Text>
            </View>
            
            <Text style={styles.descriptionText}>{restaurant.description}</Text>
            
            <View style={styles.contactContainer}>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => Linking.openURL(`tel:${restaurant.phone}`)}
              >
                <Ionicons name="call-outline" size={16} color="#0066CC" />
                <Text style={styles.contactButtonText}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => Linking.openURL(restaurant.website)}
              >
                <Ionicons name="globe-outline" size={16} color="#0066CC" />
                <Text style={styles.contactButtonText}>Website</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.googleMapsButton}
            onPress={() => openInGoogleMaps(restaurant)}
          >
            <FontAwesome5 name="directions" size={16} color="white" />
            <Text style={styles.googleMapsButtonText}>Open in Google Maps</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  detailPanel: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
    maxHeight: height * 0.7,
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    marginBottom: 10,
  },
  detailHeader: {
    marginBottom: 15,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusText: {
    marginLeft: 6,
    fontWeight: '500',
    fontSize: 15,
  },
  detailInfo: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    flex: 1,
  },
  hoursText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '500',
    fontSize: 14,
  },
  priceText: {
    fontSize: 14,
    color: '#555',
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
  },
  contactContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  contactButtonText: {
    color: '#0066CC',
    marginLeft: 4,
  },
  googleMapsButton: {
    backgroundColor: '#4285F4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  googleMapsButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default RestaurantDetails; 