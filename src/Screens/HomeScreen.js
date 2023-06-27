import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.BG}>
      {/* Action Area */}
      <View style={styles.btnView}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.txtColor}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.txtColor}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imgView}>
        <Image source={require('../Images/Logo_3.png')} style={styles.img} />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  BG: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  imgView: {
    flex: 50,
    justifyContent: 'flex-end',
  },
  btnView: {
    flex: 50,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  btn: {
    height: 50,
    width: '40%',
    backgroundColor: '#fff',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#BCCFE3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  txtColor: {
    color: '#0087B2',
    fontSize: 18,
    fontWeight: 'bold',
  },
  img: {
    height: '85%',
    width: '75%',
  },
});
