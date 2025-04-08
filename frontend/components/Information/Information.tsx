import Accordion from 'components/Shared/Accordion';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

const data = [
  {
    title: 'How to use the app?',
    link: 'https://www.youtube.com/embed/_wLqoYxxiJQ',
  },
  {
    title: 'How to use Map',
    link: 'https://www.youtube.com/embed/_wLqoYxxiJQ',
  },
  {
    title: 'How to use Chat',
    link: 'https://www.youtube.com/embed/_wLqoYxxiJQ',
  },
  {
    title: 'How to use Search',
    link: 'https://www.youtube.com/embed/_wLqoYxxiJQ',
  },
];

const DESKTOP_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';

const Information = () => {
  return (
    <ScrollView className="flex-1 flex-col bg-background py-5">
      <Text className="text-center text-4xl font-bold text-primary">How To Page</Text>
      <View className="flex flex-col px-8 py-5">
        {data.map((item, index) => (
          <Accordion key={index} title={item.title}>
            <View className="flex h-64 w-full items-center justify-center">
              <WebView
                source={{ uri: item.link }}
                style={{ height: 200 }}
                allowsInlineMediaPlayback
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                userAgent={DESKTOP_USER_AGENT}
                allowsFullscreenVideo={false}
              />
            </View>
          </Accordion>
        ))}
      </View>
    </ScrollView>
  );
};

export default Information;
