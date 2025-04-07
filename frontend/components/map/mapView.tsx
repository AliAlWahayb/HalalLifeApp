import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
  Linking,
  FlatList,
  Modal,
  LogBox,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';

// Internal components
import CustomMarker from './internalComponant/CustomMarker';
import RestaurantDetails from './internalComponant/RestaurantDetails';
import FilterOptions, { FilterOptions as FilterOptionsType } from './internalComponant/FilterOptions';
import ClusterMarker from './internalComponant/ClusterMarker';
import SimplifiedMapView from './internalComponant/SimplifiedMapView';

// Models and utils
import { Restaurant, MOCK_RESTAURANTS } from './internalComponant/models';
import { clusterRestaurants, Cluster } from './internalComponant/clusterUtils';

// Ignore specific warnings that might be related to the maps
LogBox.ignoreLogs([
  'Cannot read property',
  'Non-serializable values were found in the navigation state',
  'Failed prop type: The prop `region` is marked as required',
]);

// Error boundary functionality for handling map errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Map Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.mapErrorContainer}>
          <Text style={styles.mapErrorText}>
            Unable to load the map. Please check your connection and try again.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const MapScreen: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [filters, setFilters] = useState<FilterOptionsType>({
    halalStatus: ['fully_halal', 'partially_halal', 'seafood'],
    rating: null,
    priceLevel: null,
  });
  const [useGoogleMaps, setUseGoogleMaps] = useState(true);
  const mapRef = useRef<MapView>(null);

  // Cluster restaurants based on zoom level
  const markersToDisplay = useMemo(() => {
    return clusterRestaurants(filteredRestaurants, region);
  }, [filteredRestaurants, region]);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        setIsLoading(true);
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(location);
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Failed to get your current location');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Apply filters when restaurants or filters change
  useEffect(() => {
    applyFilters();
  }, [restaurants, filters]);

  const searchCurrentArea = () => {
    // In a real app, this would call the backend with the current map bounds
    // For now, we'll just use our mock data and pretend we're filtering
    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      setRestaurants(MOCK_RESTAURANTS);
      setIsLoading(false);
    }, 1000);
  };

  const openInGoogleMaps = (restaurant: Restaurant) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${restaurant.latitude},${restaurant.longitude}`;
    const label = restaurant.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const applyFilters = () => {
    let filtered = [...restaurants];
    
    // Filter by halal status
    if (filters.halalStatus.length > 0 && filters.halalStatus.length < 3) {
      filtered = filtered.filter(restaurant => 
        filters.halalStatus.includes(restaurant.status)
      );
    }
    
    // Filter by rating
    if (filters.rating !== null) {
      filtered = filtered.filter(restaurant => 
        restaurant.rating >= filters.rating!
      );
    }
    
    // Filter by price level
    if (filters.priceLevel !== null) {
      filtered = filtered.filter(restaurant => 
        restaurant.price_level <= filters.priceLevel!
      );
    }
    
    setFilteredRestaurants(filtered);
  };

  const handleFilterUpdate = (newFilters: FilterOptionsType) => {
    setFilters(newFilters);
  };

  const hasActiveFilters = () => {
    return (
      filters.halalStatus.length < 3 || 
      filters.rating !== null || 
      filters.priceLevel !== null
    );
  };

  const handleClusterPress = (cluster: Cluster) => {
    setSelectedCluster(cluster);
  };

  const zoomToCluster = (cluster: Cluster) => {
    if (mapRef.current) {
      // Calculate bounds to fit all restaurants in the cluster
      let minLat = Math.min(...cluster.restaurants.map(r => r.latitude));
      let maxLat = Math.max(...cluster.restaurants.map(r => r.latitude));
      let minLng = Math.min(...cluster.restaurants.map(r => r.longitude));
      let maxLng = Math.max(...cluster.restaurants.map(r => r.longitude));
      
      // Add padding
      const latPadding = (maxLat - minLat) * 0.3;
      const lngPadding = (maxLng - minLng) * 0.3;
      
      mapRef.current.animateToRegion({
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.max(maxLat - minLat + latPadding, 0.01),
        longitudeDelta: Math.max(maxLng - minLng + lngPadding, 0.01),
      }, 500);
      
      setSelectedCluster(null);
    }
  };

  const handleMapError = () => {
    console.error('Map loading error');
    setMapError(true);
  };

  // Handle error in Google Maps provider
  const handleMapInitError = useCallback(() => {
    console.log("Falling back to default map provider");
    setUseGoogleMaps(false);
    setMapError(false);
  }, []);

  const renderClusterItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity 
      style={styles.clusterItem}
      onPress={() => {
        setSelectedRestaurant(item);
        setSelectedCluster(null);
      }}
    >
      <Text style={styles.clusterItemName} numberOfLines={1}>{item.name}</Text>
      <View style={styles.clusterItemDetails}>
        {item.status === 'fully_halal' && (
          <View style={styles.statusBadge}>
            <MaterialIcons name="check-circle" size={12} color="white" />
            <Text style={styles.statusText}>Fully Halal</Text>
          </View>
        )}
        {item.status === 'partially_halal' && (
          <View style={[styles.statusBadge, styles.partialBadge]}>
            <MaterialIcons name="warning" size={12} color="white" />
            <Text style={styles.statusText}>Partial</Text>
          </View>
        )}
        {item.status === 'seafood' && (
          <View style={[styles.statusBadge, styles.seafoodBadge]}>
            <Ionicons name="water-outline" size={12} color="white" />
            <Text style={styles.statusText}>Seafood</Text>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMarkers = () => {
    if (!mapReady) return null;
    
    return markersToDisplay.map((item) => {
      if ('count' in item) {
        // This is a cluster
        return (
          <ClusterMarker
            key={item.id}
            latitude={item.latitude}
            longitude={item.longitude}
            count={item.count}
            onPress={() => handleClusterPress(item)}
          />
        );
      } else {
        // This is a regular restaurant
        return (
          <CustomMarker
            key={item.id}
            id={item.id}
            latitude={item.latitude}
            longitude={item.longitude}
            status={item.status}
            onPress={() => setSelectedRestaurant(item)}
          />
        );
      }
    });
  };

  // If map fails completely, show simplified view
  if (mapError) {
    return (
      <View style={styles.container}>
        <SimplifiedMapView 
          restaurants={filteredRestaurants} 
          onSelectRestaurant={setSelectedRestaurant}
        />
        
        <View style={styles.topButtonsContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, hasActiveFilters() && styles.activeFilterButton]} 
            onPress={() => setShowFilters(true)}
          >
            <Ionicons 
              name="filter" 
              size={24} 
              color={hasActiveFilters() ? "white" : "#2c3e50"} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={searchCurrentArea}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" style={styles.loadingIndicator} />
            ) : (
              <MaterialIcons name="search" size={24} color="white" />
            )}
            <Text style={styles.searchButtonText}>
              {isLoading ? 'Searching...' : 'Search this area'}
            </Text>
          </TouchableOpacity>
        </View>

        <RestaurantDetails
          restaurant={selectedRestaurant}
          visible={!!selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          openInGoogleMaps={openInGoogleMaps}
        />

        <FilterOptions
          visible={showFilters}
          onClose={() => setShowFilters(false)}
          onApplyFilters={handleFilterUpdate}
          currentFilters={filters}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <ErrorBoundary>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={useGoogleMaps && Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation
            showsMyLocationButton
            onMapReady={() => {
              setMapReady(true);
              console.log("Map ready");
            }}
            maxZoomLevel={18}
            minZoomLevel={10}
            onPoiClick={() => {}} // Empty handler to prevent errors
          >
            {mapReady ? renderMarkers() : null}
          </MapView>
        </ErrorBoundary>
      </View>

      <View style={styles.topButtonsContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, hasActiveFilters() && styles.activeFilterButton]} 
          onPress={() => setShowFilters(true)}
        >
          <Ionicons 
            name="filter" 
            size={24} 
            color={hasActiveFilters() ? "white" : "#2c3e50"} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={searchCurrentArea}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" style={styles.loadingIndicator} />
          ) : (
            <MaterialIcons name="search" size={24} color="white" />
          )}
          <Text style={styles.searchButtonText}>
            {isLoading ? 'Searching...' : 'Search this area'}
          </Text>
        </TouchableOpacity>
      </View>

      {filteredRestaurants.length === 0 && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No restaurants found matching your filters</Text>
          <TouchableOpacity 
            style={styles.resetFiltersButton}
            onPress={() => setFilters({
              halalStatus: ['fully_halal', 'partially_halal', 'seafood'],
              rating: null,
              priceLevel: null,
            })}
          >
            <Text style={styles.resetFiltersButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      <RestaurantDetails
        restaurant={selectedRestaurant}
        visible={!!selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        openInGoogleMaps={openInGoogleMaps}
      />

      <FilterOptions
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleFilterUpdate}
        currentFilters={filters}
      />

      <Modal
        visible={!!selectedCluster}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedCluster(null)}
      >
        {selectedCluster && (
          <View style={styles.clusterModalContainer}>
            <View style={styles.clusterModalHeader}>
              <Text style={styles.clusterModalTitle}>{selectedCluster.count} Restaurants Found</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedCluster(null)}
              >
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={selectedCluster.restaurants}
              renderItem={renderClusterItem}
              keyExtractor={(item) => item.id}
              style={styles.clusterList}
            />
            
            <TouchableOpacity 
              style={styles.zoomButton}
              onPress={() => zoomToCluster(selectedCluster)}
            >
              <Ionicons name="search" size={18} color="white" />
              <Text style={styles.zoomButtonText}>Zoom to This Area</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapErrorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2c3e50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  topButtonsContainer: {
    position: 'absolute',
    top: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
  },
  searchButton: {
    backgroundColor: '#2c3e50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
  loadingIndicator: {
    marginRight: 8,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  activeFilterButton: {
    backgroundColor: '#2c3e50',
  },
  noResultsContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    zIndex: 1,
  },
  noResultsText: {
    fontSize: 16,
    marginBottom: 10,
  },
  resetFiltersButton: {
    backgroundColor: '#2c3e50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  resetFiltersButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  clusterModalContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  clusterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  clusterModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  clusterList: {
    flex: 1,
  },
  clusterItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  clusterItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  clusterItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
  },
  partialBadge: {
    backgroundColor: '#FF9800',
  },
  seafoodBadge: {
    backgroundColor: '#2196F3',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 3,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 3,
    color: '#333',
  },
  zoomButton: {
    backgroundColor: '#2c3e50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    margin: 15,
    borderRadius: 8,
  },
  zoomButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default MapScreen;
