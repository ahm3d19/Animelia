import { Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {useNavigation} from '@react-navigation/native';
import Lottie from 'lottie-react-native';

const SplashScreenLoader = () => {
  const navigation = useNavigation();

  setTimeout(() => {
    navigation.replace('NetStatus');
  }, 2000);
  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require('../../Images/Logo.png')} />
      <Text style={styles.txt}>Animelia</Text>
      <Lottie
        source={require('../../Loading/Loader.json')}
        autoPlay
        loop
        style={{height: 160, width: 160}}
      />
    </View>
  );
};

export default SplashScreenLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  img: {
    height: 200,
    width: 200,
  },
  txt: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#0087B2',
    marginBottom: 20,
  },
});
