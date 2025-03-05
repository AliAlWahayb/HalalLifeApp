import React from 'react';
import { Dimensions } from 'react-native';
import { Carousel } from 'react-native-snap-carousel';

import CarouselContainer from './CarouselContainer';

const renderItem = ({ item, index }: { item: any; index: number }) => {
  return (
    <CarouselContainer
      baseData={{ item, index, dataIndex: index }}
      onPress={() => {console.log(item.title)}}
      key={index}
    />
  );
};

const AlternativeCarousel = ({ carouselItems }: { carouselItems: any[] }) => {
  const width = Dimensions.get('window').width;

  return (
    <Carousel
      data={carouselItems}
      renderItem={renderItem}
      sliderWidth={width}
      itemWidth={width * 0.33}
      vertical={false}
      layout="default"
      loop
      autoplay
      inactiveSlideOpacity={1}
      inactiveSlideScale={1}
    />
  );
};

export default AlternativeCarousel;
