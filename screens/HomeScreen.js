import React from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  const plants = [
    { id: '1', name: 'Aloe Vera' },
    { id: '2', name: 'Spider Plant' },
    { id: '3', name: 'Snake Plant' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌱 SmartSprout</Text>
      <Text style={styles.title}>Your Plants</Text>
      
      {/* Plant list */}
      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PlantMonitoring', { plantName: item.name })}
          >
            <Text style={styles.plantName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Add New Plant" onPress={() => navigation.navigate('AddPlant')} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    paddingHorizontal: 80, // Adjust padding horizontally for a better look

    marginBottom: 20,
    width: '100%',
    maxWidth: 300,
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
    color: '#2563eb', // You can adjust the color to match the theme
  },
});