import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import HomeScreen from './HomeScreen';
import DashboardScreen from './DashboardScreen';

const AuthStateCheck = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return <HomeScreen />;
  }

  return <DashboardScreen />;
};

export default AuthStateCheck;
