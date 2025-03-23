import {  View } from 'react-native';

interface Props {
  size: number;
  color: string[];
  id: string;
}

const Colors = ({ size, color, id }: Props) => {
  return (
    <View className="flex flex-row rounded border-2 border-gray-300">
      <View style={{ width: size, height: size, backgroundColor: color[0] }} />
      <View style={{ width: size, height: size, backgroundColor: color[1] }} />
      <View style={{ width: size, height: size, backgroundColor: color[2] }} />
    </View>
  );
};

export default Colors;
