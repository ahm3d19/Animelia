import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';

import auth from '@react-native-firebase/auth';
// import {sendPasswordResetEmail} from 'firebase/auth';
// import {auth} from './Firebase/firebase.config';

const ForgotScreen = () => {
  const [email, setUserEmail] = useState(null);

  const forgotPass = () => {
    if (email != null) {
      auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          // Password reset email sent!
          // ..
          Alert.alert('Password Reset E-mail has been sent Successfully!');
        })
        .catch(error => {
          const errorMessage = error.message;
          // ..
          Alert.alert(errorMessage);
        });
    } else {
      Alert.alert('Please Enter Valid E-mail');
    }
  };

  return (
    <View style={styles.BG}>
      <View style={styles.view}>
        <Text style={styles.forgotTxt}>Forgot Your Password ?</Text>
        <Text style={styles.confirmEmailTxt}>
          Confirm your Email we'll send the instructions.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={text => setUserEmail(text)}
        />
        <TouchableOpacity style={styles.btn} onPress={() => forgotPass()}>
          <Text style={styles.txtColor}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotScreen;

const styles = StyleSheet.create({
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
  },
});
