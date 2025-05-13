// components/TopBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { User, ArrowLeft } from 'lucide-react-native';

export default function TopBar({ title = '', onUserPress, onBackPress }) {
  return (
    <View style={styles.header}>
      {onBackPress && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <ArrowLeft color="#1e3a8a" size={24} />
        </TouchableOpacity>
      )}

      <Text style={styles.headerTitle}>{title}</Text>

      {onUserPress && (
        <TouchableOpacity style={styles.accountButton} onPress={onUserPress}>
          <User color="#1e3a8a" size={24} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    header: {
    height: 80,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // ensure it's on top
    },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e3a8a',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingTop: 30,
  },
  accountButton: {
    position: 'absolute',
    right: 16,
    top: 43,
    padding: 6,
    paddingTop: 0,
    zIndex: 11,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 43,
    padding: 6,
    paddingTop: 0,
    zIndex: 11,
  },
});
