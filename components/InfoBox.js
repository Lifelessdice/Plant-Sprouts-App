// components/InfoBox.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function InfoBox({ imageSource }) {
  return (
    <View style={styles.infoBox}>
      <Image source={imageSource} style={styles.infoImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: 63,
    height: 63,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  infoImage: {
    width: 63,
    height: 63,
    resizeMode: 'cover',
  },
});
