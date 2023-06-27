import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {firebase} from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth';

import Lottie from 'lottie-react-native';

const RegisterScreen = () => {
  const navigation = useNavigation();

  const currentUser = firebase.auth().currentUser;

  const [dairyName, setDairyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <Lottie
          source={require('../../Loading/Loader.json')}
          autoPlay
          loop
          style={{height: 160, width: 160}}
        />
      </View>
    );
  }
  const signup = async () => {
    if ((email, password, dairyName != '')) {
      setIsLoading(true);
      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          // Signed in
          // Get the newly created user's ID
          const docName = userCredential.user.email;

          // Create a new collection in Firestore with the user ID as the collection name
          firebase
            .firestore()
            .collection('users')
            .doc(docName)
            .set({
              // Add initial data for the collection if needed
              farmName: dairyName,
            })
            .then(() => {
              console.log('Collection created in Firestore successfully!');
            })
            .catch(error => {
              console.error('Error creating collection in Firestore: ', error);
            });
          navigation.replace('Dashboard');

          setIsLoading(false);
          // ...
        })
        .catch(error => {
          setIsLoading(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          switch (errorCode) {
            case 'auth/weak-password':
              Alert.alert('The given password is invalid.');
              break;
            case 'auth/invalid-email':
              Alert.alert('The email address is badly formatted.');
              break;
            case 'auth/network-request-failed':
              Alert.alert('A network error has occured, please try again.');
              break;
            default:
              Alert.alert(errorMessage);
              break;
          }
          console.log(errorCode);
          console.log(errorMessage);
          // ..
        });
    } else {
      Alert.alert('Fill All Input Fields');
    }
  };

  return (
    <SafeAreaView style={styles.BG}>
      <KeyboardAvoidingView
        style={styles.signupTxtView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text
          style={{
            fontSize: 34,
            fontWeight: 'bold',
            color: '#0087B2',
            marginTop: 10,
          }}>
          Sign Up
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#0087B2',

            marginVertical: 20,
          }}>
          We are happy to see you here!
        </Text>
        {/* Input Area */}
        <TextInput
          style={styles.input}
          placeholder="Dairy Name"
          autoCapitalize={false}
          onChangeText={text => setDairyName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize={false}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Password"
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity style={styles.btn} onPress={() => signup()}>
          <Text style={styles.txtColor}>Sign up</Text>
        </TouchableOpacity>

        {/* Bottom Area */}
        <Text>Already have an Account ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginBtn}>Sign in</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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
  signupTxtView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    flex: 1,
  },
  view: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bckBtn: {
    marginTop: 20,

    justifyContent: 'center',
    marginLeft: 20,
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
  img: {
    height: 250,
    width: 250,
    borderRadius: 100,
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
  loginBtn: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0087B2',
  },
});
