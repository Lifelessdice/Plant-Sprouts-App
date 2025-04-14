import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function App() {
  const [soilMoisture, setSoilMoisture] = useState(45);
  const [lightLevel, setLightLevel] = useState(800);
  const [temperature, setTemperature] = useState(22);
  const [humidity, setHumidity] = useState(55);

  // Simulating data fetch (you can replace it with actual IoT data fetching)
  useEffect(() => {
    const interval = setInterval(() => {
      setSoilMoisture(Math.floor(Math.random() * 100));
      setLightLevel(Math.floor(Math.random() * 1000));
      setTemperature(Math.floor(Math.random() * 30) + 15);
      setHumidity(Math.floor(Math.random() * 100));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌿 Monitoring </Text>

      <View style={styles.card}>
        <Text style={styles.label}>🌱 Soil Moisture</Text>
        <Text style={styles.value}>{soilMoisture}%</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>☀️ Light Level</Text>
        <Text style={styles.value}>{lightLevel} lux</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🌡️ Temperature</Text>
        <Text style={styles.value}>{temperature}°C</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>💧 Humidity</Text>
        <Text style={styles.value}>{humidity}%</Text>
      </View>
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1e3a8a',
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
});