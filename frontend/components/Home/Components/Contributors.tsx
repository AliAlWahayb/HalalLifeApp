import { View, Text } from 'react-native';
import React from 'react';
import ButtonsSmall from 'components/Shared/Buttons/ButtonsSmall';

interface ContributorsProps {
  index: number;
  name: string;
  contributions: number;
  onPress: () => void;
}

const Contributors = ({ index, name, contributions, onPress }: ContributorsProps) => {
  return (
    <View className="flex flex-row items-center justify-between gap-5">
      <Text className="bg-accent rounded-full p-2 text-black">{index}#</Text>
      <Text className="text-xl font-semibold text-black">{name}</Text>
      <Text className="text-base font-semibold text-gray-500">{contributions} Contributions</Text>
      <ButtonsSmall title="Follow" onPress={onPress} />
    </View>
  );
};

export default Contributors;
