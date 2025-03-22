import Accordion from 'components/Shared/Accordion';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

const data = [
  {
    title: 'How to use the app?',
    link: 'https://www.youtube.com/embed/_wLqoYxxiJQ?si=6aaYSjR6QY7aX3-o',
  },
  {
    title: 'How to use Map',
    link: 'https://www.youtube.com/embed/_wLqoYxxiJQ?si=6aaYSjR6QY7aX3-o',
  },
  {
    title: 'How to use Chat',
    link: 'https://www.youtube.com/embed/_wLqoYxxiJQ?si=6aaYSjR6QY7aX3-o',
  },
  {
    title: 'How to use Search',
    link: 'https://www.youtube.com/embed/_wLqoYxxiJQ?si=6aaYSjR6QY7aX3-o',
  },
];

const Information = () => {
  return (
    <ScrollView className="bg-background flex-1 flex-col py-5">
      <Text className="text-primary text-center text-4xl font-bold">How To Page</Text>
      <View className="flex flex-col px-8 py-5">
        {data.map((item, index) => (
          <Accordion key={index} title={item.title}>
            <View className="flex w-full items-center justify-center">
              <WebView
                source={{ uri: item.link }}
                style={{ minHeight: 200 }}
                allowsInlineMediaPlayback
              />
            </View>
          </Accordion>
        ))}
      </View>
    </ScrollView>
  );
};

export default Information;
