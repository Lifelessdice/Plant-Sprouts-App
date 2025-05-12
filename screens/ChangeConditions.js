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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft color="#1e3a8a" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{plant.name} {plant.nickname ? `${plant.nickname}` : ''}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Account')} style={styles.accountButton}>
            <User color="#1e3a8a" size={24} />
          </TouchableOpacity>
        </View>
        {label?.toLowerCase().includes('temperature') && (
            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 100 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{label}</Text>
                {preferred ? (
                  <>
                    <Text>Current range: {preferred.min} – {preferred.max} {unit}</Text>
                    <TextInput
                      placeholder="Enter new min temperature"
                      value={newMin}
                      onChangeText={setNewMin}
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 8,
                        borderRadius: 6,
                        marginTop: 12,
                      }}
                    />
                    <TextInput
                      placeholder="Enter new max temperature"
                      value={newMax}
                      onChangeText={setNewMax}
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 8,
                        borderRadius: 6,
                        marginTop: 12,
                      }}
                    />
                    <CustomButton
                      title="Save Changes"
                      onPress={handleSave}
                      style={{ marginTop: 10 }}
                    />
                  </>
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
  });