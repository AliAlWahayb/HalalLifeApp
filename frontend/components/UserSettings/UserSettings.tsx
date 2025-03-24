import React, { useState } from 'react';
import { View , Text , TouchableOpacity} from 'react-native';
import CheckBox from 'components/Shared/CheckBox/CheckBox';
import { useNavigation } from '@react-navigation/native';
import TwoButtons from '../Shared/Buttons/TwoButtons';
import DropdownMenu from '../Shared/DropdownMenu';
import DropdownAdvanceSettings from './com/DropdownAdvanceSettings';


const UserSettings = () => {

    const navigation = useNavigation();

    const [notifications,setNotifications] = useState(false);
    const[privacy,setPrivacy] = useState(false);
  

    const [selectedLanguages,setSelectedLanguages] = useState<string[]>([]);
    const [selectedLocations,setSelectedLocations] = useState<string[]>([]);
   

    const languages = [
      {label:'English',value:'en'},
      {label:'Arabic',value:'ar'},
      {label: 'French',value:'fr'},
    ];

    const locations = [
      {label:'Saudi Arabia',value:'sa'},
      {label:'UAE',value:'uae'},
      {label:'USA',value:'us'}
    ];

    const advancedSettings = [
      { label: 'Change Username', value: 'changeUsername' },
      { label: 'Change Password', value: 'changePassword' },
      { label: 'DELETE ACCOUNT', value: 'deleteAccount', danger: true },
    ];
    
    const handleAdvancedSelect = (value: string) => {
      console.log('Selected advanced option:', value);
      switch (value) {
        case 'changeUsername':
          navigation.navigate('ChangeUnami');
          break;
          case 'changePassword':
            navigation.navigate('ChangeUnami');
            break;
            case 'deleteAccount':
              navigation.navigate('DeleteAccount');
              break;
              default:
                break;
      

    };
  };



    const handleSubmit = () => {
      console.log('Languages:',selectedLanguages);
      console.log('Locations:',selectedLocations);
    
    };

    const handleReset = () => {
      setSelectedLanguages([]);
      setSelectedLocations([]);
      setNotifications(false);
      setPrivacy(false);
    };

  return (
    <View className='flex-1 bg-white px-4 py-6 '>

        <Text className='text-xl font-bold '>UserName</Text>
        <Text className='text-xl font-bold'>Email@Email.com</Text>
        <Text className='text-xl text-gray-300 font-bold'>Date Created</Text>

        <CheckBox 
        title='Allow Notification'
        isChecked={notifications}
        onPress={()=>setNotifications(!notifications)}
        />
      <CheckBox 
        title='privacy Mode'
        isChecked={privacy}
        onPress={()=>setPrivacy(!privacy)}
        />

        <View className='mt-3 mb-3 z-30 '>
          <DropdownMenu
          placeholder="Language"
          items={languages}
          setValue={setSelectedLanguages}
          zIndex={3000}
          zIndexInverse={1000}
          />
         <View className='mt-3  z-20'>
          <DropdownMenu
          placeholder="Locations"
          items={locations}
          setValue={setSelectedLocations}
          zIndex={2000}
          zIndexInverse={2000}
          />
          </View>
        </View>
        <View className='mt-1  z-20'>
        <DropdownAdvanceSettings
        items={advancedSettings}
        onSelect={handleAdvancedSelect}
        />
        </View>

       

        
        <View className=" items-center absolute bottom-4 w-full ml-4  ">
        <TwoButtons
         title1="Reset"
          title2="Save"
          handle1={handleReset}
           handle2={handleSubmit} 
            />
        </View>

    </View>
    

  );
};

export default UserSettings;
