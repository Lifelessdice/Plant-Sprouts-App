import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import PlantMonitoringScreen from './screens/PlantMonitoring'; 
import AddPlantScreen from './screens/AddPlant'; 
import NamePlantScreen from './screens/NamePlantScreen';
import LoginScreen from './screens/LoginScreen';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
//import { connect } from './src/mqttservice'; 
import { auth } from './firebase';  

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Establish MQTT connection
    //connect();

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);  // Update the user state when authentication changes
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (  // If the user is authenticated, show the HomeScreen
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddPlant" component={AddPlantScreen} />
            <Stack.Screen name="PlantMonitoring" component={PlantMonitoringScreen} />
            <Stack.Screen name="NamePlant" component={NamePlantScreen} />
          </>
        ) : (  // If no user is logged in, show the LoginScreen
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
