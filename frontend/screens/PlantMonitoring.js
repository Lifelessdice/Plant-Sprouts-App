// The screen that displays sensor data for a user plant

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

  const [sensorData, setSensorData] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!plantData?.userPlantId) return;

    const interval = setInterval(() => {
      const plantId = plantData.userPlantId;
      const currentSensorData = dataStore[plantId]?.sensorData;
      const currentStatus = dataStore[plantId]?.status;

      if (currentSensorData) {
        setSensorData(currentSensorData);
      }

      if (currentStatus) {
        setStatus(currentStatus);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [plantData.userPlantId]);

  const renderCard = (label, value, unit, preferred, theme, statusKey) => {
    const noData = value == null;
    const condition = status?.[statusKey]; // "low", "high", or "ok"

    const getProgress = () => {
      if (!preferred || noData) return 0;
      return (value - preferred.min) / (preferred.max - preferred.min);
    };

    const isLow = condition === 'low';
    const isHigh = condition === 'high';

    return (
      <View
        style={[
          styles.card,
          (isLow || isHigh) && {
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

        {noData ? (
          <Text style={[styles.value, { color: '#9ca3af' }]}>No data</Text>
        ) : preferred?.min != null && preferred?.max != null ? (
          <Progress.Circle
            size={100}
            endAngle={0.75}
            progress={getProgress()}
            thickness={10}
            color={isHigh ? '#dc2626' : isLow ? '#f3f4f6' : theme}
            unfilledColor={isHigh ? '#fee2e2' : '#f3f4f6'}
            borderWidth={0}
            showsText={true}
            formatText={() => (
              <Text style={[styles.value, (isLow || isHigh) && styles.alert]}>
                {isHigh
                  ? `  High\n${value} ${unit}`
                  : isLow
                  ? `   Low\n${value} ${unit}`
                  : `${value} ${unit}`}
              </Text>
            )}
            strokeCap="round"
          />
        ) : (
          <Text style={[styles.value, (isLow || isHigh) && styles.alert]}>
            {value} {unit}
          </Text>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          {preferred?.min == null && preferred?.max == null ? (
            <Text style={styles.recommendation}>Preferred range not available</Text>
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
        title={
          plantData.id === 'custom'
            ? plantData.nickname || 'Custom Plant'
            : `${plantData.name}${plantData.nickname ? ' ' + plantData.nickname : ''}`
        }
        onBackPress={() => navigation.goBack()}
        onUserPress={() => navigation.navigate('Account')}
      />

      <ScrollView contentContainerStyle={styles.container}>
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

        {/* Sensor data cards */}
        {renderCard('🌱 Soil Moisture', sensorData?.moisture, 'kPa', plantData.preferredSoilMoisture, '#DAA06D', 'soilMoisture')}
        {renderCard('☀️ Light Level', sensorData?.light, 'lux', plantData.preferredLight, '#facc15', 'light')}
        {renderCard('🌡️ Temperature', sensorData?.temperature, '°C', plantData.preferredTemperature, '#fb923c', 'temperature')}
        {renderCard('💧 Humidity', sensorData?.humidity, 'g/m3', plantData.preferredHumidity, '#60a5fa', 'humidity')}
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
    textAlign: 'center',
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
