import TwoButtons from 'components/Shared/Buttons/TwoButtons';
import React, { useEffect } from 'react';
import { View, Text, BackHandler } from 'react-native';

import Checkbox from '../Shared/CheckBox/CheckBox';
import TextInputCheckBox from '../Shared/CheckBox/TextInputCheckBox';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from 'components/Shared/CustomAlert';

const ReportView = () => {
  const navigation = useNavigation();

  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = React.useState(false);
  const handleCloseSuccessAlert = () => {
    setIsSuccessAlertVisible(false);
  };
  const handleReport = () => {
    setIsSuccessAlertVisible(true);
  };
  const handleCancel = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const backAction = () => {
      (navigation.navigate as any)({ name: 'Scanner' });
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  return (
    <View className="flex-1 flex-col bg-background px-5 py-5 ">
      <Text className="text-center text-4xl font-bold text-primary">Reason For Report</Text>
      <View className="flex flex-col gap-2 py-3">
        <Checkbox title="Product is not halal" onPress={() => {}} />
        <Checkbox title="Product contains haram ingredients" onPress={() => {}} />
        <Checkbox title="Product is mislabeled" onPress={() => {}} />
        <Checkbox title="Product information is incomplete" onPress={() => {}} />
        <Checkbox title="Product packaging is misleading" onPress={() => {}} />
        <TextInputCheckBox title="Other (please specify)" onPress={() => {}} />
      </View>
      <View className="flex flex-col ">
        <Text className="text-2xl font-bold ">Hint</Text>
        <Text className=" text-textMuted">You Can Select More Than One</Text>
      </View>
      <View className="items-center">
        <TwoButtons title1="Cancel" title2="Report" handle1={handleCancel} handle2={handleReport} />
      </View>
      <CustomAlert
        visible={isSuccessAlertVisible}
        title="Report Sent"
        onClose={handleCloseSuccessAlert}
        confirmButtonText="Close"
      />
    </View>
  );
};

export default ReportView;
