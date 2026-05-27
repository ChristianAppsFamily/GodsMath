export interface ColorSet {
  background: string;
  surface: string;
  surfaceLight: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentDark: string;
  border: string;
  danger: string;
  success: string;
  operator: string;
  number: string;
  function: string;
}

export const darkColors: ColorSet = {
  background: '#000000',
  surface: '#1C1C1E',
  surfaceLight: '#2C2C2E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  accent: '#FF9F0A',
  accentDark: '#CC7F08',
  border: '#38383A',
  danger: '#FF453A',
  success: '#30D158',
  operator: '#FF9F0A',
  number: '#333333',
  function: '#A5A5A5',
};

export const lightColors: ColorSet = {
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceLight: '#E5E5EA',
  text: '#000000',
  textSecondary: '#6C6C70',
  accent: '#FF9500',
  accentDark: '#CC7700',
  border: '#D1D1D6',
  danger: '#FF3B30',
  success: '#34C759',
  operator: '#FF9500',
  number: '#D4D4D8',
  function: '#A5A5A5',
};

export default darkColors;
