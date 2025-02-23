import { View, Text } from 'react-native';
import { title } from './SMall/title';

export default function App() {
  return (
    <>
      <View className="flex flex-col p-5">
        <title />
        <Text className="pt-5 text-lg font-black text-emerald-900">
          Success in React Native development starts with strong collaboration. Communicate openly,
          delegate tasks efficiently, and support each other in problem-solving. Regular check-ins
          and knowledge sharing will help your team grow and build amazing apps together!!!
        </Text>
      </View>
    </>
  );
}
//Hi