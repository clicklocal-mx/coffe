import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { Type } from 'lucide-react';

export const FloatingFontSizeButton: React.FC = () => {
  const { fontSizeScale, cycleFontSize, theme } = useTheme();
  const [showToast, setShowToast] = useState(false);

  const labels = {
    normal: 'A (Normal)',
    large: 'A+ (Grande +15%)',
    xlarge: 'A++ (Extra +30%)',
  };

  const badgeLabels = {
    normal: 'A',
    large: 'A+',
    xlarge: 'A++',
  };

  const handleClick = () => {
    cycleFontSize();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="fixed bottom-4 left-3 z-30 flex items-center gap-2">
      <button
        onClick={handleClick}
        title="Cambiar tamaño de letra (Accesibilidad)"
        className={`px-3 py-2.5 rounded-2xl ${theme.styles.bgCard} ${theme.styles.border} border-2 shadow-xl flex items-center gap-1.5 active:scale-95 transition-all text-neutral-800 dark:text-neutral-100 hover:border-amber-500`}
      >
        <Type className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span className="text-xs font-black bg-amber-500/15 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded-md">
          {badgeLabels[fontSizeScale]}
        </span>
      </button>

      {/* Floating Toast Notification */}
      {showToast && (
        <div className="px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md text-white text-xs font-bold shadow-xl animate-in fade-in slide-in-from-left duration-200">
          Texto: {labels[fontSizeScale]}
        </div>
      )}
    </div>
  );
};
