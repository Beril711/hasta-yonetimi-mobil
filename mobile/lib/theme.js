export const C = {
  primary: '#1B6B4A',
  primaryLight: '#E8F5EE',
  primaryDark: '#134D35',
  primaryMid: '#237A56',
  accent: '#D4A853',
  accentLight: '#FDF6E8',
  bg: '#F7F6F3',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSec: '#6B6B6B',
  textMuted: '#9B9B9B',
  border: '#E8E6E1',
  danger: '#C44B4B',
  dangerLight: '#FEF2F2',
  warning: '#D4A853',
  warningLight: '#FDF6E8',
};

export const shadow = (level = 1) => ({
  shadowColor: '#000',
  shadowOpacity: level * 0.04,
  shadowRadius: level * 4,
  shadowOffset: { width: 0, height: level * 2 },
  elevation: level * 2,
});
