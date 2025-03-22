import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const Header = () => {
  return (
    <View className="absolute top-0 left-0 right-0 z-10 mr-4">
      <Svg
        width="393"
        height="75"
        viewBox="0 0 393 75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Circle cx="2" cy="27" r="30" stroke="#77C273" strokeWidth="36" />
        <Circle cx="77.5" cy="-16.5" r="82.5" fill="#77C273" />
        <Circle cx="388.5" cy="-18.5" r="90.5" fill="#77C273" />
      </Svg>
    </View>
  );
};

export default Header;
