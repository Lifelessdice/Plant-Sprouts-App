// screens/NamePlantScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import { usePlantContext } from '../context/PlantContext';
import InfoBox from '../components/InfoBox';
import CustomButton from '../components/CustomButton'; // Import the custom button component

export default function NamePlantScreen({ route, navigation }) {
  const { plant } = route.params;
  const { addPlant } = usePlantContext();
  const [nickname, setNickname] = useState('');

  const handleConfirm = () => {
    const trimmedNickname = nickname.trim();
    if (trimmedNickname) {
      const plantWithNickname = {
        ...plant,
        nickname: trimmedNickname,
      };
      addPlant(plantWithNickname);
      navigation.navigate('Home');
    } else {
      alert('Please enter a valid name for your plant!');
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image source={plant.image} style={styles.image} />

      {/* Info Boxes placed directly between the image and label */}
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
    marginBottom: 10, // Adjust spacing as needed
    shadowColor: '#000', // Add shadow color
    shadowOffset: { width: 0, height: 4 }, // Set shadow offset
    shadowOpacity: 0.1, // Set shadow opacity
    shadowRadius: 6, // Set shadow radius
    elevation: 5, // For Android shadow effect
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
    marginTop: 20, // Add space between the label and input
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
    marginBottom: 20, // Space between info boxes and the label
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
