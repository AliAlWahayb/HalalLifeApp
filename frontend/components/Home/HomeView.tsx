import { View, Text, ImageBackground,TouchableOpacity , Image} from 'react-native';
import Home from '../../assets/Home.png';
import GoogleImage from '../../assets/GoogleImge.png';
import FacebookImage from '../../assets/FacebookImge.png';
import Buttons from '../../Shared/components/FormElements/Buttons'; 


const HomeView = ({ navigation , onPress }) => {

  const handlePress = () => {
  onPress();

  };
return (
  <ImageBackground

  source={Home}
  className='flex-1 justify-center items-center p-5'
  resizeMode='cover'>

  <View className="absolute inset-0 bg-black opacity-50" />

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

      <TouchableOpacity onPress={() => navigation.navigate('Auth')} className="bg-black rounded-full px-8 py-4 m-4">

        <Text className='text-white text-lg font-semibold'>Start with email or phone</Text>

      </TouchableOpacity>
      
    </View>

      <Text 
      
      className='text-gray-300 mt-4 '> Already have an account?

        <TouchableOpacity

         onPress={() => navigation.navigate('Auth')}>
        <Text className='underline text-gray-400 '>Sign Up</Text>
        
        </TouchableOpacity>
        
    </Text>
      

  </ImageBackground>
)

}
export default HomeView;