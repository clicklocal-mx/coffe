import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeConfig, ThemeId, FontSizeScale } from '../types/theme';
import { THEMES } from './themeConfig';

interface ThemeContextType {
  themeId: ThemeId;
  theme: ThemeConfig;
  setThemeId: (id: ThemeId) => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  fontSizeScale: FontSizeScale;
  cycleFontSize: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'costa_bruma_theme_id';
const FONT_SIZE_STORAGE_KEY = 'costa_bruma_font_size';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId;
      return saved && THEMES[saved] ? saved : 'coastal';
    } catch {
      return 'coastal';
    }
  });

  const [fontSizeScale, setFontSizeScale] = useState<FontSizeScale>(() => {
    try {
      const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY) as FontSizeScale;
      return saved && ['normal', 'large', 'xlarge'].includes(saved) ? saved : 'normal';
    } catch {
      return 'normal';
    }
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const setThemeId = (id: ThemeId) => {
    if (THEMES[id]) {
      setThemeIdState(id);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, id);
      } catch (err) {
        console.warn('Could not save theme to localStorage', err);
      }
    }
  };

  const cycleFontSize = () => {
    setFontSizeScale((prev) => {
      const next: FontSizeScale = prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal';
      try {
        localStorage.setItem(FONT_SIZE_STORAGE_KEY, next);
      } catch (err) {
        console.warn('Could not save font size', err);
      }
      return next;
    });
  };

  const theme = THEMES[themeId] || THEMES.coastal;

  // Apply theme-specific attributes, dark mode class, and fonts to root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeId);
    
    // Toggle dark class for Tailwind and color-scheme
    if (theme.isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // Set custom font families
    root.style.setProperty('--theme-font-heading', theme.fontFamily.heading);
    root.style.setProperty('--theme-font-body', theme.fontFamily.body);

    // Apply body background and text classes
    document.body.className = `${theme.styles.bg} ${theme.styles.textPrimary} transition-colors duration-200 min-h-screen`;
  }, [themeId, theme]);

  // Apply Font Size scaling to root HTML element (scales all rem units across menu, cards, prices, and modals)
  useEffect(() => {
    const root = document.documentElement;
    const fontSizes: Record<FontSizeScale, string> = {
      normal: '16px',
      large: '18.5px',
      xlarge: '21px',
    };
    root.style.fontSize = fontSizes[fontSizeScale];
    root.setAttribute('data-font-scale', fontSizeScale);
  }, [fontSizeScale]);

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        theme,
        setThemeId,
        isThemeModalOpen,
        setIsThemeModalOpen,
        fontSizeScale,
        cycleFontSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
