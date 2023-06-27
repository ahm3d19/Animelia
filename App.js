import {NavigationContainer} from '@react-navigation/native';
import {StyleSheet} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from './src/Screens/Authentication/LoginScreen';
import HomeScreen from './src/Screens/HomeScreen';
import RegisterScreen from './src/Screens/Authentication/RegisterScreen';
import ForgotScreen from './src/Screens/Authentication/ForgotScreen';
import DashboardScreen from './src/Screens/DashboardScreen';
import AuthStateCheck from './src/Screens/AuthStateCheck';
import SplashScreenLoader from './src/Screens/Loader/SplashScreenLoader';
import DetailScreen from './src/Screens/DetailScreen';
import RecordsScreen from './src/Screens/RecordsScreen';
import Status from './src/Screens/CheckConnection/Status';
import AddScreen from './src/Screens/Others/AddScreen';
import CattleScreen from './src/Screens/CattleScreen';

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={SplashScreenLoader}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NetStatus"
          component={Status}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="StateCheck"
          component={AuthStateCheck}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={styles.backNav}
        />
        <Stack.Screen
          name="Forgot Password"
          component={ForgotScreen}
          options={styles.backNav}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={styles.backNav}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={styles.backNav}
        />
        <Stack.Screen
          name="Records"
          component={RecordsScreen}
          options={styles.backNav}
        />
        <Stack.Screen
          name="Add"
          component={AddScreen}
          options={styles.backNav}
        />
        <Stack.Screen
          name="CattleScreen"
          component={CattleScreen}
          options={styles.backNav}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  backNav: {
    headerTitle: '',
    headerStyle: {
      borderWidth: 0,
      shadowOpacity: 0,
      backgroundColor: '#fff',
    },
    headerTintColor: '#0087B2',
    headerBackTitle: ' ',
  },
});
