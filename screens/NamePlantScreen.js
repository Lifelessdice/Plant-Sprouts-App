import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import InfoBox from '../components/InfoBox';
import CustomButton from '../components/CustomButton';
import { db, auth } from '../firebase';  // Import the auth from firebase.js
import { doc, setDoc, collection } from 'firebase/firestore';

export default function NamePlantScreen({ route, navigation }) {
  const { plant } = route.params; // Receive plant object from the previous screen
  const [nickname, setNickname] = useState('');

  const handleConfirm = async () => {
    const trimmedNickname = nickname.trim();
    if (trimmedNickname) {
      const plantWithNickname = {
        ...plant,
        nickname: trimmedNickname,
      };
  
      try {
        if (!auth.currentUser) {
          Alert.alert('Please log in to save your plant.');
          return;
        }
  
        const uid = auth.currentUser.uid; // Get the user's UID
  
        // Save the plant to Firestore under the user's collection
        const plantRef = doc(collection(db, 'users', uid, 'plants'));
        await setDoc(plantRef, plantWithNickname);
  
        Alert.alert('Your plant is saved successfully! 🌱');
  
        // Only navigate to "Home" if the user is authenticated
        if (auth.currentUser) {
          navigation.navigate('Home');
        } else {
          Alert.alert('Please log in to continue.');
        }
      } catch (error) {
        console.error('Error saving plant:', error);
        Alert.alert('Something went wrong. Please try again.');
      }
    } else {
      Alert.alert('Please enter a valid name for your plant!');
    }
  };
  

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Image source={plant.image} style={styles.image} />

          <View style={styles.generalInfoBox}>
            <Text style={styles.generalInfoText}>{plant.generalInfo}</Text>
          </View>

          <View style={styles.infoBoxesContainer}>
            <InfoBox imageSource={plant.difficulty} />
            <InfoBox imageSource={plant.lightRecommendation} />
            <InfoBox imageSource={plant.humidityRecommendation} />
            <InfoBox imageSource={plant.toxicity} />
            <InfoBox imageSource={plant.watering} />
          </View>

          <Text style={styles.label}>Give your {plant.name} a name</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter plant name"
            value={nickname}
            onChangeText={setNickname}
          />

          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <CustomButton title="Back" onPress={handleGoBack} />
            </View>
            <View style={styles.buttonWrapper}>
              <CustomButton
                title="Add plant"
                onPress={handleConfirm}
                disabled={!nickname.trim()}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 350,
    height: 350,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  generalInfoBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    maxWidth: 340,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  generalInfoText: {
    fontSize: 16,
    color: '#1e3a8a',
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#1e3a8a',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  infoBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
