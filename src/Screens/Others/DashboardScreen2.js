import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-paper';

const DashboardScreen2 = () => {
  const [farmName, setfarmName] = useState();
  const [temp, setTemp] = useState();
  const [humi, setHumi] = useState();
  const [date, setDate] = useState();
  const [status, setStatus] = useState();

  const navigation = useNavigation();

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     var date = new Date().getDate();
  //     var month = new Date().getMonth();
  //     var year = new Date().getFullYear();
  //     var hrs = new Date().getHours();
  //     var min = new Date().getMinutes();
  //     var sec = new Date().getSeconds();
  //     setDate(
  //       date + '/' + month + '/' + year + ' ' + hrs + ':' + min + ':' + sec,
  //     );
  //     upload();
  //   }, 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // });

  const upload = async () => {
    try {
      await firestore()
        .collection('records')
        .doc(currentUser.email)
        // .set(cattleData)
        .collection('cattleData')
        .add(cattleData)

        .then(() => {});
    } catch (error) {
      console.log(error);
    }
  };
  const cattleData = {
    date: date,
    humi: '42',
    temp: '102',
    activity: {
      lying: date,
      standing: date,
      feeding: date,
      walking: date,
    },
  };
  const logout = () => {
    auth()
      .signOut()
      .then(() => {
        // Sign-out successful.

        navigation.replace('Home');
        alert('Sign-Out Successfully!');
      })
      .catch(error => {
        // An error happened.
      });
  };

  const save = async () => {
    await firestore()
      .collection('users')
      .doc(currentUser.email)
      .set({
        farmName: farmName,
        temp: temp,
        status: status,
      })
      .then(() => {
        Alert.alert('Data Saved');
        console.log('User added!');
      });
  };
  const del = async () => {
    await firestore()
      .collection('users')
      .doc(currentUser.email)
      .delete()
      .then(() => {
        Alert.alert('Data Delete');
        console.log('User DEleted!');
      });
  };

  const show = () => {
    try {
      firestore()
        .collection('users')
        .doc(currentUser.email)
        .get()
        .then(documentSnapshot => {
          console.log('User exists: ', documentSnapshot.exists);

          if (documentSnapshot.exists) {
            console.log('User data: ', documentSnapshot.data());
            setfarmName(documentSnapshot.data().farmName);
            setTemp(documentSnapshot.data().temp);
            setStatus(documentSnapshot.data().status);
          }
        });
    } catch (error) {
      Alert.alert(error);
      console.log(error);
    }
  };
  const currentUser = firebase.auth().currentUser;
  return (
    <View style={styles.container}>
      <Text style={styles.lbl}>DashboardScreen</Text>
      <View style={{margin: 20}}>
        <Text>Date: {date}</Text>
        <Text>Farm Name: {farmName}</Text>
        <Text>Temp: {temp}</Text>
        <Text>Status: {status}</Text>
      </View>
      <TouchableOpacity onPress={() => logout()}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/126/126467.png',
          }}
          style={styles.optImg}
        />
      </TouchableOpacity>
      <TextInput
        style={{height: 50, width: '80%', margin: 20}}
        mode="outlined"
        label="Farm Name"
        placeholder="Enter Farm Name"
        outlineColor="#0087B2"
        activeOutlineColor="#0087B2"
        onChangeText={txt => setfarmName(txt)}
        // value={farmName}
      />
      <TextInput
        style={{height: 50, width: '80%', margin: 20}}
        mode="outlined"
        label="Temp"
        placeholder="Enter ur Temp"
        outlineColor="#0087B2"
        activeOutlineColor="#0087B2"
        onChangeText={txt => setTemp(txt)}
        // value={farmName}
      />
      <TextInput
        style={{height: 50, width: '80%', margin: 20, backgroundColor: 'blue'}}
        mode="outlined"
        label="Status"
        placeholder="Enter ur status"
        outlineColor="#0087B2"
        activeOutlineColor="#0087B2"
        onChangeText={txt => setStatus(txt)}
        // value={farmName}
      />
      <TouchableOpacity
        style={{
          height: 40,
          width: '40%',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderRadius: 20,
          borderColor: '#0087B2',
          margin: 20,
        }}
        onPress={() => del()}>
        <Text style={{color: '#0087B2', fontWeight: 'bold'}}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          height: 40,
          width: '40%',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderRadius: 20,
          borderColor: '#0087B2',
          marginBottom: 20,
        }}
        onPress={() => save()}>
        <Text style={{color: '#0087B2', fontWeight: 'bold'}}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          height: 40,
          width: '40%',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderRadius: 20,
          borderColor: '#0087B2',
          marginBottom: 20,
        }}
        onPress={() => show()}>
        <Text style={{color: '#0087B2', fontWeight: 'bold'}}>Show</Text>
      </TouchableOpacity>
      <Text></Text>
    </View>
  );
};

export default DashboardScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#fff',
  },
  lbl: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  optImg: {
    height: 30,
    width: 30,
    borderRadius: 10,
  },
});
