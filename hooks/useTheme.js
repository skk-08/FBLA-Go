import { useUIStore } from '../store/uiStore';
import { lightColors, darkColors } from '../constants/theme';

export function useTheme() {
  const isDark = useUIStore((s) => s.isDarkMode);
  return {
    colors: isDark ? darkColors : lightColors,
    isDark,
  };
}
