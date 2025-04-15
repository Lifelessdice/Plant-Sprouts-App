import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { popularPlants } from '../data/popularPlants';

export default function AddPlantScreen({ navigation }) {
  const handleSelectPlant = (plant) => {
    console.log('Plant selected:', plant.name);
    navigation.navigate('NamePlant', { plant }); // Navigate to custom name screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Plant</Text>

      <FlatList
        data={popularPlants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleSelectPlant(item)}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f0fdf4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 20,
    alignSelf: 'center',
  },
  list: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
  },
});