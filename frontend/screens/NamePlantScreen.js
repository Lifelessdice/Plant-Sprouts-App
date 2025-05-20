// Screen to name a new plant and save it to the database

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
  Dimensions,
} from 'react-native';
import InfoBox from '../components/InfoBox';
import CustomButton from '../components/CustomButton';
import { db, auth } from '../firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function NamePlantScreen({ route, navigation }) {
  const { plant } = route.params;  // Extract the plant object passed via navigation
  const [nickname, setNickname] = useState(''); // Local state for nickname input

  // Function to handle the "Add plant" button press
  const handleConfirm = async () => {
    const trimmedNickname = nickname.trim();
    if (trimmedNickname) { 
      // Add nickname and original preferred values to the plant object
      const plantWithNickname = {
        ...plant,
        nickname: trimmedNickname,
        originalPreferredTemperature: plant.preferredTemperature,
        originalPreferredHumidity: plant.preferredHumidity,
        originalPreferredLight: plant.preferredLight,
        originalPreferredSoilMoisture: plant.preferredSoilMoisture,
      };
  
      try {
        // Check if the user is logged in
        if (!auth.currentUser) {
          Alert.alert('Please log in to save your plant.');
          return;
        }
  
        const uid = auth.currentUser.uid;
  
        // Create a new document reference for the user in 'plants' collection
        const plantRef = doc(collection(db, 'users', uid, 'plants'));
  
        // Generate a unique user-specific plant ID 
        const userPlantId = plantRef.id; 
  
        await setDoc(plantRef, {
          ...plantWithNickname,
          userPlantId, // Store the unique plant ID in 'userPlantId'
        });
  
        Alert.alert('Your plant is saved successfully! 🌱');
  
        navigation.navigate('Home');
      } catch (error) {
        console.error('Error saving plant:', error);
        Alert.alert('Something went wrong. Please try again.');
      }
    } else {
      Alert.alert('Please enter a valid name for your plant!');
    }
  };
  
  // Navigate back to the previous screen
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
        <View style={styles.imageContainer}>
          <Image source={plant.image} style={styles.image} />
        </View>

        <View style={styles.container}>
          {plant.id !== 'custom' && (
            <>
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
            </>
          )}

          {/* Prompt for naming the plant */}
          <Text style={styles.label}>Give your {plant.name} a name</Text>
          
          {/* Input for nickname */}
          <TextInput
            style={styles.input}
            placeholder="Enter plant name"
            value={nickname}
            onChangeText={setNickname}
          />

          {/* Buttons: Back and Add Plant */}
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

// Screen dimensions for image sizing
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Styles for the component
const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    width: '100%',
  },
  image: {
    width: windowWidth,
    height: windowHeight * 0.45, // Take more vertical space
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  generalInfoBox: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    maxWidth: 340,
    width: '100%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  generalInfoText: {
    ...fonts.body,
    color: colors.primaryText,
    textAlign: 'center',
  },
  label: {
    ...fonts.cardTitle,
    color: colors.primaryText,
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: colors.primaryText,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 20,
    backgroundColor: colors.cardBackground,
    color: colors.primaryText,
    ...fonts.body,
  },
  infoBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginBottom: 10,
    flexWrap: 'wrap',
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
});
