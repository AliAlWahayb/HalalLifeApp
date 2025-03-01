import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Buttons = props => {

  const handlePress = () => {
    if (props.href) {
     
    } else if (props.onPress) {
      props.onPress(); 
    }
  };

  

  return (

    <TouchableOpacity 

    className='bg-[#77C273] rounded-full py-4  px-24 mt-4'
    onPress={handlePress}
    >
    <Text className="text-white font-bold">{props.children}</Text>
     

    </TouchableOpacity>
  
  );

};

export default Buttons;
