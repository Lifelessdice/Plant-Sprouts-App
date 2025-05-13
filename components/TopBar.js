import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { User, ArrowLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function TopBar({ title = '', onUserPress, onBackPress }) {
  useEffect(() => {
    // Set the Android status bar color to match the top bar
    StatusBar.setBarStyle('dark-content');  //  Define the color of the very top area of the screen on Android
    StatusBar.setBackgroundColor(colors.topBarBackground); // Set background color to match your top bar
  }, []);

  return (
    <View style={styles.header}>
      {onBackPress && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <ArrowLeft color={colors.primaryText} size={24} />
        </TouchableOpacity>
      )}

      <Text style={styles.headerTitle}>{title}</Text>

      {onUserPress && (
        <TouchableOpacity style={styles.accountButton} onPress={onUserPress}>
          <User color={colors.primaryText} size={24} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 80,
    backgroundColor: colors.topBarBackground,
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
    ...fonts.title, // Use font styling from fonts.js
    color: colors.primaryText, // Use color from colors.js
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
