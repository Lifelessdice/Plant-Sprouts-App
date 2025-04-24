import React, { useState, useEffect } from 'react'; // Import useState and useEffect hooks
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, User } from 'lucide-react-native';
import { popularPlants } from '../data/popularPlants';
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';

export default function AddPlantScreen({ navigation }) {
    const [firebaseData, setFirebaseData] = useState([]);


  // Fetch data from Firebase when the component mounts
  useEffect(() => {
    const fetchData = async () => {
          try {
            const snapshot = await getDocs(collection(db, 'plants'));
            const plantsFromFirebase = snapshot.docs.map(doc => ({
              id: doc.id, // get the document id
              ...doc.data(), // get the plant data
            }));
            setFirebaseData(plantsFromFirebase);
          } catch (error) {
            console.error('Error fetching Firebase data:', error);
          }
        };
    
        fetchData();
      }, []);
    
      // Merge Firebase data into static local data
      const mergedPlants = popularPlants.map((localPlant) => {
        const cloudPlant = firebaseData.find(p => p.id === localPlant.id) || {};
        return {
          ...localPlant, // image and icons remain intact
          generalInfo: cloudPlant.generalInfo || localPlant.generalInfo,
          preferredSoilMoisture: cloudPlant.preferredSoilMoisture || localPlant.preferredSoilMoisture,
          preferredHumidity: cloudPlant.preferredHumidity || localPlant.preferredHumidity,
          preferredTemperature: cloudPlant.preferredTemperature || localPlant.preferredTemperature,
          preferredLight: cloudPlant.preferredLight || localPlant.preferredLight,
        };
      });
    
      const handleSelectPlant = (plant) => {
        console.log('Plant selected:', plant.name);
        navigation.navigate('NamePlant', { plant }); // Navigate to custom name screen
      };
    

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color="#1e3a8a" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>List of available plants</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Account')} style={styles.accountButton}>
          <User color="#1e3a8a" size={24} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        <Text style={styles.title}>Choose a Plant</Text>
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 20,
    marginTop: 20,
    alignSelf: 'center',
    },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#e0f2fe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 30,
    zIndex: 10,
  },
  backButton: {
    marginRight: 12,
  },
  accountButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  container: {
    flex: 1,
    paddingTop: 80, // adjusted to accommodate header
    paddingHorizontal: 20,
    backgroundColor: '#f0fdf4',
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
    color: '#1e3a8a',
  },
});
