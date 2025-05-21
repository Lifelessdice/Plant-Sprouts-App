// Main screen with user's plants

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Video } from 'expo-av'; 
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import CustomButton from '../components/CustomButton';
import TopBar from '../components/TopBar';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function HomeScreen({ navigation }) {
  const [plants, setPlants] = useState([]);
  const [soilMoisture, setSoilMoisture] = useState(45);
  const [lightLevel, setLightLevel] = useState(800);
  const [temperature, setTemperature] = useState(22);
  const [humidity, setHumidity] = useState(55);

  // Fetch plants when component mounts
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Please log in to view your plants.');
          return;
        }
        // Get ID token and register UID with backend for MQTT push
        const idToken = await user.getIdToken();
        console.log("Sending UID to backend:", user.uid);
        await fetch('https://mqtt-proxy-server.onrender.com/api/register-uid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
          }),
        });

        // Fetch plants from Firestore
        const db = getFirestore();
        const plantsCollection = collection(db, 'users', user.uid, 'plants');
        const snapshot = await getDocs(plantsCollection);
        // Transform Firestore documents into list items
        const plantsList = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            userPlantId: doc.id,
            ...data,
            ...(data.id === 'custom' && {
              image: require('../assets/plants/custom_plant.jpg'), // Set default image for custom plants
            }),
          };
        });
        setPlants(plantsList);
      } catch (error) {
        console.error('Error fetching plants:', error);
        Alert.alert('Failed to load plants.');
      }
    };

    fetchPlants();
  }, []);

  // Handle plant deletion from Firestore and update local state
  const handleDeletePlant = (userPlantId) => {
    Alert.alert(
      'Delete Plant',
      'Are you sure you want to delete this plant?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const auth = getAuth();
              const db = getFirestore();
              const user = auth.currentUser;
              if (!user) return;

              const plantRef = doc(db, 'users', user.uid, 'plants', userPlantId);
              await deleteDoc(plantRef);

              // Remove deleted plant from UI
              setPlants(prev => prev.filter(p => p.userPlantId !== userPlantId));
              Alert.alert('Plant deleted successfully');
            } catch (error) {
              console.error('Error deleting plant:', error);
              Alert.alert('Failed to delete plant.');
            }
          },
        },
      ]
    );
  };

  // Check if current sensor values are outside the preferred range for a plant
  const isOutOfPreferredRange = (plant) => {
    const checks = [
      { value: soilMoisture, preferred: plant.preferredSoilMoisture },
      { value: lightLevel, preferred: plant.preferredLight },
      { value: temperature, preferred: plant.preferredTemperature },
      { value: humidity, preferred: plant.preferredHumidity },
    ];
    // Return true if any value is outside the min-max range
    return checks.some(({ value, preferred }) => {
      if (!preferred) return false;
      const { min, max } = preferred;
      const belowMin = min != null && value < min;
      const aboveMax = max != null && value > max;
      return belowMin || aboveMax;
    });
  };

  return (
    <View style={styles.wrapper}>

      {/* Background video */}
      <View style={styles.videoWrapper}>
        <Video
          source={require('../assets/animation.mp4')}
          style={styles.video}
          isLooping={true}
          shouldPlay={true}
          isMuted={true}
          resizeMode="cover"
        />
      </View>

      {/* Top bar with title and user account button */}
      <TopBar
        title="Your Plants"
        onUserPress={() => navigation.navigate('Account')}
      />

      <View style={styles.container}>
        {/* If no plants exist, show empty state message */}
        {plants.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyTitle}>No plants yet.{'\n'}But that’s easy to fix!</Text>
            <Text style={styles.emptyBody}>
              Add one to:
              {'\n'}Monitor real-time sensor data
              {'\n'}Get care tips and alerts
              {'\n'}Track light, humidity, temperature and soil moisture
            </Text>
          </View>
        ) : (
          <FlatList
            data={plants}
            keyExtractor={(item) => item.userPlantId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.card,
                  isOutOfPreferredRange(item) && {
                    borderColor: '#dc2626',
                    borderWidth: 2,
                    shadowColor: '#dc2626',
                    shadowOpacity: 0.7,
                    shadowRadius: 30,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 12,
                  } 
                ]}
                onPress={() =>
                  navigation.navigate('PlantMonitoring', { plant: item })
                }
              >
                {/* Plant image*/}
                {item.image && (
                  typeof item.image === 'string' ? (
                    <Image source={{ uri: item.image }} style={styles.image} />
                  ) : (
                    <Image source={item.image} style={styles.image} />
                  )
                )}
                {/* Plant name and nickname */}
                <Text style={styles.plantName}>
                  {item.id === 'custom'
                    ? item.nickname || 'Custom Plant'
                    : `${item.name}${item.nickname ? ' ' + item.nickname : ''}`}
                </Text>
                {/* Delete button */}
                <View style={styles.deleteButtonContainer}>
                  <TouchableOpacity onPress={() => handleDeletePlant(item.userPlantId)}>
                    <Text style={styles.deleteButtonText}>❌</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        {/* Button to add a new plant (max 5 plants allowed) */}
        <CustomButton
          title="Add New Plant"
          onPress={() => {
            if (plants.length >= 5) {
              Alert.alert('Limit Reached', 'You can only add up to 5 plants.');
            } else {
              navigation.navigate('AddPlant');
            }
          }}
          style={styles.addButton}
        />
      </View>
    </View>
  );
}

// Styling for the screen
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  videoWrapper: {
    position: 'absolute',
    top: '10%',
    left: '0%',
    width: 400,
    height: 900,
    zIndex: 0,
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 1,
  },
  emptyWrapper: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    ...fonts.title,
    color: colors.primaryText,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyBody: {
    ...fonts.body,
    color: colors.secondaryText,    
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 0,        
    borderColor: 'transparent',
  },
  outOfRangeBorder: {
    borderColor: '#dc2626',
    borderWidth: 2,
  },
  plantName: {
    ...fonts.cardTitle,
    color: colors.primaryText,
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  addButton: {
    marginTop: 30,
    width: '50%',
  },
  deleteButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  deleteButtonText: {
    ...fonts.cardTitle,
  },
});
