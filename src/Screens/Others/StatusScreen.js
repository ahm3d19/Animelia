import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import {firebase} from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const StatusScreen = () => {
  const [search, setSearch] = useState();
  const navigation = useNavigation();
  const [data, setData] = useState([]);
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
  const show = () => {
    try {
      firestore()
        .collection('users')
        .doc(currentUser.email)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            setData(documentSnapshot._data);
            // setfarmName(documentSnapshot._data.cattle[0].farmName);
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
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 30,
          textAlign: 'center',
          color: '#0087B2',
        }}>
        Status
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 20,
        }}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          onChangeText={text => setSearch(text)}
        />
        <TouchableOpacity>
          <Image
            source={require('./Images/search.png')}
            style={{height: 38, width: 38}}
          />
        </TouchableOpacity>
      </View>
      {/* List of cows */}
      <View style={{padding: 10, flex: 2}}>
        <Text style={{fontWeight: 'bold', fontSize: 28}}>Cow's Data</Text>
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
                      navigation.navigate('Detail', {cattleData: data})
                    }>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                      ID: {item.id}
                    </Text>
                    <Text>Health: {item.health}</Text>
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
    </View>
  );
};

export default StatusScreen;

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: '80%',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#BCCFE3',
    borderRadius: 30,
    marginBottom: 15,
    color: '#0087B2',
  },
});
