export const COLORS = {
  // Brand Colors
  primary: '#081E45',       // Dark Navy Blue
  primaryDark: '#041026',   // Deepest Navy
  primaryLight: '#11326C',  // Lighter Navy
  accent: '#FF7A00',        // Vibrant Orange
  accentLight: '#FFF0E5',   // Light Orange background
  accentDark: '#D96800',    // Darker Orange

  // UI Status Colors
  success: '#10B981',       // Emerald Green
  successLight: '#ECFDF5',
  warning: '#F59E0B',       // Amber
  warningLight: '#FFFBEB',
  danger: '#EF4444',        // Red
  dangerLight: '#FEF2F2',
  info: '#3B82F6',          // Blue
  infoLight: '#EFF6FF',

  // Neutral Palette
  background: '#F8FAFC',    // Light background
  card: '#FFFFFF',          // Card white
  surface: '#F1F5F9',       // Secondary background
  
  // Text Colors
  textPrimary: '#0F172A',   // Very dark navy/slate
  textSecondary: '#64748B', // Muted slate gray
  textMuted: '#94A3B8',     // Light slate gray
  textWhite: '#FFFFFF',
  
  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Overlays
  overlay: 'rgba(8, 30, 69, 0.6)',
  glassBackground: 'rgba(255, 255, 255, 0.85)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#081E45',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: '#081E45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  large: {
    shadowColor: '#081E45',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  accent: {
    shadowColor: '#FF7A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
};

export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};
