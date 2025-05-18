import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import TopBar from '../components/TopBar';
import { db, auth } from '../firebase';
import { updateDoc, doc } from 'firebase/firestore';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';


export default function ChangeConditionsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { label, preferred, plant, unit } = route.params || {};
    const [initialPreferred] = useState(preferred); 
    const [newMax, setNewMax] = useState(preferred?.max?.toString() || '');
    const [newMin, setNewMin] = useState(preferred?.min?.toString() || '');

    const handleSave = async () => {
      if (!plant || !plant.id || !preferred) return;

      const userId = auth.currentUser.uid;
      const plantRef = doc(db, 'users', userId, 'plants', plant.userPlantId);

      const updatedPreferredConditions = {
        min: newMin ? parseFloat(newMin) : preferred.min,
        max: newMax ? parseFloat(newMax) : preferred.max,
      };

      let updatePayload = {};
      if (label?.toLowerCase().includes('temperature')) {
        updatePayload = {
          preferredTemperature: updatedPreferredConditions,
        };
      } else if (label?.toLowerCase().includes('soil')) {
        updatePayload = {
          preferredSoilMoisture: updatedPreferredConditions,
        };
      } else if (label?.toLowerCase().includes('light')) {
        updatePayload = {
          preferredLight: updatedPreferredConditions,
        };
      } else if (label?.toLowerCase().includes('humidity')) {
        updatePayload = {
          preferredHumidity: updatedPreferredConditions,
        };
      }

      try {
        await updateDoc(plantRef, updatePayload);
        Alert.alert('Preferred conditions updated!');
        navigation.goBack();
      } catch (error) {
        console.error('Error updating preferred temperature:', error);
        Alert.alert('Failed to update.');
      }
    };

    const handleReset = async () => {
      if (!plant || !plant.id || !preferred) return;
    
      const userId = auth.currentUser.uid;
      const plantRef = doc(db, 'users', userId, 'plants', plant.userPlantId);
    
      let updatePayload = {};
      if (label?.toLowerCase().includes('temperature')) {
        updatePayload = {
          preferredTemperature: plant.originalPreferredTemperature,
        };
      } else if (label?.toLowerCase().includes('soil')) {
        updatePayload = {
          preferredSoilMoisture: plant.originalPreferredSoilMoisture,
        };
      } else if (label?.toLowerCase().includes('light')) {
        updatePayload = {
          preferredLight: plant.originalPreferredLight,
        };
      } else if (label?.toLowerCase().includes('humidity')) {
        updatePayload = {
          preferredHumidity: plant.originalPreferredHumidity,
        };
      }
    
      try {
        await updateDoc(plantRef, updatePayload);

        // revert back to default values on screen
        if (label?.toLowerCase().includes('temperature')) {
          setNewMin(plant.originalPreferredTemperature.min.toString());
          setNewMax(plant.originalPreferredTemperature.max.toString());
        } else if (label?.toLowerCase().includes('soil')) {
          setNewMin(plant.originalPreferredSoilMoisture.min.toString());
          setNewMax(plant.originalPreferredSoilMoisture.max.toString());
        } else if (label?.toLowerCase().includes('light')) {
          setNewMin(plant.originalPreferredLight.min.toString());
          setNewMax(plant.originalPreferredLight.max.toString());
        } else if (label?.toLowerCase().includes('humidity')) {
          setNewMin(plant.originalPreferredHumidity.min.toString());
          setNewMax(plant.originalPreferredHumidity.max.toString());
        }
      } catch (error) {
        console.error('Error restoring default preferred conditions:', error);
        Alert.alert('Failed to update.');
      }
    };

    const EditConditions = (label, preferred, unit) => {
      return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={[fonts.title, { color: colors.primaryText, marginBottom: 10 }]}>{label}</Text>

            {preferred?.min != null && preferred?.max != null ? (
              <Text style={[fonts.body, { color: colors.secondaryText }]}>
                Current range: {preferred.min} – {preferred.max} {unit}
              </Text>
            ) : (
              <Text style={[fonts.body, { marginBottom: 10 }]}>No preferred range set.</Text>
            )}

            <TextInput
              placeholder={`Enter new min ${label}`}
              value={newMin}
              onChangeText={setNewMin}
              keyboardType="numeric"
              style={[styles.input]}
            />
            <TextInput
              placeholder={`Enter new max ${label}`}
              value={newMax}
              onChangeText={setNewMax}
              keyboardType="numeric"
              style={[styles.input]}
            />

            <CustomButton
              title="Reset to Default"
              onPress={handleReset}
              style={{
                marginTop: 20,
                backgroundColor: '#669169',
                paddingHorizontal: 10,
                paddingVertical: 12,
              }}
              textStyle={{ color: '#fff', fontSize: 13 }}
              disabled={plant.originalPreferredLight.min == null}
            />


            <CustomButton
              title="Save Changes"
              onPress={handleSave}
              style={{ marginTop: 20 }}
            />
          </View>
        </ScrollView>
      );
    };

    return (
    
        <>
        <TopBar
          title={plant.id === 'custom'
            ? plant.nickname || 'Custom Plant'
            : `${plant.name}${plant.nickname ? ' ' + plant.nickname : ''}`}
          onBackPress={() => navigation.goBack()}
          onUserPress={() => navigation.navigate('Account')}
        />

        {label?.toLowerCase().includes('temperature') ? (EditConditions('Temperature', preferred, unit)) 
        : 
        label?.toLowerCase().includes('soil') ? (EditConditions('Soil Moisture', preferred, unit))
        :
        label?.toLowerCase().includes('light') ? (EditConditions('Light', preferred, unit))
        :
        label?.toLowerCase().includes('humidity') ? (EditConditions('Humidity', preferred, unit))
        : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.formContainer}>
              <Text style={[fonts.body]}>No preferred condition label matched.</Text>
            </View>
          </ScrollView>
        )}
        
      </>

    );

}

const styles = StyleSheet.create({
    input: {
      width: '80%',
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: '#94a3b8', 
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      fontSize: fonts.body.fontSize,
      marginTop: 12,
    },
    formContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollContent: {
      padding: 20,
      backgroundColor: colors.background,
      flexGrow: 1,
    },
  });
