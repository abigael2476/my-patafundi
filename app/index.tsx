import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle, Rect, G, LinearGradient, Stop, Defs } from 'react-native-svg';
import { PataFundiLogo } from '../src/components/common/PataFundiLogo';
import { SkylineHeader } from '../src/components/common/SkylineHeader';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Blueprint Wireframe Overlay - Renders technical tool watermarks
 * on top of a rich vertical navy blue gradient background.
 */
const BlueprintWatermarkOverlay = () => {
  const strokeColor = 'rgba(255, 255, 255, 0.055)';
  const accentColor = 'rgba(96, 165, 250, 0.07)';

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}>
        <Defs>
          <LinearGradient id="bgSkyGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#040F26" />
            <Stop offset="45%" stopColor="#07193D" />
            <Stop offset="85%" stopColor="#091E44" />
            <Stop offset="100%" stopColor="#040E20" />
          </LinearGradient>
        </Defs>

        {/* Deep Rich Midnight Navy Gradient Background */}
        <Rect x="0" y="0" width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="url(#bgSkyGradient)" />

        {/* Technical Tool Wireframe Blueprint Watermarks */}
        <G transform="translate(32, 60) rotate(-18)">
          <Rect x="10" y="0" width="3" height="32" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          <Rect x="7" y="32" width="9" height="22" rx="3" stroke={strokeColor} strokeWidth="1.5" fill="none" />
        </G>

        <G transform="translate(285, 50) rotate(22)">
          <Path d="M 0 10 L 22 10 L 28 0 L 38 15 L 22 22 L 0 22 Z" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          <Rect x="13" y="22" width="6" height="38" rx="1" stroke={strokeColor} strokeWidth="1.5" fill="none" />
        </G>

        <G transform="translate(22, 185) rotate(12)">
          <Rect x="0" y="0" width="34" height="14" rx="3" stroke={accentColor} strokeWidth="1.5" fill="none" />
          <Path d="M 34 7 L 44 7 L 44 24 L 28 24 L 28 42" stroke={accentColor} strokeWidth="1.5" fill="none" />
        </G>

        <G transform="translate(315, 175)">
          <Circle cx="20" cy="20" r="16" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          <Rect x="12" y="14" width="4" height="8" rx="1" fill={strokeColor} />
          <Rect x="24" y="14" width="4" height="8" rx="1" fill={strokeColor} />
        </G>

        <G transform="translate(26, 320) rotate(-28)">
          <Rect x="12" y="16" width="8" height="42" rx="2" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          <Circle cx="16" cy="12" r="10" stroke={strokeColor} strokeWidth="1.5" fill="none" />
        </G>

        <G transform="translate(305, 305) rotate(12)">
          <Rect x="0" y="16" width="30" height="34" rx="4" stroke={accentColor} strokeWidth="1.5" fill="none" />
          <Path d="M 8 16 L 15 0 L 22 16" stroke={accentColor} strokeWidth="1.5" fill="none" />
        </G>

        <G transform="translate(36, 450) rotate(18)">
          <Path d="M 0 0 L 10 16 L 5 48 M 20 0 L 10 16 L 15 48" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          <Circle cx="10" cy="16" r="3" fill={strokeColor} />
        </G>

        <G transform="translate(320, 430)">
          <Circle cx="15" cy="15" r="12" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          <Rect x="10" y="27" width="10" height="6" rx="1" stroke={strokeColor} strokeWidth="1.5" fill="none" />
        </G>
      </Svg>
    </View>
  );
};

export default function SplashScreen() {
  const handleGetStarted = () => {
    router.push('/(auth)/signup' as any);
  };

  const handleLogin = () => {
    router.push('/(auth)/login' as any);
  };

  return (
    <View style={styles.container}>
      {/* Background Tool Blueprint & Gradient Overlay */}
      <BlueprintWatermarkOverlay />

      <SafeAreaView style={styles.content}>
        {/* Top Flexible Spacer */}
        <View style={styles.topSpacer} />

        {/* Center Vector Logo & Brand Name */}
        <View style={styles.logoContainer}>
          <PataFundiLogo size={140} />
        </View>

        {/* Tagline Typography Section */}
        <View style={styles.taglineSection}>
          <Text style={styles.mainTagline}>Find trusted fundis near you.</Text>
          <Text style={styles.subTagline}>Fast. Reliable. Professional.</Text>
        </View>

        {/* Middle Flexible Spacer */}
        <View style={styles.midSpacer} />

        {/* City Skyline & 3D Tool Box */}
        <View style={styles.skylineWrapper}>
          <SkylineHeader height={190} />
        </View>

        {/* Bottom Action Area matching reference screenshot */}
        <View style={styles.bottomActionContainer}>
          {/* Primary Orange Get Started Pill Button */}
          <TouchableOpacity
            style={styles.getStartedBtn}
            activeOpacity={0.88}
            onPress={handleGetStarted}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={22} color="#FFFFFF" style={styles.arrowIcon} />
          </TouchableOpacity>

          {/* Footer Text Link: Already have an account? Log In */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={handleLogin}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040F26',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topSpacer: {
    height: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  taglineSection: {
    alignItems: 'center',
    marginTop: 14,
    paddingHorizontal: 20,
  },
  mainTagline: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  subTagline: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 5,
    letterSpacing: 0.1,
  },
  midSpacer: {
    flex: 1,
  },
  skylineWrapper: {
    width: '100%',
  },
  bottomActionContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 28,
    paddingTop: 12,
  },
  getStartedBtn: {
    width: '88%',
    maxWidth: 340,
    height: 56,
    backgroundColor: '#FA6400',
    borderRadius: 24, // Rounded pill shape as shown in screenshot
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FA6400',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  loginLink: {
    color: '#FA6400',
    fontSize: 14,
    fontWeight: '700',
  },
});




