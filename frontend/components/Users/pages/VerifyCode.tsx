import { View } from "react-native";
import React from "react";
import VerifyCom from "../components/VerifyCom"; // ✅ مكون إدخال الكود
import Header from "../components/Header"; // ✅ الهيدر

const VerifyCode = () => {
  return (
    <View className="flex-1 bg-white">
      {/* ✅ إضافة الهيدر */}
      <Header />

      {/* ✅ إضافة مكون إدخال الكود */}
      <VerifyCom onVerify={(code) => console.log("Verification Code:", code)} />
    </View>
  );
};

export default VerifyCode;
