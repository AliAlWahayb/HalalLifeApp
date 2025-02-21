import HomeView from 'components/Home/HomeView';
import { View } from 'react-native';

export default function App() {
  return (
    <>
      <View className="w-100 h-100 bg-black">
        <HomeView />
      </View>
    </>
  );
}
