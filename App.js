import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import PlantMonitoringScreen from './screens/PlantMonitoring'; 
import AddPlantScreen from './screens/AddPlant'; 
import NamePlantScreen from './screens/NamePlantScreen';
import { PlantProvider } from './context/PlantContext'; 
import LoginScreen from './screens/LoginScreen';
import { connect } from './src/mqttservice'; 
const Stack = createNativeStackNavigator();

export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    // Establish MQTT connection
    connect();
  }, []);

  return (
    <PlantProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
  
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="AddPlant" component={AddPlantScreen} />
              <Stack.Screen name="PlantMonitoring" component={PlantMonitoringScreen} />
              <Stack.Screen name="NamePlant" component={NamePlantScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PlantProvider>
  );
}
