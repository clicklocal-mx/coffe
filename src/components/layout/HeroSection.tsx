import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Coffee, Waves, Palette, Flame } from 'lucide-react';

interface HeroSectionProps {
  onOpenMoodQuiz: () => void;
  onExploreMenu: () => void;
  onOpenThemeSelector: () => void;
  onOpenTinderGame: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenMoodQuiz,
  onExploreMenu,
  onOpenThemeSelector,
  onOpenTinderGame,
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-3 sm:py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className={`relative overflow-hidden ${theme.styles.bgCard} ${theme.styles.radius} ${theme.styles.cardStyle} p-4 sm:p-7 border-2 shadow-xs`}
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-transparent blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            {/* Left Headline */}
            <div className="space-y-2 sm:space-y-3 text-center md:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-black rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                <Waves className="w-3 h-3 text-cyan-600" />
                <span>{t('hero.badge')}</span>
              </div>

              {/* Title (Special Drinko style or Standard) */}
              {theme.id === 'drinko' ? (
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2.5 flex-wrap justify-center md:justify-start">
                    <span className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#2A1B14]">
                      ORDER
                    </span>
                    <span className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#B87A53]">
                      COFFEE
                    </span>
                    <span className="text-2xl sm:text-4xl font-serif italic text-[#7D6456]">
                      Welcome
                    </span>
                  </div>
                </div>
              ) : (
                <h1 className={`text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight ${theme.styles.textPrimary}`}>
                  {t('hero.title')} <span className={theme.styles.accentText}>Rosarito</span>
                </h1>
              )}

              {/* Concise subtitle */}
              <p className={`text-xs sm:text-sm ${theme.styles.textSecondary} max-w-xl font-medium leading-relaxed`}>
                {t('hero.subtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                <button
                  onClick={onExploreMenu}
                  className={`px-4 py-2.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-black flex items-center gap-1.5 ${theme.styles.accent} ${theme.styles.buttonStyle} shadow-md`}
                >
                  <Coffee className="w-4 h-4" />
                  <span>{t('hero.exploreMenu')}</span>
                </button>

                {/* Coffee Match Swiper Button */}
                <button
                  onClick={onOpenTinderGame}
                  className="px-3.5 py-2.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-black flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md active:scale-95 transition-transform"
                >
                  <Flame className="w-4 h-4" />
                  <span>{t('hero.coffeeMatch')}</span>
                </button>

                <button
                  onClick={onOpenMoodQuiz}
                  className={`px-3.5 py-2.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-black flex items-center gap-1.5 ${theme.styles.bgCard} ${theme.styles.textPrimary} border-2 ${theme.styles.border} ${theme.styles.buttonStyle} hover:bg-black/5`}
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="hidden sm:inline">{t('hero.vibeQuiz')}</span>
                  <span className="sm:hidden">Quiz</span>
                </button>

                {/* Theme Switcher Button */}
                <button
                  onClick={onOpenThemeSelector}
                  className={`px-3 py-2.5 text-xs sm:text-sm font-black flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-cyan-500/15 border-2 border-amber-500/40 text-amber-900 dark:text-amber-200 active:scale-95 transition-transform`}
                >
                  <Palette className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{theme.icon} {t('hero.themeButton')}</span>
                </button>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <div className="relative w-48 h-40 lg:w-56 lg:h-48 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20">
                <img
                  src={
                    theme.id === 'drinko'
                      ? 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80'
                      : 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80'
                  }
                  alt="Specialty Coffee"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[11px] text-white font-black">
                    {theme.id === 'drinko' ? 'Iced Caramel Latte' : 'V60 Geisha Reserva'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
