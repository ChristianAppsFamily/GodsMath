import type { ColorSet } from '@/constants/colors';

export type CustomThemeId = 'default' | 'royal' | 'olive' | 'crimson' | 'navy';

export interface CustomThemeOption {
  id: CustomThemeId;
  name: string;
  description: string;
  preview: string;
  colors: Partial<ColorSet>;
}

export const CUSTOM_THEMES: CustomThemeOption[] = [
  {
    id: 'default',
    name: 'Classic Gold',
    description: "Original God's Math look",
    preview: '#FF9F0A',
    colors: {},
  },
  {
    id: 'royal',
    name: 'Royal Purple',
    description: 'Deep purple accent on dark',
    preview: '#9B59B6',
    colors: {
      accent: '#9B59B6',
      accentDark: '#7D3C98',
      operator: '#9B59B6',
    },
  },
  {
    id: 'olive',
    name: 'Olive Provision',
    description: 'Earthy greens for stewardship',
    preview: '#6B8E23',
    colors: {
      accent: '#6B8E23',
      accentDark: '#556B2F',
      operator: '#6B8E23',
      success: '#4A7C59',
    },
  },
  {
    id: 'crimson',
    name: 'Crimson Faith',
    description: 'Warm red accent',
    preview: '#C0392B',
    colors: {
      accent: '#C0392B',
      accentDark: '#922B21',
      operator: '#C0392B',
    },
  },
  {
    id: 'navy',
    name: 'Navy Wisdom',
    description: 'Calm blue for planning',
    preview: '#2980B9',
    colors: {
      accent: '#2980B9',
      accentDark: '#1F618D',
      operator: '#2980B9',
      background: '#0A1628',
      surface: '#152238',
      surfaceLight: '#1E3050',
    },
  },
];

export function applyCustomTheme(base: ColorSet, themeId: CustomThemeId): ColorSet {
  const theme = CUSTOM_THEMES.find((t) => t.id === themeId);
  if (!theme || themeId === 'default') return base;
  return { ...base, ...theme.colors };
}
