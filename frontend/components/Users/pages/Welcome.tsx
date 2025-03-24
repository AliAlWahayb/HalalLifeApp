import { View, Text, ImageBackground,TouchableOpacity , Image} from 'react-native';
import WelcomeImge from '../../../assets/Welcome/WelcomeImge.png';
import GoogleImage from '../../../assets/Social/GoogleImge.png';
import FacebookImage from '../../../assets/Social/FacebookImge.png';
import Buttons from '../../Shared/components/FormElements/Buttons';
import { useNavigation } from '@react-navigation/native';



const Welcome = () => {

    const navigation = useNavigation();

    return(
        <ImageBackground 

          source={WelcomeImge}
          className='flex-1 justify-center items-center p-5'
          resizeMode='cover'>



            <View className="absolute inset-0 bg-black opacity-50" />

            <TouchableOpacity onPress={() => navigation.navigate('ThemedNavigation')} className='bg-[#77C273] rounded-full py-2  px-4 absolute top-8 right-8'>
                    <Text className="text-white  text-1xl font-bold ">skip</Text>
                  </TouchableOpacity>
            
              <View className='flex flex-col items-left mb-28 fixed'>
            
                  
                  <Text className='text-white text-6xl font-bold'>Welcome to </Text>
                  <Text className='text-green-500 font-bold text-5xl'>HalalLife</Text>
                  <Text className='text-gray-200 text-lg  font-bold ml-4'>Your favourite Halal</Text>
                  <Text className='text-gray-200 text-lg mb-40 ml-4 font-bold'>Community</Text>
                 
              </View>
            
            
               <View className='flex flex-col items-center '>
            
                <Text className='text-gray-400 text-1xl font-bold '>Sign in with</Text>
            
               </View >
            
               <View className=" flex-row  mt-4">
                 
                  <TouchableOpacity className="bg-white rounded-full px-6 py-4 flex flex-row items-center  ">
                    <Image source={FacebookImage} className="w-6 h-6 mr-2" />
                    <Text className="text-black font-semibold">Facebook</Text>
                  </TouchableOpacity>
            
                 
                  <TouchableOpacity className="bg-white rounded-full px-6 py-4 flex flex-row items-center ml-20">
                    <Image source={GoogleImage} className="w-6 h-6 mr-2" />
                    <Text className="text-black font-semibold">Google</Text>
                  </TouchableOpacity>
                  
                </View>
            
                <View className="">
            
                  <TouchableOpacity onPress={() => navigation.navigate('Registration',{ isLogin: false })} className="bg-black rounded-full px-8 py-4 m-4">
            
                    <Text className='text-white text-lg font-semibold'>Start with email or phone</Text>
            
                  </TouchableOpacity>
                  
                </View>
            
                  <Text 
                  
                  className='text-gray-300 mt-4 '> Already have an account?
            
                    <TouchableOpacity onPress={() => navigation.navigate('Auth')}
            
                     >
                    <Text className='underline text-gray-400 '>Log In</Text>
                    
                    </TouchableOpacity>
                    
                </Text>





          </ImageBackground>

    )

}

export default Welcome;

