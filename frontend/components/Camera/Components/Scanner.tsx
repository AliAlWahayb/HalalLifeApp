import { MaterialCommunityIcons } from '@expo/vector-icons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
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

  // Handle barcode scanning
  const handleBarCodeScanned = (scannedBarcode: string) => {
    if (!isScanning) return; // Prevent multiple scans

    setIsScanning(false);
    setBarcode(scannedBarcode);

    // Reset scanner after 2 seconds
    setTimeout(() => {
      setIsScanning(true);
    }, 2000);
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
      refetch();
    }
  }, [barcode]);

  useEffect(() => {
    if (isSuccess) {
      redirectToProduct();
    }
    if (isError) {
      redirectToNotFound();
    }
  }, [isSuccess, isError]);

  const redirectToProduct = () => {
    if (data.halal_analysis.halal_status === 'halal') {
      console.log(data);
      (navigation.navigate as any)('Halal', {
        productData: data.product,
        halalStatus: data.halal_analysis.halal_status,
        why: data.halal_analysis.why,
        additives: data.halal_analysis.additives,
      });
    }

    if (data.halal_analysis.halal_status === 'haram') {
      console.log(data);
      (navigation.navigate as any)('Haram', {
        productData: data.product,
        halalStatus: data.halal_analysis.halal_status,
        why: data.halal_analysis.why,
        additives: data.halal_analysis.additives,
      });
    }

    if (data.halal_analysis.halal_status === 'unknown') {
      console.log(data);
      (navigation.navigate as any)('Unknown', {
        productData: data.product,
        halalStatus: data.halal_analysis.halal_status,
        why: data.halal_analysis.why,
        additives: data.halal_analysis.additives,
      });
    }
    if (data.halal_analysis.halal_status === 'not found') {
      console.log('Product is not found');
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
      <View className="flex-1 items-center justify-center">
        {isLoading && <ActivityIndicator size={250} color={theme.colors.accent} />}
      </View>
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
