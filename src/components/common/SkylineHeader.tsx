import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Rect, G, LinearGradient, Stop, Circle, Defs } from 'react-native-svg';

interface SkylineHeaderProps {
  height?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const SkylineHeader: React.FC<SkylineHeaderProps> = ({ height = 220 }) => {
  return (
    <View style={[styles.container, { height }]}>
      <Svg width={SCREEN_WIDTH} height={height} viewBox="0 0 375 220" preserveAspectRatio="xMidYMax slice">
        <Defs>
          {/* Skyline Night Glow Gradient */}
          <LinearGradient id="skylineGlow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#081E42" stopOpacity="0.85" />
            <Stop offset="100%" stopColor="#040E20" stopOpacity="1" />
          </LinearGradient>

          {/* Bottom Dark Shadow Fade */}
          <LinearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#040E20" stopOpacity="0" />
            <Stop offset="100%" stopColor="#040E20" stopOpacity="1" />
          </LinearGradient>

          {/* Tool Metal Gradient */}
          <LinearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#F1F5F9" />
            <Stop offset="100%" stopColor="#94A3B8" />
          </LinearGradient>
        </Defs>

        {/* 1. Background City Glow Base */}
        <Rect x="0" y="0" width="375" height="220" fill="url(#skylineGlow)" />

        {/* 2. City Buildings Silhouette Layer */}
        {/* Far background buildings */}
        <G fill="#061633">
          <Rect x="8" y="85" width="36" height="135" rx="1" />
          <Rect x="52" y="105" width="30" height="115" rx="1" />
          <Rect x="125" y="75" width="42" height="145" rx="1" />
          <Rect x="230" y="95" width="34" height="125" rx="1" />
          <Rect x="325" y="80" width="38" height="140" rx="1" />
        </G>

        {/* Midground Detailed Buildings */}
        <G fill="#091F44">
          {/* Building 1 with Antenna */}
          <Path d="M 43 55 L 43 35 L 45 35 L 45 55 Z" fill="#3B82F6" opacity={0.6} />
          <Rect x="33" y="55" width="40" height="165" rx="2" />

          {/* Center Tall Building */}
          <Path d="M 175 40 L 175 20 L 177 20 L 177 40 Z" fill="#60A5FA" opacity={0.7} />
          <Rect x="153" y="40" width="44" height="180" rx="2" />

          {/* Right Stepped High-Rise */}
          <Rect x="268" y="50" width="48" height="170" rx="2" />
          <Rect x="276" y="40" width="32" height="10" rx="1" />

          {/* Far Right Tower */}
          <Rect x="318" y="65" width="50" height="155" rx="2" />
        </G>

        {/* 3. Building Window Glow Grid Dots */}
        <G fill="#60A5FA" opacity={0.5}>
          {/* Building 1 Windows */}
          <Rect x="40" y="68" width="4" height="4" rx="1" />
          <Rect x="50" y="68" width="4" height="4" rx="1" />
          <Rect x="60" y="68" width="4" height="4" rx="1" />
          <Rect x="40" y="80" width="4" height="4" rx="1" />
          <Rect x="50" y="80" width="4" height="4" rx="1" opacity={0.15} />
          <Rect x="60" y="80" width="4" height="4" rx="1" />
          <Rect x="40" y="92" width="4" height="4" rx="1" />
          <Rect x="60" y="92" width="4" height="4" rx="1" />

          {/* Center Tower Windows */}
          <Rect x="160" y="52" width="5" height="5" rx="1" fill="#FA6400" opacity={0.85} />
          <Rect x="172" y="52" width="5" height="5" rx="1" />
          <Rect x="184" y="52" width="5" height="5" rx="1" />
          <Rect x="160" y="64" width="5" height="5" rx="1" />
          <Rect x="172" y="64" width="5" height="5" rx="1" fill="#93C5FD" opacity={0.9} />
          <Rect x="184" y="64" width="5" height="5" rx="1" />
          <Rect x="160" y="76" width="5" height="5" rx="1" />
          <Rect x="184" y="76" width="5" height="5" rx="1" />

          {/* Right Tower Windows */}
          <Rect x="276" y="64" width="4" height="4" rx="1" />
          <Rect x="286" y="64" width="4" height="4" rx="1" />
          <Rect x="296" y="64" width="4" height="4" rx="1" fill="#FA6400" opacity={0.75} />
          <Rect x="276" y="76" width="4" height="4" rx="1" />
          <Rect x="296" y="76" width="4" height="4" rx="1" />
          <Rect x="276" y="88" width="4" height="4" rx="1" fill="#93C5FD" />
          <Rect x="286" y="88" width="4" height="4" rx="1" />
        </G>

        {/* 4. Foreground Center Orange Toolbox with Open Tools */}
        <G id="ToolboxGroup">
          {/* Tools Sticking Out (behind toolbox front) */}

          {/* Left Adjustable Wrench */}
          <G transform="translate(140, 112) rotate(-22)">
            <Rect x="12" y="16" width="8" height="36" rx="3" fill="url(#metalGrad)" />
            <Path d="M 6 4 C 2 12, 20 12, 16 4 Z" fill="url(#metalGrad)" />
            <Circle cx="11" cy="10" r="5" fill="#091F44" />
          </G>

          {/* Center Pliers (Orange Rubberized Handles) */}
          <G transform="translate(176, 108)">
            <Path d="M 8 0 L 4 16 L 16 16 L 12 0 Z" fill="url(#metalGrad)" />
            <Circle cx="10" cy="18" r="3.5" fill="#1E293B" />
            <Rect x="3" y="20" width="6" height="28" rx="3" fill="#FA6400" />
            <Rect x="11" y="20" width="6" height="28" rx="3" fill="#FA6400" />
          </G>

          {/* Right Screwdriver */}
          <G transform="translate(208, 114) rotate(18)">
            <Rect x="8" y="0" width="4" height="24" fill="url(#metalGrad)" />
            <Rect x="5" y="22" width="10" height="26" rx="4" fill="#FA6400" />
            <Rect x="7" y="26" width="2" height="18" fill="#1E293B" opacity={0.6} />
            <Rect x="11" y="26" width="2" height="18" fill="#1E293B" opacity={0.6} />
          </G>

          {/* Toolbox Top Lid Lip */}
          <Rect x="132" y="150" width="112" height="10" rx="3" fill="#D95300" />
          <Rect x="134" y="152" width="108" height="6" rx="2" fill="#E65C00" />

          {/* Toolbox Main Body Box */}
          <Rect x="136" y="158" width="104" height="44" rx="6" fill="#FA6400" />
          <Rect x="140" y="162" width="96" height="36" rx="4" fill="#FF6D08" />

          {/* Top Carrying Handle */}
          <Path
            d="M 166 150 C 166 140, 210 140, 210 150"
            stroke="#1E293B"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Center Metal Latch Lock */}
          <Rect x="180" y="164" width="16" height="16" rx="3" fill="#1E293B" />
          <Rect x="183" y="167" width="10" height="10" rx="2" fill="url(#metalGrad)" />
          <Circle cx="188" cy="172" r="2" fill="#1E293B" />
        </G>

        {/* 5. Gradient Fade Shadow at Very Bottom Edge */}
        <Rect x="0" y="175" width="375" height="45" fill="url(#bottomFade)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
});


