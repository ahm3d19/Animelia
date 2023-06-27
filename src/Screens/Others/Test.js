import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';

import {firebase} from '@react-native-firebase/firestore';

const Test = () => {
  const [deviceId, setDeviceId] = useState('');
  const handleAddData = () => {
    storeSensorValue(deviceId); // Store the sensor value in Firestore for the device
  };
  const handleGetData = () => {
    retrieveSensorValues(deviceId); // Retrieve all sensor values from Firestore for the device
  };

  const handleGetLastData = () => {
    retrieveLastSensorValue(deviceId); // Retrieve the last sensor value from Firestore for the device
  };

  // Function to store a sensor value in Firestore for a specific device
  const storeSensorValue = async deviceId => {
    try {
      const sensorDataRef = firestore().collection('devicesData');
      const deviceDocRef = sensorDataRef.doc(deviceId);

      await deviceDocRef.set(
        {
          sensorValues: firestore.FieldValue.arrayUnion({
            temp: Math.floor(Math.random() * (100 - 10) + 10),
            humi: Math.floor(Math.random() * (100 - 10) + 10),
            lying: Math.floor(Math.random() * (100 - 10) + 10),
            standing: Math.floor(Math.random() * (100 - 10) + 10),
            feeding: Math.floor(Math.random() * (100 - 10) + 10),
            walking: Math.floor(Math.random() * (100 - 10) + 10),
            timestamp: new Date(),
            health: 'normal',
          }),
        },
        {merge: true},
      );

      console.log('Sensor value stored successfully.');
    } catch (error) {
      console.error('Error storing sensor value:', error);
    }
  };

  // Function to retrieve all sensor values for a specific device from Firestore
  const retrieveSensorValues = async deviceId => {
    try {
      const sensorDataRef = firebase.firestore().collection('devicesData');
      const deviceDocRef = sensorDataRef.doc(deviceId);

      const deviceDoc = await deviceDocRef.get();

      if (deviceDoc.exists) {
        const sensorValues = deviceDoc.data().sensorValues || [];
        console.log('Sensor values for device:', deviceId, ':', sensorValues);
      } else {
        console.log('Device document does not exist.');
      }
    } catch (error) {
      console.error('Error retrieving sensor values:', error);
    }
  };

  // Function to retrieve the last updated sensor value for a specific device from Firestore
  const retrieveLastSensorValue = async deviceId => {
    try {
      const sensorDataRef = firebase.firestore().collection('devicesData');
      const deviceDocRef = sensorDataRef.doc(deviceId);

      const deviceDoc = await deviceDocRef.get();

      if (deviceDoc.exists) {
        const sensorValues = deviceDoc.data().sensorValues || [];
        const lastSensorValue =
          sensorValues.length > 0
            ? sensorValues[sensorValues.length - 1]
            : null;
        console.log('Last sensor value for device:', lastSensorValue);
      } else {
        console.log('Device document does not exist.');
      }
    } catch (error) {
      console.error('Error retrieving sensor values:', error);
    }
  };

  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const sensorDataRef = firebase.firestore().collection('devicesData');
        const snapshot = await sensorDataRef.get();

        const data = [];
        snapshot.forEach(doc => {
          const deviceData = doc.data();
          const sensorValues = deviceData.sensorValues || [];
          const lastSensorValue =
            sensorValues.length > 0
              ? sensorValues[sensorValues.length - 1]
              : null;
          data.push({deviceId: doc.id, lastSensorValue});
        });

        setSensorData(data);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchSensorData();
  }, []);

  const renderSensorItem = ({item}) => {
    return (
      <View>
        <Text>Device ID: {item.deviceId}</Text>
        <Text>Sensor Values: {JSON.stringify(item.lastSensorValue)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Device ID"
        value={deviceId}
        onChangeText={setDeviceId}
        style={{padding: 20}}
      />

      <TouchableOpacity onPress={() => handleAddData()} style={{padding: 20}}>
        <Text>Add Device</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleGetData()} style={{padding: 20}}>
        <Text>Get Data</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleGetLastData()}
        style={{padding: 20}}>
        <Text>Get Last Data</Text>
      </TouchableOpacity>

      <FlatList
        data={sensorData}
        renderItem={renderSensorItem}
        keyExtractor={item => item.deviceId}
      />
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
