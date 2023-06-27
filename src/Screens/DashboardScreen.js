import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {useNavigation} from '@react-navigation/native';

import Lottie from 'lottie-react-native';

import {firebase} from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const DashboardScreen = () => {
  const navigation = useNavigation();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const [loading, setLoading] = useState(true);
  const [userFarmInfo, setUserFarmInfo] = useState('');

  const [sensorData, setSensorData] = useState([]);

  const currentUser = firebase.auth().currentUser;

  const [espSensorData, setEspSensorData] = useState([]);

  const handleFarmName = async text => {
    try {
      await firestore()
        .collection('users')
        .doc(currentUser.email)
        .set({
          farmName: text,
        })
        .then(() => {
          Alert.alert('Farm Name Updated!');
        });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserFarmInfo = () => {
    try {
      firestore()
        .collection('users')
        .doc(currentUser.email)
        .get()
        .then(snapshot => {
          setUserFarmInfo(snapshot.data());
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      Alert.alert(error);
    }
  };

  const fetchEsp = () => {
    try {
      const docRef = firebase.firestore().collection('ESP32').doc('1');

      const unsubscribe = docRef.onSnapshot(doc => {
        if (doc.exists) {
          setEspSensorData(doc.data());

          console.log(espSensorData); // Do whatever you need with the fetched data
        } else {
          // Document does not exist
          console.log('Document not found');
        }
      });

      // Return the unsubscribe function to stop listening for updates
      return unsubscribe;
    } catch (error) {
      console.error('Error listening to document:', error);
    }
  };

  // const fetchEsp = async () => {
  //   try {
  //     await firestore()
  //       .collection('ESP32')
  //       .doc('1')
  //       .get()
  //       .then(snapshot => {
  //         setEspSensorData(snapshot.data());
  //         console.log(espSensorData);
  //         setLoading(false);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //     Alert.alert(error);
  //   }
  // };

  const fetchDevicesData = async () => {
    try {
      const sensorDataRef = firebase
        .firestore()
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
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  const value = async deviceId => {
    try {
      const sensorDataRef = firestore()
        .collection('users')
        .doc(currentUser.email)
        .collection('devicesData');
      const deviceDocRef = sensorDataRef.doc(deviceId);

      await deviceDocRef.set(
        {
          sensorValues: firestore.FieldValue.arrayUnion({
            temp: espSensorData.tempF,
            humi: espSensorData.humi,
            behave: espSensorData.behave,
            timestamp: new Date(),
            health: espSensorData.health,
          }),
        },
        {merge: true},
      );

      console.log('value: ', deviceId);
    } catch (error) {
      console.error('Error value:', error);
    }
  };

  const logout = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.replace('Home');
        alert('Sign-Out Successfully!');
      });
  };

  useEffect(() => {
    // fetchEsp();
    fetchUserFarmInfo();
    fetchDevicesData();

    const interval = setInterval(() => {
      // fetchEsp();
      fetchDevicesData();
      value('1');
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    fetchEsp();
    const interval = setInterval(() => {
      fetchEsp();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

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
      {/* Top View */}
      <View
        style={{
          padding: 10,
        }}>
        <TouchableOpacity
          style={{
            height: 42,
            width: 42,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => logout()}>
          <Image
            source={require('../Images/logout-2.png')}
            style={{height: 50, width: 50}}
          />
        </TouchableOpacity>
      </View>

      {/* Name Text Label */}
      <View style={{alignItems: 'center'}}>
        <TextInput
          style={styles.titleName}
          onSubmitEditing={event => handleFarmName(event.nativeEvent.text)}>
          {userFarmInfo.farmName}
        </TextInput>
      </View>

      {/* Category Buttons*/}

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <Text style={{margin: 10, fontWeight: 'bold', fontSize: 28}}>
          What do you need?
        </Text>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* Cattles */}
            <TouchableOpacity
              style={styles.btnWrapper}
              onPress={() => navigation.navigate('CattleScreen')}>
              <Image
                source={require('../Images/status.png')}
                style={{height: 40, width: 40}}
              />
              <Text style={{fontWeight: '600', marginTop: 10, fontSize: 13}}>
                Cattles
              </Text>
            </TouchableOpacity>
            {/* Records */}
            <TouchableOpacity
              style={styles.btnWrapper}
              onPress={() => navigation.navigate('Records')}>
              <Image
                source={require('../Images/record.png')}
                style={{height: 40, width: 40}}
              />
              <Text style={{fontWeight: '600', marginTop: 10, fontSize: 13}}>
                Records
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* List of cows */}
      <View style={{padding: 10, flex: 2}}>
        <Text style={{fontWeight: 'bold', fontSize: 28}}>Highlights</Text>
        <View style={{marginTop: 20}}>
          <FlatList
            data={sensorData}
            keyExtractor={item => item.deviceId}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
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
                </View>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;

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
