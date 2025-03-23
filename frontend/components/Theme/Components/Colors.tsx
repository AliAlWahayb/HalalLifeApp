import { TouchableOpacity, View } from 'react-native';

interface Props {
  size: number;
  color: string[];
  id: string;
}

const Colors = ({ size, color, id }: Props) => {
  const HandleChange = () => {
    console.log(id);
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={HandleChange}
      className="flex flex-row overflow-hidden rounded border-2 border-gray-300">
      <View style={{ width: size, height: size, backgroundColor: color[0] }} />
      <View style={{ width: size, height: size, backgroundColor: color[1] }} />
      <View style={{ width: size, height: size, backgroundColor: color[2] }} />
    </TouchableOpacity>
  );
};

export default Colors;
