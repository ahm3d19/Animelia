import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import React, {useState, useEffect} from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/firestore';
const AddScreen = () => {
  const [deviceId, setDeviceId] = useState('');
  const currentUser = firebase.auth().currentUser;
  // Function to store a sensor value in Firestore for a specific device
  const storeSensorValue = async deviceId => {
    try {
      const sensorDataRef = firestore()
        .collection('users')
        .doc(currentUser.email)
        .collection('devicesData');
      const deviceDocRef = sensorDataRef.doc(deviceId);

      await deviceDocRef.set(
        {
          sensorValues: firestore.FieldValue.arrayUnion({
            temp: Math.floor(Math.random() * (100 - 10) + 10),
            humi: Math.floor(Math.random() * (100 - 10) + 10),
            behave: 'Active',
            timestamp: new Date(),
            health: 'normal',
          }),
        },
        {merge: true},
      );

      console.log('Successfully Added');
      Alert.alert('Successfully Added');
    } catch (error) {
      console.error('Error storing sensor value:', error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.view}>
        <Text style={styles.forgotTxt}>Add Cattle</Text>
        <Text style={styles.confirmEmailTxt}>Enter Your Cattle Device ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Device ID"
          onChangeText={text => setDeviceId(text)}
        />
        <TouchableOpacity
          style={styles.btn}
          onPress={() => storeSensorValue(deviceId)}>
          <Text style={styles.txtColor}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  BG: {
    flex: 1,
    backgroundColor: '#fff',
  },
  view: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotTxt: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0087B2',
    marginBottom: 50,
  },
  confirmEmailTxt: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0087B2',
    marginBottom: 50,
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
  bckBtn: {
    flex: 20,
    justifyContent: 'center',

    marginLeft: 20,
  },
  txtColor: {
    color: '#0087B2',
    fontSize: 17,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    width: '80%',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#BCCFE3',
    borderRadius: 30,
    marginBottom: 15,
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    color: '#0087B2',
  },
});
