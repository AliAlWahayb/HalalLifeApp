import { View, Text, SafeAreaView } from 'react-native';
import React, { useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useTheme } from 'themes/ThemeProvider';

const Scanner = () => {
  const [permissions, requestPermission] = useCameraPermissions();
  const [Scanner, setScanner] = React.useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  const isPermissionGranted = permissions?.granted;

  function handleBarCodeScanned(data: any) {
    setScanner(true);
    console.log(data);
    setTimeout(() => {
      setScanner(false);
    }, 2000);
  }

  const { theme } = useTheme();

  return (
    <SafeAreaView className="flex-1">
      {!isPermissionGranted ? (
        <Text className="my-auto px-5 text-center text-3xl font-bold">
          Permission not granted to access the camera to use this feature enable it from settings
        </Text>
      ) : (
        <CameraView
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          facing="back"
          flash="auto"
          autofocus="on"
          onBarcodeScanned={(barcode) => handleBarCodeScanned(barcode.data)}>
          <SimpleLineIcons
            name="frame"
            size={250}
            color={Scanner ? theme.colors.accent : theme.colors.background}
          />
        </CameraView>
      )}
    </SafeAreaView>
  );
};

export default Scanner;
