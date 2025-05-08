import { MaterialCommunityIcons } from '@expo/vector-icons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from 'themes/ThemeProvider';

import { useProduct } from '../../../hooks/useProduct';

const Scanner = () => {
  const navigation = useNavigation();
  const [permissions, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true); // Renamed for clarity
  const [barcode, setBarcode] = useState('');
  const [flash, setFlash] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isManualInputVisible, setIsManualInputVisible] = useState(false);

  // Use proper typing for React Query hooks
  const { data, isLoading, isError, error, isSuccess, refetch } = useProduct(barcode);

  useEffect(() => {
    requestPermission();
  }, []);

  const saveProductLocally = async (barcode: string, productData: any) => {
    try {
      await AsyncStorage.setItem(barcode, JSON.stringify(productData));
    } catch (error) {
      console.error('Error saving product locally:', error);
    }
  };

  const getProductFromLocal = async (barcode: string) => {
    try {
      const productData = await AsyncStorage.getItem(barcode);
      if (productData) {
        return { ...JSON.parse(productData), isFromLocal: true };
      }
      return null;
    } catch (error) {
      console.error('Error retrieving product from local storage:', error);
      return null;
    }
  };

  // Handle barcode scanning
  const handleBarCodeScanned = async (scannedBarcode: React.SetStateAction<string>) => {
    if (!isScanning) return; // Prevent multiple scans

    setIsScanning(false); // Disable scanner immediately
    setBarcode(scannedBarcode);

    setTimeout(() => setIsScanning(true), 2000); // Re-enable scanner after processing
  };

  const handleManualSubmit = () => {
    if (manualBarcode) {
      setBarcode(manualBarcode);
      refetch();
      setIsManualInputVisible(false);
    }
  };

  // Trigger fetch when barcode changes
  useEffect(() => {
    if (barcode) {
      const fetchProduct = async () => {
        const localProduct = await getProductFromLocal(barcode);
        if (localProduct) {
          console.log('Product found locally.');
          if (localProduct.isFromLocal) {
            console.log('This product was retrieved from local storage.');
          }
          redirectToProduct(localProduct);
          return; // Exit early to prevent API call
        }

        // If not found locally, fetch from server
        refetch();
      };

      fetchProduct();
    }
  }, [barcode]);

  useEffect(() => {
    if (isSuccess) {
      saveProductLocally(barcode, data);
      redirectToProduct(data);
      console.log(data.halal_analysis.halal_status);
    }
    if (isError) {
      redirectToNotFound();
    }
    setBarcode('');
  }, [isSuccess, isError]);

  const redirectToProduct = (productData: {
    halal_analysis: { halal_status: string; why: any; additives: any };
    product: any;
  }) => {
    if (productData.halal_analysis.halal_status === 'halal') {
      (navigation.navigate as any)('Halal', {
        productData: productData.product,
        halalStatus: productData.halal_analysis.halal_status,
        why: productData.halal_analysis.why,
        additives: productData.halal_analysis.additives,
      });
    }

    if (productData.halal_analysis.halal_status === 'haram') {
      (navigation.navigate as any)('Haram', {
        productData: productData.product,
        halalStatus: productData.halal_analysis.halal_status,
        why: productData.halal_analysis.why,
        additives: productData.halal_analysis.additives,
      });
    }

    if (productData.halal_analysis.halal_status === 'unknown') {
      (navigation.navigate as any)('Unknown', {
        productData: productData.product,
        halalStatus: productData.halal_analysis.halal_status,
        why: productData.halal_analysis.why,
        additives: productData.halal_analysis.additives,
      });
    }
    if (productData.halal_analysis.halal_status === 'not found') {
      (navigation.navigate as any)('NotFound');
    }
  };

  const redirectToNotFound = () => {
    (navigation.navigate as any)('NotFound');
  };

  const { theme } = useTheme();

  // Show loading state
  if (!permissions?.granted) {
    return (
      <SafeAreaView className="flex-1">
        <Text className="my-auto px-5 text-center text-3xl font-bold">
          Camera permission required. Please enable in settings.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <CameraView
      style={{ flex: 1 }}
      facing="back"
      flash="auto"
      enableTorch={flash}
      autofocus="off"
      onBarcodeScanned={isScanning ? ({ data }) => handleBarCodeScanned(data) : undefined}>
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={250} color={theme.colors.accent} />
        </View>
      )}
      <View className="absolute top-0 w-full pt-4">
        <View className="mx-auto w-2/3 flex-row items-center">
          {/* Flash Button */}
          <TouchableOpacity
            onPress={() => setFlash(!flash)}
            style={{
              backgroundColor: theme.colors.background + '50',
              padding: 6,
              borderRadius: 40,
            }}>
            <MaterialCommunityIcons
              name={flash ? 'flash' : 'flash-off'}
              size={20}
              color={theme.colors.accent}
            />
          </TouchableOpacity>

          {/* Manual Input Group */}
          <View className="mx-4 flex-1 flex-row items-center">
            <TextInput
              placeholder="Enter barcode"
              value={manualBarcode}
              onChangeText={setManualBarcode}
              onSubmitEditing={handleManualSubmit}
              keyboardType="number-pad"
              inputMode="numeric"
              className="flex-1 rounded-full px-4 py-2"
              style={{
                color: theme.colors.textSecondary,
                backgroundColor: theme.colors.background + '50',
              }}
              enterKeyHint="send"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>
      </View>

      {/* {data?.product && (
          <View className="absolute bottom-0 w-full bg-white/80 p-4">
            <Text className="text-lg font-bold">{data.halal_analysis.halal_status}</Text>
            <Text className="text-sm">{data.product.brands}</Text>
          </View>
        )} */}

      {/* {isError && (
        <View className="absolute bottom-0 w-full bg-red-100 p-4">
          <Text className="text-red-600">Error: {error?.message}</Text>
        </View>
      )} */}
    </CameraView>
  );
};

export default Scanner;
