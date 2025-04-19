import { Restaurant } from './models';
import { Region } from 'react-native-maps';

export interface Cluster {
  id: string;
  count: number;
  latitude: number;
  longitude: number;
  restaurants: Restaurant[];
}

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export const clusterRestaurants = (
  restaurants: Restaurant[],
  region: Region,
  clusterDistanceKm: number = 0.5
): (Restaurant | Cluster)[] => {
  if (restaurants.length === 0) return [];

  // If zoom level is high enough, don't cluster
  if (region.latitudeDelta < 0.03) {
    return restaurants;
  }

  const clusters: Cluster[] = [];
  const processedRestaurants = new Set<string>();

  restaurants.forEach(restaurant => {
    // Skip if this restaurant is already in a cluster
    if (processedRestaurants.has(restaurant.id)) return;

    // Find nearby restaurants that can form a cluster
    const nearbyRestaurants = restaurants.filter(
      r =>
        !processedRestaurants.has(r.id) &&
        calculateDistance(
          restaurant.latitude,
          restaurant.longitude,
          r.latitude,
          r.longitude
        ) <= clusterDistanceKm
    );

    // If we have multiple restaurants, create a cluster
    if (nearbyRestaurants.length > 1) {
      // Calculate the center of the cluster
      const latSum = nearbyRestaurants.reduce((sum, r) => sum + r.latitude, 0);
      const lngSum = nearbyRestaurants.reduce((sum, r) => sum + r.longitude, 0);
      const centerLat = latSum / nearbyRestaurants.length;
      const centerLng = lngSum / nearbyRestaurants.length;

      // Create a cluster
      const cluster: Cluster = {
        id: `cluster-${clusters.length}`,
        count: nearbyRestaurants.length,
        latitude: centerLat,
        longitude: centerLng,
        restaurants: nearbyRestaurants,
      };

      clusters.push(cluster);

      // Mark all restaurants in this cluster as processed
      nearbyRestaurants.forEach(r => processedRestaurants.add(r.id));
    }
  });

  // Add remaining individual restaurants
  const individualRestaurants = restaurants.filter(
    r => !processedRestaurants.has(r.id)
  );

  return [...clusters, ...individualRestaurants];
}; 