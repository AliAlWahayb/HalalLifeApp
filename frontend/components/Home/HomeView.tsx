import { View, Text } from 'react-native';

export default function App() {
  return (
    <>
      <View className='flex flex-col p-5'>
        <Text className='text-2xl font-bold pt-5 text-purple-950'>Welcome to Teamwork</Text>
        <Text  className='pt-5'>
          Success in React Native development starts with strong collaboration. Communicate openly,
          delegate tasks efficiently, and support each other in problem-solving. Regular check-ins
          and knowledge sharing will help your team grow and build amazing apps together!
        </Text>
      </View>
    </>
  );
}
