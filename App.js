import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import PlantMonitoringScreen from './screens/PlantMonitoring'; // Import your PlantMonitoring screen
import AddPlantScreen from './screens/AddPlant'; // Import your AddPlant screen

const Stack = createNativeStackNavigator();

export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 1000); // 1 second splash
    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSplashVisible ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddPlant" component={AddPlantScreen} />
            <Stack.Screen name="PlantMonitoring" component={PlantMonitoringScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}