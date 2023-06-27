import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Platform,
} from 'react-native';
import React, {useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Lottie from 'lottie-react-native';
const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
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
  const handleEmailChange = value => {
    setEmail(value);
    setEmailError('');
  };

  const handlePasswordChange = value => {
    setPassword(value);
    setPasswordError('');
  };
  const handleSubmit = () => {
    // validate email
    if (!email) {
      setEmailError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
    }

    // validate password
    if (!password) {
      setPasswordError('Password is required');
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    }
  };

  const login = async () => {
    if ((email, password != null)) {
      setIsLoading(true);
      await auth()
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          // Signed in
          navigation.replace('Dashboard');
          setIsLoading(false);
          // ...
        })
        .catch(error => {
          setIsLoading(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          switch (errorCode) {
            case 'auth/wrong-password':
              Alert.alert(
                'The password is invalid or the user does not have a password.',
              );
              break;
            case 'auth/weak-password':
              Alert.alert('The given password is invalid.');
              break;
            case 'auth/user-not-found':
              Alert.alert(
                'There is no user record corresponding to this identifier. The user may have been deleted.',
              );
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
        });
    } else {
      Alert.alert('Fill All Input Fields');
    }
  };

  return (
    <View style={styles.BG}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.BG}>
        <View style={styles.loginTxtView}>
          <Text
            style={{
              fontSize: 34,
              fontWeight: 'bold',
              color: '#0087B2',
              marginBottom: 10,
            }}>
            Sign In
          </Text>
          <Text style={{fontSize: 34, fontWeight: 'bold', color: '#0087B2'}}>
            Welcome Back!
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#0087B2',
              marginTop: 10,
            }}>
            Hey! Good to see you again.
          </Text>
        </View>
        {/* Input Area */}
        <View style={styles.view}>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize={false}
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Email"
            // value="u123@g.com"
          />
          {emailError ? <Text>{emailError}</Text> : null}
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            placeholder="Password"
            // u12345
          />
          {passwordError ? <Text>{passwordError}</Text> : null}
        </View>
        {/* Action Area */}
        <View style={styles.view}>
          <TouchableOpacity style={styles.btn} onPress={() => login()}>
            <Text style={styles.txtColor}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Forgot Password')}>
            <Text style={styles.forgotBtn}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.view, {flexDirection: 'row'}]}>
          <Text>Don't have an Account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupBtn}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

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
  view: {
    flex: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bckBtn: {
    flex: 50,
    justifyContent: 'center',
    marginLeft: 20,
  },
  loginTxtView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 70,
    marginLeft: 30,
  },
  img: {
    height: 250,
    width: 250,
    borderRadius: 100,
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
  txtColor: {
    color: '#0087B2',
    fontSize: 17,
    fontWeight: 'bold',
  },
  forgotBtn: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0087B2',
  },
  signupBtn: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0087B2',
  },
});
