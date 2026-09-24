import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Rect, G } from 'react-native-svg';

interface PataFundiLogoProps {
  size?: number;
  showText?: boolean;
}

export const PataFundiLogo: React.FC<PataFundiLogoProps> = ({ size = 150, showText = true }) => {
  const scale = size / 150;

  return (
    <View style={styles.container}>
      {/* SVG Vector Logo Mark matching reference artwork */}
      <Svg width={150 * scale} height={145 * scale} viewBox="0 0 160 152" fill="none">
        {/* 1. Top Orange Location Pin Arch Ring */}
        <Path
          d="M 40 60 A 40 40 0 1 1 120 60"
          stroke="#FA6400"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />

        {/* 2. White House Roof Gable Outline */}
        <Path
          d="M 44 64 L 80 36 L 116 64"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* 3. 4-Pane Square Window Grid */}
        <G fill="#FFFFFF">
          <Rect x="71" y="47" width="6.5" height="6.5" rx="1" />
          <Rect x="82.5" y="47" width="6.5" height="6.5" rx="1" />
          <Rect x="71" y="58.5" width="6.5" height="6.5" rx="1" />
          <Rect x="82.5" y="58.5" width="6.5" height="6.5" rx="1" />
        </G>

        {/* 4. Left Open Spanner Wrench Head Silhouette */}
        <Path
          d="M 42 70 C 34 60 28 64 30 54 C 36 46 44 54 44 64 Z"
          fill="#FFFFFF"
        />

        {/* 5. Right Hammer Head Silhouette */}
        <Path
          d="M 118 70 C 126 60 132 64 130 54 C 124 46 116 54 116 64 Z"
          fill="#FFFFFF"
        />

        {/* 6. Outer White Location Pin V Frame */}
        <Path
          d="M 42 70 L 80 128 L 118 70"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* 7. Inner Orange V Chevron & Accent Fill */}
        <Path
          d="M 56 82 L 80 116 L 104 82"
          stroke="#FA6400"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Path
          d="M 62 82 L 80 108 L 98 82 Z"
          fill="#FA6400"
        />
      </Svg>

      {/* Brand Typography */}
      {showText && (
        <>
          <Text style={styles.brandTitle}>
            <Text style={styles.pataText}>Pata</Text>
            <Text style={styles.fundiText}>Fundi</Text>
          </Text>

          {/* Centered Horizontal Orange Bar */}
          <View style={styles.orangeBar} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 12,
  },
  pataText: {
    color: '#FFFFFF',
  },
  fundiText: {
    color: '#FA6400',
  },
  orangeBar: {
    width: 36,
    height: 4,
    backgroundColor: '#FA6400',
    borderRadius: 2,
    marginTop: 8,
  },
});


