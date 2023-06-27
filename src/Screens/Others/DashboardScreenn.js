import {
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import {FAB, AnimatedFAB} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {firebase} from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const DashboardScreenn = () => {
  const [data, setData] = useState([]);
  const [farmName, setfarmName] = useState();
  const navigation = useNavigation();
  const data2 = [
    {id: 1, temp: 30, sit: 'yes', humi: 33, health: 'normal'},
    {id: 2, temp: 40, sit: 'yes', humi: 33, health: 'normal'},
    {id: 3, temp: 50, sit: 'yes', humi: 33, health: 'normal'},
    {id: 4, temp: 30, sit: 'yes', humi: 33, health: 'normal'},
    {id: 5, temp: 40, sit: 'yes', humi: 33, health: 'normal'},
    {id: 6, temp: 50, sit: 'yes', humi: 33, health: 'normal'},
  ];

  useEffect(() => {
    show();
  }, []);

  const logout = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.replace('Home');
        alert('Sign-Out Successfully!');
      });
  };
  const show = () => {
    try {
      firestore()
        .collection('users')
        .doc(currentUser.email)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            setData(documentSnapshot._data);
            setfarmName(documentSnapshot._data.cattle[0].farmName);
            // console.log(documentSnapshot);
            console.log(documentSnapshot._data);
            // console.log(documentSnapshot._data.cattleData[0].Activity[0]);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  const currentUser = firebase.auth().currentUser;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff', padding: 10}}>
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
            source={require('./Images/option.png')}
            style={{height: 30, width: 30}}
          />
        </TouchableOpacity>
      </View>

      {/* Name Text Label */}
      <View style={{alignItems: 'center', padding: 20}}>
        <Text style={{fontWeight: 'bold', fontSize: 38, color: '#0087B2'}}>
          {farmName}
        </Text>
      </View>

      {/* Button Title View */}
      <View style={{padding: 10}}>
        <Text style={{fontWeight: 'bold', fontSize: 28}}>
          {'What do you need?'}
        </Text>
      </View>

      {/* Category Buttons*/}
      <View
        style={{
          padding: 10,
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* Status */}
            <TouchableOpacity
              style={{
                height: 90,
                width: 90,
                justifyContent: 'center',
                alignItems: 'center',
                margin: 10,
                backgroundColor: '#fff',
                borderRadius: 20,
                shadowRadius: 5,
                shadowOpacity: 0.3,
                shadowOffset: {height: 0, width: 0},
              }}
              onPress={() => navigation.navigate('Status')}>
              <Image
                source={require('./Images/status.png')}
                style={{height: 40, width: 40}}
              />
              <Text style={{fontWeight: '600', marginTop: 10, fontSize: 13}}>
                Status
              </Text>
            </TouchableOpacity>
            {/* Records */}
            <TouchableOpacity
              style={{
                height: 90,
                width: 90,
                justifyContent: 'center',
                alignItems: 'center',
                margin: 10,
                backgroundColor: '#fff',
                borderRadius: 20,
                shadowRadius: 5,
                shadowOpacity: 0.3,
                shadowOffset: {height: 0, width: 0},
              }}
              onPress={() => navigation.navigate('Record')}>
              <Image
                source={require('./Images/record.png')}
                style={{height: 40, width: 40}}
              />
              <Text style={{fontWeight: '600', marginTop: 10, fontSize: 13}}>
                Records
              </Text>
            </TouchableOpacity>
            {/* Medical */}
            <TouchableOpacity
              style={{
                height: 90,
                width: 90,
                justifyContent: 'center',
                alignItems: 'center',
                margin: 10,
                backgroundColor: '#fff',
                borderRadius: 20,
                shadowRadius: 5,
                shadowOpacity: 0.3,
                shadowOffset: {height: 0, width: 0},
              }}>
              <Image
                source={require('./Images/doctor.png')}
                style={{height: 40, width: 40}}
              />
              <Text style={{fontWeight: '600', marginTop: 10, fontSize: 13}}>
                Medical
              </Text>
            </TouchableOpacity>
            {/* Notice
            <TouchableOpacity
              style={{
                height: 90,
                width: 90,
                justifyContent: 'center',
                alignItems: 'center',
                margin: 10,
                backgroundColor: '#fff',
                borderRadius: 20,
                shadowRadius: 5,
                shadowOpacity: 0.3,
                shadowOffset: {height: 0, width: 0},
              }}>
              <Image
                source={require('./Images/notice.png')}
                style={{height: 40, width: 40}}
              />
              <Text style={{fontWeight: '600', marginTop: 10, fontSize: 13}}>
                Notice
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>

      {/* List of cows */}
      <View style={{padding: 10, flex: 2}}>
        <Text style={{fontWeight: 'bold', fontSize: 28}}>Highlights</Text>
        <View style={{marginTop: 20}}>
          <FlatList
            data={data.cattle}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      height: 90,
                      width: '90%',
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
                    }}
                    onPress={() =>
                      navigation.navigate('Detail', {cattleData:data})
                    }>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                      ID: {item.id}
                    </Text>
                    <Text>Health: {item.healthStatus}</Text>
                    <View>
                      <Text>Temp: {item.temp}</Text>
                      <Text>Humi: {item.humi}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </View>

      <FAB
        icon={() => (
          <Image
            source={require('./Images/add.png')}
            style={{
              width: 32,
              height: 32,
              tintColor: '#fff',
            }}
          />
        )}
        animated={false}
        style={{
          backgroundColor: '#0087B2',
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          shadowRadius: 5,
          shadowOpacity: 0.2,
          shadowOffset: {height: 0, width: 0},
        }}
        onPress={() => navigation.navigate('Add')}
      />
    </SafeAreaView>
  );
};

export default DashboardScreenn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
