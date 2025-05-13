import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { User } from 'lucide-react-native';
import { Video } from 'expo-av'; 
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import CustomButton from '../components/CustomButton';
import { dataStore, setHandlerForTopic } from '../src/mqtt-proxy';
import { deleteDoc, doc } from 'firebase/firestore';


export default function HomeScreen({ navigation }) {
  const [plants, setPlants] = useState([]);  // Local state to store user's plants
  const [soilMoisture, setSoilMoisture] = useState(45);  // Default to 45 if no value
  const [lightLevel, setLightLevel] = useState(800);  // Default to 800 if no value
  const [temperature, setTemperature] = useState(22);  // Default to 22°C if no value
  const [humidity, setHumidity] = useState(55);  // Default to 55% if no value

  useEffect(() => {
    // Fetch the user's plants from Firestore 
    const fetchPlants = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          Alert.alert('Please log in to view your plants.');
          return;
        }

        const db = getFirestore();
        const plantsCollection = collection(db, 'users', user.uid, 'plants');
        const snapshot = await getDocs(plantsCollection);

        const plantsList = snapshot.docs.map(doc => ({
          userPlantId: doc.id, // Use the Firestore document ID as userPlantId
          ...doc.data(),
        }));

        setPlants(plantsList);
      } catch (error) {
        console.error('Error fetching plants:', error);
        Alert.alert('Failed to load plants.');
      }
    };

    fetchPlants();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

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

              // Use the userPlantId to delete the plant
              const plantRef = doc(db, 'users', user.uid, 'plants', userPlantId);
              await deleteDoc(plantRef);

              setPlants((prev) => prev.filter((p) => p.userPlantId !== userPlantId));
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

  const isOutOfPreferredRange = (plant) => {
    const checks = [
      { value: soilMoisture, preferred: plant.preferredSoilMoisture },
      { value: lightLevel, preferred: plant.preferredLight },
      { value: temperature, preferred: plant.preferredTemperature },
      { value: humidity, preferred: plant.preferredHumidity },
    ];

    return checks.some(({ value, preferred }) =>
      preferred && (value < preferred.min || value > preferred.max)
    );
  };

  return (
    <View style={styles.wrapper}>
      {/* Transparent MP4 video overlay */}
      <View style={styles.videoWrapper}>
        <Video
          source={require('../assets/animation.mp4')} // Replace with your MP4 file
          style={styles.video}
          isLooping={true}
          shouldPlay={true}
          isMuted={true}
          resizeMode="cover"
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Plants</Text>
        <TouchableOpacity style={styles.accountButton}>
          <User color="#1e3a8a" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
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
            keyExtractor={(item) => item.userPlantId} // Use userPlantId for the key
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
                {item.image && (
                  typeof item.image === 'string' ? (
                    <Image source={{ uri: item.image }} style={styles.image} />
                  ) : (
                    <Image source={item.image} style={styles.image} />
                  )
                )}
                <Text style={styles.plantName}>
                  {`${item.name}${item.nickname ? ' ' + item.nickname : ''}`}
                </Text>
                <View style={styles.deleteButtonContainer}>
                  <TouchableOpacity onPress={() => handleDeletePlant(item.userPlantId)}>
                    <Text style={styles.deleteButtonText}>❌</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

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

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f0fdf4',
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
  header: {
    height: 80,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e3a8a',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingTop: 30,
  },
  accountButton: {
    position: 'absolute',
    right: 16,
    top: 43,
    padding: 6,
    paddingTop: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  emptyWrapper: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyBody: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#ffffff',
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
  },
  plantName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1e3a8a',
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
    fontWeight: 'bold',
    fontSize: 16,
  },
});
