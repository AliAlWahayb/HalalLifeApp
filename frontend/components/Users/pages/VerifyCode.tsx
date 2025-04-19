import { View } from "react-native";
import React from "react";
import VerifyCom from "../components/VerifyCom"; 
import Header from "../components/Header"; 

const VerifyCode = () => {
  return (
    <View className="flex-1 bg-white">
    
      <Header />

      
      <VerifyCom onVerify={(code: any) => console.log("Verification Code:", code)} />
    </View>
  );
};

export default VerifyCode;
