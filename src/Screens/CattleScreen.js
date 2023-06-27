import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Lottie from 'lottie-react-native';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/firestore';

import {Swipeable} from 'react-native-gesture-handler';

import {useNavigation} from '@react-navigation/native';

const CattleScreen = () => {
  const navigation = useNavigation();
  const currentUser = firebase.auth().currentUser;
  const [loading, setLoading] = useState(true);
  const [sensorData, setSensorData] = useState([]);
  useEffect(() => {
    fetchDevicesData();

    const interval = setInterval(() => {
      fetchDevicesData();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const fetchDevicesData = async () => {
    try {
      const sensorDataRef = firestore()
        .collection('users')
        .doc(currentUser.email)
        .collection('devicesData');
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      Alert.alert('Error fetching sensor data:', error);
      setLoading(false);
    }
  };
  // Function to delete a document by device ID
  const deleteDocumentByDeviceId = async deviceId => {
    try {
      const sensorDataRef = firestore()
        .collection('users')
        .doc(currentUser.email)
        .collection('devicesData');
      const deviceDocRef = sensorDataRef.doc(deviceId);

      await deviceDocRef.delete();

      Alert.alert('Successfully Deleted');
      fetchDevicesData();
      console.log('Document deleted successfully.');
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };
  const swipeableRef = React.useRef(null);

  const closeSwipeable = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };
  const renderSwipeableItem = item => {
    const rightButtons = [
      <TouchableOpacity
        key={item.deviceId} // Assign a unique key prop
        onPress={() => {
          deleteDocumentByDeviceId(item.deviceId);
          closeSwipeable();
        }}
        style={{
          height: 100,
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
          width: 75,
          borderRadius: 20,
        }}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>Delete</Text>
      </TouchableOpacity>,
    ];

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={() => (
          <View style={{justifyContent: 'center'}}>{rightButtons}</View>
        )}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() =>
            navigation.navigate('Detail', {deviceId: item.deviceId})
          }>
          <View style={styles.itemsWrapper}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              ID: {item.deviceId}
            </Text>
            <View>
              <Text>Health: {item.lastSensorValue.health}</Text>
              <Text>Status: {item.lastSensorValue.behave}</Text>
            </View>
            <View>
              <Text>Temp : {item.lastSensorValue.temp} ℉</Text>
              <Text>Humid : {item.lastSensorValue.humi} %</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <Lottie
          source={require('../Loading/Loader.json')}
          autoPlay
          loop
          style={{height: 160, width: 160}}
        />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 30,
          textAlign: 'center',
          color: '#0087B2',
          marginBottom: 20,
        }}>
        Cattles Data
      </Text>

      {/* List of cows */}
      <View style={{padding: 10, flex: 2}}>
        <View style={{flex: 1, marginTop: 20}}>
          <FlatList
            data={sensorData}
            keyExtractor={item => item.deviceId}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => renderSwipeableItem(item)}
          />
        </View>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#0087B2',
          position: 'absolute',
          height: 60,
          width: 100,
          margin: 15,
          borderRadius: 100,
          right: 20,
          bottom: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('Add')}>
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
            textAlign: 'center',
          }}>
          Add
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CattleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  titleName: {
    padding: 20,
    fontWeight: 'bold',
    fontSize: 38,
    color: '#0087B2',
  },
  itemsWrapper: {
    height: 100,
    width: '95%',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 20,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {height: 0, width: 0},
    backgroundColor: '#fff',
    margin: 10,
  },
  btnWrapper: {
    height: 90,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {height: 0, width: 0},
  },
});
