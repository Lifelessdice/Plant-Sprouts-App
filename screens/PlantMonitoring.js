// screens/PlantMonitoringScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import InfoBox from '../components/InfoBox';

export default function PlantMonitoringScreen({ route }) {
  const { plant } = route.params;

  if (!plant) {
    return <Text>Plant not found</Text>;
  }

  const [soilMoisture, setSoilMoisture] = useState(45);
  const [lightLevel, setLightLevel] = useState(800);
  const [temperature, setTemperature] = useState(22);
  const [humidity, setHumidity] = useState(55);

  useEffect(() => {
    const interval = setInterval(() => {
      setSoilMoisture(Math.floor(Math.random() * 100));
      setLightLevel(Math.floor(Math.random() * 1000));
      setTemperature(Math.floor(Math.random() * 30) + 15);
      setHumidity(Math.floor(Math.random() * 100));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderCard = (label, value, unit, preferred) => {
    const isOutOfRange = preferred && (value < preferred.min || value > preferred.max);

    return (
      <View style={styles.card}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, isOutOfRange && styles.alert]}>
          {value} {unit}
        </Text>
        {preferred ? (
          <Text style={styles.recommendation}>
            Preferred: {preferred.min} - {preferred.max} {unit}
          </Text>
        ) : (
          <Text style={styles.recommendation}>Preferred range not available</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 1. Plant Name */}
      <Text style={styles.title}>
        {plant.name} {plant.nickname ? `${plant.nickname}` : ''}
      </Text>

      {/* 2. General Info */}
      <View style={styles.generalInfoBox}>
        <Text style={styles.generalInfoText}>{plant.generalInfo}</Text>
      </View>

      {/* 3. Small Info Boxes */}
      <View style={styles.infoBoxesContainer}>
        <InfoBox imageSource={plant.difficulty} />
        <InfoBox imageSource={plant.lightRecommendation} />
        <InfoBox imageSource={plant.humidityRecommendation} />
        <InfoBox imageSource={plant.toxicity} />
        <InfoBox imageSource={plant.watering} />
      </View>

      {/* 4. Monitoring Cards */}
      {renderCard('🌱 Soil Moisture', soilMoisture, '%', plant.preferredSoilMoisture)}
      {renderCard('☀️ Light Level', lightLevel, 'lux', plant.preferredLight)}
      {renderCard('🌡️ Temperature', temperature, '°C', plant.preferredTemperature)}
      {renderCard('💧 Humidity', humidity, '%', plant.preferredHumidity)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 16,
    textAlign: 'center',
  },
  generalInfoBox: {
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
    color: '#2563eb',
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
    color: '#dc2626',
  },
});
