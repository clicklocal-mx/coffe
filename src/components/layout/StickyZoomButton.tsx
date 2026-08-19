import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { ZoomIn } from 'lucide-react';

export const StickyZoomButton: React.FC = () => {
  const { fontSizeScale, cycleFontSize, theme } = useTheme();
  const [showToast, setShowToast] = useState(false);

  const labels = {
    normal: 'Texto: Normal (100%)',
    large: 'Texto: Grande (+15%)',
    xlarge: 'Texto: Extra Grande (+30%)',
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
    <div className="fixed bottom-20 left-3.5 z-30 flex items-center gap-2">
      <button
        onClick={handleClick}
        title="Aumentar tamaño de letra / Zoom de lectura"
        className={`px-3 py-2 rounded-2xl ${theme.styles.bgCard} ${theme.styles.border} border-2 shadow-2xl flex items-center gap-1.5 active:scale-95 transition-all text-neutral-800 dark:text-neutral-100 hover:border-amber-500 backdrop-blur-md`}
      >
        <ZoomIn className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span className="text-[11px] font-black bg-amber-500/20 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded-md">
          {badgeLabels[fontSizeScale]}
        </span>
      </button>

      {/* Temporary Toast notification */}
      {showToast && (
        <div className="px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md text-white text-xs font-bold shadow-xl animate-in fade-in slide-in-from-left duration-200">
          {labels[fontSizeScale]}
        </div>
      )}
    </div>
  );
};
