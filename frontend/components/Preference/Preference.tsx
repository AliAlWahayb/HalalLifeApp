import React, { useState } from 'react';
import { Button, View } from 'react-native';

import PreferenceButtons from './Components/PreferenceButtons';
import DropdownMenu from '../Shared/DropdownMenu';

const ParentPage = () => {
  const [selectedValues1, setSelectedValues1] = useState<string[]>([]);
  const [selectedValues2, setSelectedValues2] = useState<string[]>([]);
  const [selectedValues3, setSelectedValues3] = useState<string[]>([]);
  const [selectedValues4, setSelectedValues4] = useState<string[]>([]);

  const dropdownItems1 = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  const dropdownItems2 = [
    { label: 'Choice A', value: 'choiceA' },
    { label: 'Choice B', value: 'choiceB' },
    { label: 'Choice C', value: 'choiceC' },
  ];
  const dropdownItems3 = [
    { label: 'Choice A', value: 'choiceA' },
    { label: 'Choice B', value: 'choiceB' },
    { label: 'Choice C', value: 'choiceC' },
  ];
  const dropdownItems4 = [
    { label: 'Choice A', value: 'choiceA' },
    { label: 'Choice B', value: 'choiceB' },
    { label: 'Choice C', value: 'choiceC' },
  ];

  const handleSubmit = () => {
    console.log('Dropdown 1 selected values:', selectedValues1);
    console.log('Dropdown 2 selected values:', selectedValues2);
    console.log('Dropdown 3 selected values:', selectedValues3);
    console.log('Dropdown 4 selected values:', selectedValues4);
  };
  const handleReset = () => {
    const resetFunctions = [
      setSelectedValues1,
      setSelectedValues2,
      setSelectedValues3,
      setSelectedValues4,
    ];
    resetFunctions.forEach((resetFunc) => resetFunc([]));
  };

  return (
    <View className="flex-1 items-center justify-between bg-white py-5">
      <View className="flex flex-col  gap-5">
        <DropdownMenu
          zIndex={4000}
          zIndexInverse={1000}
          placeholder="Dietary Preference"
          items={dropdownItems1}
          setValue={setSelectedValues1}
        />
        <DropdownMenu
          zIndex={3000}
          zIndexInverse={2000}
          placeholder="Food Preference"
          items={dropdownItems2}
          setValue={setSelectedValues2}
        />
        <DropdownMenu
          zIndex={2000}
          zIndexInverse={3000}
          placeholder="Calorie Preferences"
          items={dropdownItems3}
          setValue={setSelectedValues3}
        />
        <DropdownMenu
          zIndex={1000}
          zIndexInverse={4000}
          placeholder="Allergies"
          items={dropdownItems4}
          setValue={setSelectedValues4}
        />
      </View>
      <PreferenceButtons handleSubmit={handleSubmit} handleReset={handleReset} />
    </View>
  );
};

export default ParentPage;
