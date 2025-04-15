import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import { usePlantContext } from '../context/PlantContext'; // Import context

export default function HomeScreen({ navigation }) {
  const { plants } = usePlantContext(); // Use context instead of hardcoded array

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌱 SmartSprout</Text>
      <Text style={styles.title}>Your Plants</Text>

      {plants.length === 0 ? (
        <Text style={styles.emptyText}>No plants added yet. 🌿</Text>
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
                {item.name} {item.nickname?`${item.nickname}` : ''}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

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
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    marginVertical: 20,
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
    color: '#2563eb',
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
});
