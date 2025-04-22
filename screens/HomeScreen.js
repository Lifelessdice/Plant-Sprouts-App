import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { usePlantContext } from '../context/PlantContext'; // Import context
import CustomButton from '../components/CustomButton'; // Import the custom button component

export default function HomeScreen({ navigation }) {
  const { plants } = usePlantContext(); // Use context instead of hardcoded array

  return (
    <View style={styles.container}>
      {/* Replace text with the logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Your Plants</Text>

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
        style={styles.addButton} // Add custom styling for the button if needed
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,  // Adjust width as needed
    height: 120, // Adjust height as needed
    marginBottom: 0, // Space between logo and title
  },
  title: {
    fontSize: 20,
    marginVertical: 20,
    color: '#1e3a8a',
    fontWeight: 'bold',
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
    marginTop: 30, // Space between the list and the button
    width: '50%', // Adjust width if needed
  },
});
