import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
// Make sure NativeWind is set up in your project
// You might need to adjust class names like 'bg-blue-500', 'text-white', etc.
// based on your tailwind.config.js theme.

interface CustomAlertProps {
  visible: boolean; // Controls if the alert is shown
  title: string;
  message?: string;
  onClose: () => void; // Function to call when the alert should be closed
  // You can add more props for multiple buttons, different button actions, etc.
  confirmButtonText?: string; // Optional text for the confirmation button
  onConfirm?: () => void; // Optional function to call when the confirmation button is pressed
  Close?: boolean; // Optional prop to control the visibility of the close button
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onClose,
  confirmButtonText = 'OK', // Default button text
  onConfirm,
  Close = false, // Default to true, showing the close button
}) => {
  return (
    <Modal
      transparent // Allows the background behind the modal content to be visible
      animationType="fade" // How the modal appears (slide, fade, none)
      visible={visible} // Controlled by the state in the parent component
      onRequestClose={onClose} // Required for Android hardware back button to close the modal
    >
      {/* Overlay background */}
      <View className="flex-1 items-center justify-center  bg-black/50 px-5">
        {/* Alert Box */}
        <View
          className="w-full max-w-sm rounded-3xl bg-background p-6"
          style={{ marginBottom: 200 }}>
          {/* Title */}
          <Text className="mb-3 pt-5 text-center text-2xl font-bold text-textPrimary">{title}</Text>

          {/* Message */}
          {message && <Text className="mb-6 text-center text-base text-textMuted">{message}</Text>}

          {/* Buttons Container */}
          <View className="flex-row justify-center gap-2 py-3">
            {Close && (
              <TouchableOpacity className="rounded-full  bg-Haram px-6 py-3 " onPress={onClose}>
                <Text className="text-base font-semibold text-textSecondary">Cancel</Text>
              </TouchableOpacity>
            )}

            {/* Confirmation Button */}
            <TouchableOpacity
              className="rounded-full bg-accent px-6 py-3 " // Example styling with NativeWind
              onPress={() => {
                if (onConfirm) {
                  onConfirm(); // Execute the optional confirm action
                }
                onClose(); // Close the alert after the button is pressed
              }}>
              <Text className="text-base font-semibold text-textSecondary">
                {confirmButtonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
