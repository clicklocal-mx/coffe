import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useBarista } from '../../context/BaristaContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShoppingBag, Palette, Coffee, Heart, DollarSign, Wifi, User, Star, MoreHorizontal, X, Globe } from 'lucide-react';

interface NavbarProps {
  onOpenMoodQuiz: () => void;
  onOpenWifi: () => void;
  onOpenProfile: () => void;
  onOpenFeedback: () => void;
  onOpenTinderGame?: () => void;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMoodQuiz,
  onOpenWifi,
  onOpenProfile,
  onOpenFeedback,
  onOpenTinderGame,
  showOnlyFavorites,
  setShowOnlyFavorites,
}) => {
  const { theme, setIsThemeModalOpen } = useTheme();
  const { totalItems, setIsCartOpen, favorites, orders } = useCart();
  const { currency, toggleCurrency, setIsBaristaModalOpen } = useBarista();
  const { language, toggleLanguage, t } = useLanguage();
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-200 ${theme.styles.bgHeader} border-b-2 ${theme.styles.border} shadow-xs backdrop-blur-md`}
        style={{ minHeight: '58px', maxHeight: '64px' }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div
            className="flex items-center justify-between gap-2"
            style={{ height: '58px' }}
          >
            {/* Brand Logo & Title (Fixed Protected Dimensions) */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`w-9 h-9 ${theme.styles.accent} flex items-center justify-center ${theme.styles.radius} shadow-xs shrink-0`}
                style={{ width: '36px', height: '36px' }}
              >
                <Coffee className="w-5 h-5 text-white" style={{ width: '20px', height: '20px' }} />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 leading-none">
                  <span
                    className={`font-black tracking-tight ${theme.styles.textPrimary}`}
                    style={{ fontSize: '17px', lineHeight: '1.1' }}
                  >
                    Costa Bruma
                  </span>
                  <span
                    className={`font-black ${theme.styles.badgeBg} ${theme.styles.badgeText} rounded-full`}
                    style={{ fontSize: '9px', padding: '1px 6px' }}
                  >
                    Rosarito
                  </span>
                </div>
                <span
                  className={`${theme.styles.textMuted} font-bold hidden sm:block`}
                  style={{ fontSize: '10px', marginTop: '1px' }}
                >
                  {t('brand.tagline')}
                </span>
              </div>
            </div>

            {/* Desktop Center Links */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={onOpenMoodQuiz}
                className={`px-3 py-1.5 text-xs font-black flex items-center gap-1.5 ${theme.styles.buttonStyle} ${theme.styles.badgeBg} ${theme.styles.badgeText} border ${theme.styles.borderAccent}`}
              >
                <span>✨</span>
                <span>{t('nav.quiz')}</span>
              </button>

              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`px-3 py-1.5 text-xs font-black flex items-center gap-1.5 ${theme.styles.buttonStyle} ${
                  showOnlyFavorites
                    ? `${theme.styles.accent}`
                    : `${theme.styles.bgCard} ${theme.styles.textSecondary} ${theme.styles.border} border`
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-current' : ''}`} />
                <span>{t('nav.favorites')} ({favorites.length})</span>
              </button>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Language Switcher Pill Button */}
              <button
                onClick={toggleLanguage}
                title="Cambiar idioma / Switch language (ES / EN)"
                className="px-2.5 py-1 rounded-full border-2 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-1 active:scale-95 transition-all shadow-xs"
                style={{ height: '34px' }}
              >
                <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="font-extrabold">{language === 'es' ? '🇲🇽 ES' : '🇺🇸 EN'}</span>
              </button>

              {/* Cart Drawer Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative px-3.5 py-1.5 text-xs sm:text-sm font-black flex items-center gap-1.5 ${theme.styles.accent} ${theme.styles.buttonStyle} shadow-sm shrink-0`}
                style={{ height: '36px' }}
              >
                <ShoppingBag className="w-4 h-4" style={{ width: '16px', height: '16px' }} />
                <span className="hidden sm:inline">{t('nav.cart')}</span>
                {totalItems > 0 && (
                  <span
                    className="bg-white text-black font-black rounded-full min-w-[16px] text-center shadow-xs"
                    style={{ fontSize: '10px', padding: '1px 5px' }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>

              {/* More Quick Options Menu Button */}
              <button
                onClick={() => setIsQuickMenuOpen(true)}
                title={t('nav.more')}
                className={`flex items-center justify-center ${theme.styles.radius} ${theme.styles.bgCard} ${theme.styles.textPrimary} border-2 ${theme.styles.border} hover:bg-black/5 transition-colors`}
                style={{ width: '36px', height: '36px' }}
              >
                <MoreHorizontal className="w-4 h-4" style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Clean Quick Options Modal / Bottom Sheet */}
      {isQuickMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md ${theme.styles.bgCard} rounded-t-3xl sm:rounded-3xl border-2 ${theme.styles.border} shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200`}
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌊</span>
                <div>
                  <h3 className={`font-black text-sm ${theme.styles.textPrimary}`}>Costa Bruma Café</h3>
                  <p className={`text-[11px] ${theme.styles.textMuted}`}>{t('nav.more')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuickMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/10 text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Coffee Tinder Game */}
              {onOpenTinderGame && (
                <button
                  onClick={() => {
                    setIsQuickMenuOpen(false);
                    onOpenTinderGame();
                  }}
                  className={`p-3 rounded-2xl border-2 border-rose-500/40 bg-gradient-to-br from-rose-500/10 to-amber-500/10 hover:border-rose-500 flex items-center gap-2.5 text-left font-bold transition-all col-span-2`}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="text-sm">🔥</span>
                  </div>
                  <div>
                    <span className="block font-black text-rose-600 dark:text-rose-400">Coffee Match (Swipe)</span>
                    <span className={`text-[10px] ${theme.styles.textMuted}`}>{language === 'es' ? 'Desliza para elegir tu bebida o comida' : 'Swipe to match drinks & food'}</span>
                  </div>
                </button>
              )}

              {/* Language Switcher */}
              <button
                onClick={() => {
                  toggleLanguage();
                }}
                className={`p-3 rounded-2xl border-2 border-amber-500/40 ${theme.styles.bgCard} hover:border-amber-500 flex items-center gap-2.5 text-left font-bold transition-all`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-black">{t('nav.language')}: {language.toUpperCase()}</span>
                  <span className={`text-[10px] text-amber-600 font-bold`}>{language === 'es' ? 'Cambiar a English' : 'Switch to Español'}</span>
                </div>
              </button>

              {/* Theme Switcher */}
              <button
                onClick={() => {
                  setIsQuickMenuOpen(false);
                  setIsThemeModalOpen(true);
                }}
                className={`p-3 rounded-2xl border-2 ${theme.styles.border} ${theme.styles.bgCard} hover:border-amber-500 flex items-center gap-2.5 text-left font-bold transition-all`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-black">{t('nav.theme')}</span>
                  <span className={`text-[10px] ${theme.styles.textMuted}`}>{theme.name.split(' ')[0]}</span>
                </div>
              </button>

              {/* Profile & Loyalty */}
              <button
                onClick={() => {
                  setIsQuickMenuOpen(false);
                  onOpenProfile();
                }}
                className={`p-3 rounded-2xl border-2 ${theme.styles.border} ${theme.styles.bgCard} hover:border-amber-500 flex items-center gap-2.5 text-left font-bold transition-all`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-black">{t('nav.profile')}</span>
                  <span className={`text-[10px] ${theme.styles.textMuted}`}>{orders.length} {language === 'es' ? 'pedidos' : 'orders'}</span>
                </div>
              </button>

              {/* WiFi Quick Connect */}
              <button
                onClick={() => {
                  setIsQuickMenuOpen(false);
                  onOpenWifi();
                }}
                className={`p-3 rounded-2xl border-2 ${theme.styles.border} ${theme.styles.bgCard} hover:border-emerald-500 flex items-center gap-2.5 text-left font-bold transition-all`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-black">{t('nav.wifi')}</span>
                  <span className={`text-[10px] text-emerald-600 font-bold`}>QR Auto-Connect</span>
                </div>
              </button>

              {/* Feedback Survey */}
              <button
                onClick={() => {
                  setIsQuickMenuOpen(false);
                  onOpenFeedback();
                }}
                className={`p-3 rounded-2xl border-2 ${theme.styles.border} ${theme.styles.bgCard} hover:border-amber-500 flex items-center gap-2.5 text-left font-bold transition-all`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                <div>
                  <span className="block font-black">{t('nav.survey')}</span>
                  <span className={`text-[10px] text-amber-600 font-bold`}>10% OFF</span>
                </div>
              </button>

              {/* Currency Toggle */}
              <button
                onClick={() => {
                  toggleCurrency();
                }}
                className={`p-3 rounded-2xl border-2 ${theme.styles.border} ${theme.styles.bgCard} hover:border-neutral-500 flex items-center gap-2.5 text-left font-bold transition-all`}
              >
                <div className="w-8 h-8 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-black">{t('nav.currency')}: {currency}</span>
                  <span className={`text-[10px] ${theme.styles.textMuted}`}>{language === 'es' ? 'Toca para alternar' : 'Tap to switch'}</span>
                </div>
              </button>

              {/* Barista Mode */}
              <button
                onClick={() => {
                  setIsQuickMenuOpen(false);
                  setIsBaristaModalOpen(true);
                }}
                className={`p-3 rounded-2xl border-2 ${theme.styles.border} ${theme.styles.bgCard} hover:border-neutral-500 flex items-center gap-2.5 text-left font-bold transition-all`}
              >
                <div className="w-8 h-8 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center shrink-0">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-black">{t('nav.barista')}</span>
                  <span className={`text-[10px] ${theme.styles.textMuted}`}>Stock & Turno</span>
                </div>
              </button>
            </div>

            {/* Bottom close */}
            <div className="pt-2 border-t border-black/10 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setIsQuickMenuOpen(false)}
                className={`px-5 py-2 text-xs font-black ${theme.styles.accent} ${theme.styles.buttonStyle}`}
              >
                {language === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
