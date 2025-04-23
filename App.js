import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import PlantMonitoringScreen from './screens/PlantMonitoring'; // Import PlantMonitoring screen
import AddPlantScreen from './screens/AddPlant'; // Import AddPlant screen
import NamePlantScreen from './screens/NamePlantScreen';
import { PlantProvider } from './context/PlantContext'; // Import PlantProvider
import LoginScreen from './screens/LoginScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 2000); // 2 second splash screen
    return () => clearTimeout(timer);
  }, []);

  return (
    <PlantProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isSplashVisible ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : (
            <>
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="AddPlant" component={AddPlantScreen} />
              <Stack.Screen name="PlantMonitoring" component={PlantMonitoringScreen} />
              <Stack.Screen name="NamePlant" component={NamePlantScreen} />
              
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PlantProvider>
  );
}
