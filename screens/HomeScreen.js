import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { usePlantContext } from '../context/PlantContext';
import CustomButton from '../components/CustomButton';
import { User } from 'lucide-react-native';
import { Video } from 'expo-av';  // If using Expo, you can use expo-av for video playback

export default function HomeScreen({ navigation }) {
  const { plants } = usePlantContext();

  return (
    <View style={styles.wrapper}>
      {/* Transparent MP4 video overlay */}
      <View style={styles.videoWrapper}>
        <Video
          source={require('../assets/animation.mp4')} // Replace with your MP4 file
          style={styles.video}
          isLooping={true} // Loop the video
          shouldPlay={true} // Play automatically
          isMuted={true} // Mute the video (optional)
          resizeMode="cover" // Cover the whole area
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Plants</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Account')}
          style={styles.accountButton}
        >
          <User color="#1e3a8a" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {plants.length === 0 ? (
          <Text style={styles.emptyText}>No plants added yet 🌿</Text>
        ) : (
          <FlatList
            data={plants}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate('PlantMonitoring', { plant: item })
                }
              >
                {item.image && (
                  <Image source={item.image} style={styles.image} />
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
    backgroundColor: '#f0fdf4', // Green background
  },
  videoWrapper: {
    position: 'absolute',
    top: '10%', // Adjust the position of the video
    left: '0%',
    width: 400,
    height: 900,
    zIndex: 0, // Ensure video stays behind other elements
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
    position: 'relative', // allow absolute children
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
    zIndex: 1, // Ensure content stays above video
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
