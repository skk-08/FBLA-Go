// ─── Palettes ────────────────────────────────────────────────────────
// `colors` is the light-mode palette (default, used by static imports).
// For theme-aware screens, import `useTheme` from hooks/useTheme instead.

export const lightColors = {
  primary:       '#1A237E',  // Dark navy — headers, cards, tab bar
  accent:        '#E6A800',  // Gold/amber — primary buttons
  blue2:         '#3949AB',  // Medium blue — secondary buttons
  white:         '#FFFFFF',
  surface:       '#F5F5F5',  // Light gray — card/input backgrounds
  muted:         '#9E9E9E',  // Gray placeholder text
  error:         '#D32F2F',  // Red — scores, errors
  success:       '#2E7D32',
  border:        '#283593',
  profileHeader: '#7B8FC4',

  // Theme-aware semantic tokens
  bg:            '#FFFFFF',  // Screen background
  card:          '#FFFFFF',  // Card/section background
  text:          '#1A1A1A',  // Primary text
  textSecondary: '#555555',
  textMuted:     '#888888',
  inputBg:       '#D9D9D9',  // Gray input background
  hairline:      '#F0F0F0',  // Section divider
};

export const darkColors = {
  primary:       '#1A237E',  // Keep navy — brand color looks good in dark mode
  accent:        '#E6A800',
  blue2:         '#3949AB',
  white:         '#FFFFFF',
  surface:       '#1A1D2E',
  muted:         '#7A8099',
  error:         '#EF5350',
  success:       '#66BB6A',
  border:        '#283593',
  profileHeader: '#3A4570',

  // Theme-aware semantic tokens
  bg:            '#0F1419',  // Near-black screen background
  card:          '#1E2235',  // Slightly lighter cards
  text:          '#E8EAF0',  // Off-white text
  textSecondary: '#B8BCC8',
  textMuted:     '#7A8099',
  inputBg:       '#2A2F45',
  hairline:      '#2A2F45',
};

// Default export — light palette for backwards compatibility
export const colors = lightColors;

export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
};

export const radius = {
  card:   8,
  modal:  12,
  pill:   24,
};

export const fontSize = {
  xs:   12,
  sm:   14,
  base: 16,
  lg:   18,
  xl:   20,
  xxl:  24,
  h1:   32,
};
