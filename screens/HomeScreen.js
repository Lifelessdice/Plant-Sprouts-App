import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { User } from 'lucide-react-native';
import { Video } from 'expo-av'; // If using Expo, you can use expo-av for video playback
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import CustomButton from '../components/CustomButton';

export default function HomeScreen({ navigation }) {
  const [plants, setPlants] = useState([]);  // Local state to store user's plants

  useEffect(() => {
    // Fetch the user's plants from Firestore when the component mounts
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
          id: doc.id,
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
          <Text style={styles.emptyText}>No plants added yet</Text>
        ) : (
          <FlatList
            data={plants}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
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
              </TouchableOpacity>
            )}
          />
        )}

        <CustomButton
          title="Add New Plant"
          onPress={() => navigation.navigate('AddPlant')}
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
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 20,
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
});
