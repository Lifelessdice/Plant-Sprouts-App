import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { usePlantContext } from '../context/PlantContext'; // Import context hook

export default function NamePlantScreen({ route, navigation }) {
  const { plant } = route.params; // Get the plant object from the route params
  const { addPlant } = usePlantContext(); // Access the addPlant function from the context
  const [nickname, setNickname] = useState(''); // State to hold the entered nickname

  const handleConfirm = () => {
    // Ensure nickname is trimmed
    const trimmedNickname = nickname.trim();

    if (trimmedNickname) {
      // Create a new plant object with the nickname
      const plantWithNickname = {
        ...plant,
        nickname: trimmedNickname, // Trim any extra spaces
      };

      // Call the addPlant function from the context to save the plant
      addPlant(plantWithNickname);

      // Navigate back to the Home screen
      navigation.navigate('Home');
    } else {
      // Handle the case if the nickname is empty (optional)
      alert('Please enter a valid name for your plant!');
    }
  };

  const handleGoBack = () => {
    // Go back to the previous screen without saving changes
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image source={plant.image} style={styles.image} />
      <Text style={styles.label}>Give your {plant.name} a name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter plant name"
        value={nickname}
        onChangeText={setNickname} // Update the nickname state as the user types
      />
      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <Button title="Back" onPress={handleGoBack} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Add plant"
            onPress={handleConfirm}
            disabled={!nickname.trim()} // Disable the button if nickname is empty
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
    width: 250,
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#1e3a8a',
    marginBottom: 10,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});
