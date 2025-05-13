import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, User } from 'lucide-react-native';
import InfoBox from '../components/InfoBox';
import CustomButton from '../components/CustomButton';
import { db, auth } from '../firebase';
import { updateDoc, doc } from 'firebase/firestore';


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
      const plantRef = doc(db, 'users', userId, 'plants', plant.id);

      const updatedPreferredTemperature = {
        min: newMin ? parseFloat(newMin) : preferred.min,
        max: newMax ? parseFloat(newMax) : preferred.max,
      };

      const updatePayload = {
        preferredTemperature: updatedPreferredTemperature,
      };

      try {
        await updateDoc(plantRef, updatePayload);
        Alert.alert('Preferred temperature updated!');
        navigation.goBack();
      } catch (error) {
        console.error('Error updating preferred temperature:', error);
        Alert.alert('Failed to update.');
      }
    };

    return (
    
        <>
        <TopBar
          title={`${plant.name}${plant.nickname ? ` ${plant.nickname}` : ''}`}
          onBackPress={() => navigation.goBack()}
          onUserPress={() => navigation.navigate('Account')}
        />

        {label?.toLowerCase().includes('temperature') && (
              <ScrollView contentContainerStyle={styles.scrollContent}>
                {preferred ? (
                  <View style={styles.formContainer}>
                    <Text style={[fonts.title, { color: colors.primaryText, marginBottom: 10 }]}>{label}</Text>
                    <Text style={[fonts.body, { color: colors.secondaryText }]}>
                      Current range: {preferred.min} – {preferred.max} {unit}
                    </Text>
                    <TextInput
                      placeholder="Enter new min temperature"
                      value={newMin}
                      onChangeText={setNewMin}
                      keyboardType="numeric"
                      style={{ width: '80%', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#94a3b8', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, fontSize: 16, marginTop: 12 }}
                    />
                    <TextInput
                      placeholder="Enter new max temperature"
                      value={newMax}
                      onChangeText={setNewMax}
                      keyboardType="numeric"
                      style={{ width: '80%', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#94a3b8', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, fontSize: 16, marginTop: 12 }}
                    />
                    <CustomButton
                      title="Save Changes"
                      onPress={handleSave}
                      style={{ marginTop: 20 }}
                    />
                  </View>
                ) : (
                  <Text>No preferred range set.</Text>
                )}
            </ScrollView>
        )}
      </>

    );

}

const styles = StyleSheet.create({
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
    formContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 100,
    },
  });