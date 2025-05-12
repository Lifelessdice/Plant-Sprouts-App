// screens/PlantMonitoringScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, User } from 'lucide-react-native';
import InfoBox from '../components/InfoBox';
import { dataStore, setHandlerForTopic } from '../src/mqttservice.js';
import * as Progress from 'react-native-progress';
import CustomButton from '../components/CustomButton';
import { getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';


export default function PlantMonitoringScreen({ route }) {
  const navigation = useNavigation();
  const [plantData, setPlantData] = useState(route.params.plant);

  if (!plantData) {
    return <Text>Plant not found</Text>;
  }

  useFocusEffect(
    React.useCallback(() => {
      const fetchUpdatedPlant = async () => {
        try {
          const plantRef = doc(db, 'users', auth.currentUser.uid, 'plants', plantData.id);
          const snapshot = await getDoc(plantRef);
          if (snapshot.exists()) {
            const updatedPlant = snapshot.data();
            updatedPlant.id = snapshot.id;
            setPlantData(updatedPlant);
          }
        } catch (err) {
          console.error('Error fetching updated plant:', err);
        }
      };

      fetchUpdatedPlant();
    }, [])
  );

  const [soilMoisture, setSoilMoisture] = useState(dataStore.soilMoisture || 45);
  const [lightLevel, setLightLevel] = useState(dataStore.light || 800);
  const [temperature, setTemperature] = useState(dataStore.temperature || 22);
  const [humidity, setHumidity] = useState(dataStore.humidity || 55);

  useEffect(() => {
    // Set MQTT handlers
    setHandlerForTopic("CROWmium/rtl8720dn/temperature", (payload) => {
      setTemperature(payload);
    });

    setHandlerForTopic("CROWmium/rtl8720dn/light", (payload) => {
      setLightLevel(payload);
    });

    setHandlerForTopic("CROWmium/rtl8720dn/humidity", (payload) => {
      setHumidity(payload);
    });

    setHandlerForTopic("CROWmium/rtl8720dn/moisture", (payload) => {
      setSoilMoisture(payload);
    });

  }, []);

  const renderCard = (label, value, unit, preferred, theme) => {
    const isOutOfRange = preferred && (value < preferred.min || value > preferred.max);
    const aboveRange = preferred && value > preferred.max;
    const belowRange = preferred && value < preferred.min;

    const getProgress = () => {
      if (!preferred) return 0;
      if (belowRange) return 0;
      if (aboveRange) return 1;
      return (value - preferred.min) / (preferred.max - preferred.min);
    };

    return (
      <View style={[
        styles.card,
        isOutOfRange && {
          borderColor: '#dc2626',
          borderWidth: 2,
          shadowColor: '#dc2626',
          shadowOpacity: 0.7,
          shadowRadius: 30,
          shadowOffset: { width: 0, height: 4 },
          elevation: 12,
        }
      ]}>
        <Text style={styles.label}>{label}</Text>

        <Progress.Circle
          size={100}
          endAngle={0.75}
          progress={getProgress()}
          thickness={10}
          color={aboveRange ? '#dc2626' : belowRange ? '#f3f4f6': theme}
          unfilledColor={value > (preferred?.max ?? 100) ? '#fee2e2' : '#f3f4f6'}
          borderWidth={0}
          showsText={true}
          formatText={() => (
            <Text style={[styles.value, isOutOfRange && styles.alert]}>
                {aboveRange
                ? `  High\n${value} ${unit}`
                : belowRange
                ? `   Low\n${value} ${unit}`
                : `${value} ${unit}`}
            </Text>
          )}
          strokeCap="round"
        />

        {preferred ? (
          <Text style={styles.recommendation}>
            Preferred: {preferred.min} - {preferred.max} {unit}
          </Text>
        ) : (
          <Text style={styles.recommendation}>Preferred range not available</Text>
        )}

        <CustomButton
          title={label?.toLowerCase().includes('temperature') ? "Change preferred temperature" : ""}
          onPress={() => navigation.navigate('ChangeConditions', {label, preferred, plant: plantData, unit})}
          textStyle={styles.addButtonText} 
          style={styles.smallButton}
        />

      </View>
    );
  };

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color="#1e3a8a" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {plantData.name} {plantData.nickname ? `${plantData.nickname}` : ''}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Account')} style={styles.accountButton}>
          <User color="#1e3a8a" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* General Info */}
        <View style={styles.generalInfoBox}>
          <Text style={styles.generalInfoText}>{plantData.generalInfo}</Text>
        </View>

        {/* Small Info Boxes */}
        <View style={styles.infoBoxesContainer}>
          <InfoBox imageSource={plantData.difficulty} />
          <InfoBox imageSource={plantData.lightRecommendation} />
          <InfoBox imageSource={plantData.humidityRecommendation} />
          <InfoBox imageSource={plantData.toxicity} />
          <InfoBox imageSource={plantData.watering} />
        </View>

        {/* Monitoring Cards */}
        {renderCard('🌱 Soil Moisture', soilMoisture, 'kPa', plantData.preferredSoilMoisture, '#DAA06D')}
        {renderCard('☀️ Light Level', lightLevel, 'lux', plantData.preferredLight, '#facc15')}
        {renderCard('🌡️ Temperature', temperature, '°C', plantData.preferredTemperature, '#fb923c')}
        {renderCard('💧 Humidity', humidity, 'g/m3', plantData.preferredHumidity, '#60a5fa')}
      </ScrollView>
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
  container: {
    padding: 20,
    paddingTop: 80,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    flexGrow: 1,
  },
  generalInfoBox: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
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
  infoBoxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
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
  label: {
    fontSize: 18,
    color: '#1e3a8a',
    marginBottom: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
  },
  recommendation: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  alert: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'System',
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 6,
  },
});
