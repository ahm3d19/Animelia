import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  TextInput,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.BG}>
      <View style={styles.profileTxtView}>
        <Text style={styles.profileTxt}>Profile Details</Text>
      </View>
      <View style={styles.bottomView}>
        <TextInput style={styles.input} placeholder="Email" />
        <TextInput style={styles.input} placeholder="Contact No" />
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnTxt}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  BG: {
    flex: 1,
    backgroundColor: '#FAFAFB',
  },
  profileTxtView: {
    flex: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView: {
    flex: 70,
    alignItems: 'center',
  },
  input: {
    height: 50,
    width: '80%',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#BCCFE3',
    borderRadius: 100,
    marginBottom: 15,
  },
  profileTxt: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0087B2',
  },
  btnTxt: {
    color: '#0087B2',
    fontSize: 17,
    fontWeight: 'bold',
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
  },
});
