import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import AuthStateCheck from '../AuthStateCheck';

import Lottie from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';

const Status = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(true);
  const handleCheckConnection = () => {
    navigation.replace('Splash');
  };
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  if (isConnected) {
    return <AuthStateCheck />;
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <Lottie
        source={require('../../Loading/13262-no-internet-connection.json')}
        autoPlay
        loop
        style={{height: 200, width: 200}}
      />
      <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>
        Oops!
      </Text>
      <Text style={{fontSize: 16, fontWeight: '500', marginBottom: 20}}>
        Please Check Your Internet Connection
      </Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => handleCheckConnection()}>
        <Text style={styles.txtColor}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Status;

const styles = StyleSheet.create({
  btn: {
    height: 40,
    width: '30%',
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#BCCFE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtColor: {
    color: '#0087B2',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
