import React from 'react';
import { View, Text } from 'react-native';

const LandingPage: React.FC = () => {
  return (
    <View className="flex-1 items-center justify-center bg-gradient-to-r from-blue-400 to-green-400 p-6">
      <Text className="text-4xl font-bold text-white mb-4">Welcome to Teamwork</Text>
      <Text className="text-lg text-white text-center px-4">
        Success in React Native development starts with strong collaboration. Communicate openly,
        delegate tasks efficiently, and support each other in problem-solving. 
        Regular check-ins and knowledge sharing will help your team grow and build amazing apps together!
      </Text>
    </View>
  );
};

export default LandingPage;
