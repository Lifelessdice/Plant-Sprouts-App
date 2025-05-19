import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import InfoBox from '../components/InfoBox';
import { dataStore } from '../src/backendAPI.js';
import * as Progress from 'react-native-progress';
import { getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import TopBar from '../components/TopBar';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function PlantMonitoringScreen({ route }) {
  const navigation = useNavigation();
  const [plantData, setPlantData] = useState(route.params.plant);

  if (!plantData) {
    return <Text>Plant not found</Text>;
  }

  // Fetch updated plant data from Firestore whenever screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchUpdatedPlant = async () => {
        try {
          const plantRef = doc(db, 'users', auth.currentUser.uid, 'plants', plantData.userPlantId);
          const snapshot = await getDoc(plantRef);
          if (snapshot.exists()) {
            setPlantData(snapshot.data());
          }
        } catch (err) {
          console.error('Error fetching updated plant:', err);
        }
      };
      fetchUpdatedPlant();
    }, [plantData.userPlantId])
  );

  // Sensor data state — initialize with defaults or from dataStore if available
  const [sensorData, setSensorData] = useState({
    temperature: 22,
    light: 800,
    humidity: 55,
    moisture: 45,
  });

  // Poll dataStore every 5 seconds to update sensor data state
  useEffect(() => {
    if (!plantData?.userPlantId) return;

    const interval = setInterval(() => {
      const plantId = plantData.userPlantId;
      const currentData = dataStore[plantId]?.sensorData;

      if (currentData) {
        setSensorData({
          temperature: currentData.temperature ?? 22,
          light: currentData.light ?? 800,
          humidity: currentData.humidity ?? 55,
          moisture: currentData.moisture ?? 45,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [plantData.userPlantId]);

  // Reuse your renderCard helper from your example for each sensor metric
  const renderCard = (label, value, unit, preferred, theme) => {
    const isOutOfRange =
      preferred &&
      ((preferred.min != null && value < preferred.min) ||
       (preferred.max != null && value > preferred.max));
    const aboveRange = preferred && preferred.max != null && value > preferred.max;
    const belowRange = preferred && preferred.min != null && value < preferred.min;

    const getProgress = () => {
      if (!preferred) return 0;
      if (belowRange) return 0;
      if (aboveRange) return 1;
      return (value - preferred.min) / (preferred.max - preferred.min);
    };

    return (
      <View
        style={[
          styles.card,
          isOutOfRange && {
            borderColor: '#dc2626',
            borderWidth: 2,
            shadowColor: '#dc2626',
            shadowOpacity: 0.7,
            shadowRadius: 30,
            shadowOffset: { width: 0, height: 4 },
            elevation: 12,
          },
        ]}
      >
        <Text style={styles.label}>{label}</Text>

        {preferred?.min != null && preferred?.max != null ? (
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
        ) : (
          <Text style={[styles.value, isOutOfRange && styles.alert]}>
            {value} {unit}
          </Text>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
        {preferred?.min == null && preferred?.max == null ? (
            <Text style={styles.recommendation}> Preferred range not available </Text>
          ) : (
            <Text style={styles.recommendation}>
             Preferred: {preferred.min ?? 'N/A'} - {preferred.max ?? 'N/A'} {unit}
              </Text>
          )}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ChangeConditions', {
                label,
                preferred,
                plant: plantData,
                unit,
              })
            }
            style={{ marginLeft: 8 }}
          >
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  };

  return (
    <>
      <TopBar
        title={plantData.id === 'custom'
          ? plantData.nickname || 'Custom Plant'
          : `${plantData.name}${plantData.nickname ? ' ' + plantData.nickname : ''}`}
        onBackPress={() => navigation.goBack()}
        onUserPress={() => navigation.navigate('Account')}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* General Info and Small Info Boxes for non-custom plants */}
        {plantData.id !== 'custom' ? (
          <>
            <View style={styles.generalInfoBox}>
              <Text style={styles.generalInfoText}>{plantData.generalInfo}</Text>
            </View>

            <View style={styles.infoBoxesContainer}>
              <InfoBox imageSource={plantData.difficulty} />
              <InfoBox imageSource={plantData.lightRecommendation} />
              <InfoBox imageSource={plantData.humidityRecommendation} />
              <InfoBox imageSource={plantData.toxicity} />
              <InfoBox imageSource={plantData.watering} />
            </View>
          </>
        ) : (
          <View style={{ paddingTop: 40 }} />
        )}

        {/* Monitoring Cards */}
        {renderCard('🌱 Soil Moisture', sensorData.moisture, 'kPa', plantData.preferredSoilMoisture, '#DAA06D')}
        {renderCard('☀️ Light Level', sensorData.light, 'lux', plantData.preferredLight, '#facc15')}
        {renderCard('🌡️ Temperature', sensorData.temperature, '°C', plantData.preferredTemperature, '#fb923c')}
        {renderCard('💧 Humidity', sensorData.humidity, 'g/m3', plantData.preferredHumidity, '#60a5fa')}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    backgroundColor: colors.background,
    alignItems: 'center',
    flexGrow: 1,
  },
  generalInfoBox: {
    marginTop: 20,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
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
  infoBoxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    ...fonts.cardTitle,
    color: colors.primaryText,
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
    color: colors.danger,
  },
  editButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
