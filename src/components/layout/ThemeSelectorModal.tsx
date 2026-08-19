import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { THEMES } from '../../theme/themeConfig';
import type { ThemeId } from '../../types/theme';
import { X, CheckCircle2, Sparkles } from 'lucide-react';

export const ThemeSelectorModal: React.FC = () => {
  const { themeId, setThemeId, isThemeModalOpen, setIsThemeModalOpen, theme } = useTheme();

  if (!isThemeModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl max-h-[90dvh] overflow-y-auto ${theme.styles.bgCard} ${theme.styles.radius} border-2 ${theme.styles.border} shadow-2xl p-4 sm:p-6 relative`}
      >
        {/* Close button */}
        <button
          onClick={() => setIsThemeModalOpen(false)}
          className="absolute top-3.5 right-3.5 p-2 rounded-full hover:bg-black/10 transition-colors text-neutral-400 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4 sm:mb-6 pr-8">
          <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase mb-1 text-amber-600">
            <Sparkles className="w-4 h-4" />
            <span>Sistema Multi-Diseño para tu Negocio</span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${theme.styles.textPrimary}`}>
            Selecciona un Estilo Visual
          </h2>
          <p className={`text-xs sm:text-sm ${theme.styles.textSecondary} mt-1 font-medium leading-relaxed`}>
            Cambia la identidad completa de la cafetería en 1 clic. Diseñado para presentar propuestas personalizadas a clientes.
          </p>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(THEMES) as ThemeId[]).map((id) => {
            const t = THEMES[id];
            const isSelected = themeId === id;

            return (
              <button
                key={id}
                onClick={() => {
                  setThemeId(id);
                }}
                className={`text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2.5 relative group ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500/20'
                    : 'border-black/10 dark:border-white/10 hover:border-amber-400 bg-black/5 dark:bg-white/5'
                }`}
              >
                {/* Header with Icon and Badge */}
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{t.icon}</span>
                    <div>
                      <h3 className={`font-black text-sm leading-tight ${theme.styles.textPrimary}`}>
                        {t.name}
                      </h3>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        {t.badge}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-amber-500 fill-amber-500/20 shrink-0" />
                  )}
                </div>

                {/* Tagline */}
                <p className={`text-xs ${theme.styles.textSecondary} line-clamp-2 leading-relaxed font-medium`}>
                  {t.tagline}
                </p>

                {/* Color Swatches */}
                <div className="flex items-center gap-1.5 pt-1 w-full border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-1">
                    {t.previewColors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-4 h-4 rounded-full border border-black/20 shadow-xs"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] ml-auto font-mono font-bold text-neutral-400">
                    {t.fontFamily.heading.replace(/'/g, '').split(',')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
          <span className="text-xs text-neutral-400 font-bold">
            Tema activo: <strong>{theme.name}</strong>
          </span>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className={`px-5 py-2 text-xs font-black text-white ${theme.styles.accent} ${theme.styles.buttonStyle}`}
          >
            Aplicar & Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
