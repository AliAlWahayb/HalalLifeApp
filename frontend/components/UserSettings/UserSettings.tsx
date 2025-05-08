import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CheckBox from 'components/Shared/CheckBox/CheckBox';
import TwoButtons from '../Shared/Buttons/TwoButtons';
import DropdownMenu from '../Shared/DropdownMenu';
import DropdownAdvanceSettings from './com/DropdownAdvanceSettings';
import ChangeUnami from './ChangeUnami';
import ChangePass from './ChangePass';
import DeleteAccount from './DeleteAccount';
import { AuthContext } from '../context/Auth-context';

const UserSettings = () => {
  const [currentScreen, setCurrentScreen] = useState<
    'main' | 'changeUsername' | 'changePassword' | 'deleteAccount'
  >('main');

  const [notifications, setNotifications] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Arabic', value: 'ar' },
    { label: 'French', value: 'fr' },
  ];

  const locations = [
    { label: 'Saudi Arabia', value: 'sa' },
    { label: 'UAE', value: 'uae' },
    { label: 'USA', value: 'us' },
  ];

  const advancedSettings = [
    { label: 'Change Username', value: 'changeUsername' },
    { label: 'Change Password', value: 'changePassword' },
    { label: 'DELETE ACCOUNT', value: 'deleteAccount', danger: true },
  ];

  const handleAdvancedSelect = (value: string) => {
    switch (value) {
      case 'changeUsername':
        setCurrentScreen('changeUsername'); //
        break;
      case 'changePassword':
        setCurrentScreen('changePassword');
        break;
      case 'deleteAccount':
        setCurrentScreen('deleteAccount');
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    console.log('Languages:', selectedLanguages);
    console.log('Locations:', selectedLocations);
  };

  const handleReset = () => {
    setSelectedLanguages([]);
    setSelectedLocations([]);
    setNotifications(false);
    setPrivacy(false);
  };

  const auth = useContext(AuthContext);

  const randomNumber = Math.floor(Math.random() * 10000);

  return (
    <View className="flex-1 bg-background px-4 py-6 ">
      {currentScreen === 'main' && (
        <>
          <Text className="text-xl font-bold">{auth.name || `anonymous${randomNumber}`}</Text>
          <Text className="text-xl font-bold">{auth.email || 'No email available'}</Text>

          <CheckBox
            title="Allow Notification"
            isChecked={notifications}
            onPress={() => setNotifications(!notifications)}
          />
          <CheckBox title="privacy Mode" isChecked={privacy} onPress={() => setPrivacy(!privacy)} />

          <View className="z-30 mb-3 mt-3 ">
            <DropdownMenu
              placeholder="Language"
              items={languages}
              setValue={setSelectedLanguages}
              zIndex={3000}
              zIndexInverse={1000}
            />
            <View className="z-20  mt-3">
              <DropdownMenu
                placeholder="Locations"
                items={locations}
                setValue={setSelectedLocations}
                zIndex={2000}
                zIndexInverse={2000}
              />
            </View>
          </View>
          <View className="z-20  mt-1">
            <DropdownAdvanceSettings items={advancedSettings} onSelect={handleAdvancedSelect} />
          </View>

          <View className=" absolute bottom-4 ml-4 w-full items-center  ">
            <TwoButtons title1="Reset" title2="Save" handle1={handleReset} handle2={handleSubmit} />
          </View>
        </>
      )}
      {currentScreen === 'changeUsername' && (
        <ChangeUnami goBack={() => setCurrentScreen('main')} />
      )}

      {currentScreen === 'changePassword' && <ChangePass goBack={() => setCurrentScreen('main')} />}

      {currentScreen === 'deleteAccount' && (
        <DeleteAccount goBack={() => setCurrentScreen('main')} />
      )}
    </View>
  );
};

export default UserSettings;
