import { View , Text } from 'react-native';
import Buttons from '../../Shared/components/FormElements/Buttons'; // copy this component in your page for using this button



const Auth = () => {

    return (
        <View className="flex-1 justify-center items-center bg-white">
            <Text className="text-2xl font-bold text-blue-500">
                HalalLife Auth Page
            </Text>
            <Buttons />
        </View>
    )




}

export default Auth;