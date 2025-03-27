import React from "react";
import { View, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');
const imageSize = width / 3;

const images = [

    require('../../../assets/Products/post.jpg'),
    require('../../../assets/Products/post.jpg'),
    require('../../../assets/Products/post.jpg'),
    require('../../../assets/Products/post.jpg'),
    require('../../../assets/Products/post.jpg'),
    require('../../../assets/Products/post.jpg'),




];
const PostCard = () => {
    const navigation = useNavigation();

    return(
        <FlatList
        data={images}
        numColumns={3}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
            <TouchableOpacity
            onPress={() => navigation.navigate('PostPreview')} //prblem with navigation
            style={{
                width: imageSize,
                height: imageSize,
                borderWidth: 0.5,
                backgroundColor: '#fff',
            }}

            >

                <Image
                    source={item}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    resizeMode='cover'
                />


            </TouchableOpacity>
        )}
        />
    )
};

export default PostCard;
