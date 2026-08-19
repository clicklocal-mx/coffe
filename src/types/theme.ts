export type ThemeId = 
  | 'coastal'
  | 'drinko'
  | 'mccafe'
  | 'minimal' 
  | 'luxury' 
  | 'boho' 
  | 'girly' 
  | 'comic' 
  | 'neo';

export type FontSizeScale = 'normal' | 'large' | 'xlarge';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  icon: string;
  badge: string;
  isDark: boolean;
  previewColors: string[];
  fontFamily: {
    heading: string;
    body: string;
  };
  styles: {
    bg: string;
    bgCard: string;
    bgCardHover: string;
    bgHeader: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    accentHover: string;
    accentText: string;
    border: string;
    borderAccent: string;
    badgeBg: string;
    badgeText: string;
    radius: string;
    shadow: string;
    buttonStyle: string;
    cardStyle: string;
  };
}
