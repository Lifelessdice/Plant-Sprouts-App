import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { popularPlants } from '../data/popularPlants';
import TopBar from '../components/TopBar';
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function AddPlantScreen({ navigation }) {
  const [firebaseData, setFirebaseData] = useState([]); // State to store Firebase data
  const [loading, setLoading] = useState(true); // State to track loading status

  // Fetch data from Firebase when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all documents from 'plants' collection
        const snapshot = await getDocs(collection(db, 'plants'));
        // Map the documents into usable objects with ids
        const plantsFromFirebase = snapshot.docs.map(doc => ({
          id: doc.id, // get the document id
          ...doc.data(), // get the plant data
        }));
        setFirebaseData(plantsFromFirebase); // Store data in state
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching Firebase data:', error);
        setLoading(false); // Stop loading even in case of error
      }
    };

    fetchData();
  }, []);

  // Merge Firebase data into static local data
  const mergedPlants = popularPlants.map((localPlant) => {
    
    // Try to find matching Firebase data by id
    const cloudPlant = firebaseData.find(p => p.id === localPlant.id) || {};
    return {
      ...localPlant, 
      generalInfo: cloudPlant.generalInfo || localPlant.generalInfo,
      preferredSoilMoisture: cloudPlant.preferredSoilMoisture || localPlant.preferredSoilMoisture,
      preferredHumidity: cloudPlant.preferredHumidity || localPlant.preferredHumidity,
      preferredTemperature: cloudPlant.preferredTemperature || localPlant.preferredTemperature,
      preferredLight: cloudPlant.preferredLight || localPlant.preferredLight,
    };
  });

  // Handle plant selection
  const handleSelectPlant = (plant) => {
    const auth = getAuth();
    const user = auth.currentUser;  // Get the current user
    if (user) {
      const uid = user.uid;  // Get the user's UID
      navigation.navigate('NamePlant', { plant, uid });  // Pass the plant and UID
    } else {
      Alert.alert('Please log in to proceed.');
    }
  };

  return (
    <>
      {/* Top navigation bar */}
      <TopBar
        title="List of available plants"
        onBackPress={() => navigation.goBack()}
        onUserPress={() => navigation.navigate('Account')}
      />

      {/* Main Content */}
      <View style={styles.container}>
        <Text style={styles.title}>Choose a Plant</Text>
        
        {/* Show loading indicator while fetching data */}
        {loading ? (
          <Text style={styles.loadingText}>Loading plants...</Text>
        ) : (
          <FlatList
            data={mergedPlants}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => handleSelectPlant(item)}>
                <Image source={item.image} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </>
  );
}

// Styles for the screen
const styles = StyleSheet.create({
  title: {
    ...fonts.title,  
    color: colors.primaryText,
    marginBottom: 20,
    marginTop: 20,
    alignSelf: 'center',
  },

  container: {
    flex: 1,
    paddingTop: 80, 
    paddingHorizontal: 20,
    backgroundColor: colors.background, 
  },
  list: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.cardBackground,     
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  name: {
  ...fonts.cardTitle,  
    color: colors.primaryText,  
  },
  loadingText: {
    ...fonts.body,
    color: colors.primaryText,
    textAlign: 'center',
  },
});
