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
      <Text className="bg-accent text-textPrimary rounded-full p-2">{index}#</Text>
      <Text className="text-textPrimary text-xl font-semibold">{name}</Text>
      <Text className="text-textMuted text-base font-semibold">{contributions} Contributions</Text>
      <ButtonsSmall title="Follow" onPress={onPress} />
    </View>
  );
};

export default Contributors;
