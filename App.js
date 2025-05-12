import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import PlantMonitoringScreen from './screens/PlantMonitoring'; 
import AddPlantScreen from './screens/AddPlant'; 
import NamePlantScreen from './screens/NamePlantScreen';
import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';  
import { getAuth, onAuthStateChanged } from 'firebase/auth';
//import { connect } from './src/mqttservice'; 
import { auth } from './firebase';  

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [isSplashVisible, setSplashVisible] = useState(true);


  useEffect(() => {
    // Establish MQTT connection
    //connect();

    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 2000); // 2 second splash screen

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);  // Update the user state when authentication changes
    });

    return () => unsubscribe();
  }, []);

  return (
<NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSplashVisible ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddPlant" component={AddPlantScreen} />
            <Stack.Screen name="PlantMonitoring" component={PlantMonitoringScreen} />
            <Stack.Screen name="NamePlant" component={NamePlantScreen} />
          </>
        ) : (
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}