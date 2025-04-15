import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PlantContext = createContext();

export const PlantProvider = ({ children }) => {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    try {
      const storedPlants = await AsyncStorage.getItem('plants');
      if (storedPlants) setPlants(JSON.parse(storedPlants));
    } catch (e) {
      console.log('Failed to load plants:', e);
    }
  };

  const addPlant = async (newPlant) => {
    try {
      // Use Date.now() to generate a unique ID for the plant
      const plantWithId = { ...newPlant, id: Date.now().toString() };

      const updatedPlants = [...plants, plantWithId];
      setPlants(updatedPlants);
      await AsyncStorage.setItem('plants', JSON.stringify(updatedPlants));
    } catch (e) {
      console.log('Failed to save plant:', e);
    }
  };

  const updatePlantNickname = async (plantWithNickname) => {
    try {
      const index = plants.findIndex(p => p.id === plantWithNickname.id);
      if (index !== -1) {
        const updatedPlants = [...plants];
        updatedPlants[index] = plantWithNickname;
        setPlants(updatedPlants);
        await AsyncStorage.setItem('plants', JSON.stringify(updatedPlants));
      }
    } catch (e) {
      console.log('Failed to update plant nickname:', e);
    }
  };

  return (
    <PlantContext.Provider value={{ plants, addPlant, updatePlantNickname }}>
      {children}
    </PlantContext.Provider>
  );
};

// Custom hook
export const usePlantContext = () => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlantContext must be used within a PlantProvider');
  }
  return context;
};
