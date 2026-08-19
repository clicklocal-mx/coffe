import React, { useState } from 'react';
import type { Category, CategoryId, DietaryTag } from '../../types/menu';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Search, X, SlidersHorizontal, Sparkles, Award, Leaf, Wheat, Heart } from 'lucide-react';

interface StickyMenuControlBarProps {
  categories: Category[];
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  productCounts: Record<CategoryId, number>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTag: DietaryTag['id'] | 'all' | 'favorites';
  setActiveTag: (tag: DietaryTag['id'] | 'all' | 'favorites') => void;
  filteredCount: number;
}

export const StickyMenuControlBar: React.FC<StickyMenuControlBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  productCounts,
  searchQuery,
  setSearchQuery,
  activeTag,
  setActiveTag,
  filteredCount,
}) => {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);

  const filterTags: Array<{ id: DietaryTag['id'] | 'all' | 'favorites'; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: language === 'es' ? 'Todos' : 'All', icon: null },
    { id: 'house-special', label: language === 'es' ? 'Favoritos Rosarito' : 'Rosarito Specials', icon: <Sparkles className="w-3 h-3 text-amber-500" /> },
    { id: 'local-beans', label: language === 'es' ? 'Granos Mexicanos' : 'Mexican Beans', icon: <Award className="w-3 h-3 text-emerald-500" /> },
    { id: 'vegan', label: 'Plant-Based', icon: <Leaf className="w-3 h-3 text-emerald-600" /> },
    { id: 'gluten-free', label: language === 'es' ? 'Sin Gluten' : 'Gluten-Free', icon: <Wheat className="w-3 h-3 text-amber-600" /> },
    { id: 'favorites', label: language === 'es' ? 'Favoritos' : 'Favorites', icon: <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> },
  ];

  return (
    <div
      className={`sticky top-14 sm:top-16 z-30 w-full transition-all duration-200 ${theme.styles.bgHeader} border-b-2 ${theme.styles.border} shadow-xs backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 space-y-1.5">
        {/* Row 1: Search Input + Filter Toggle Button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.styles.textMuted}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('menu.searchPlaceholder')}
              className={`w-full pl-9 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm font-bold ${theme.styles.bgCard} ${theme.styles.textPrimary} border-2 ${theme.styles.border} ${theme.styles.radius} focus:border-amber-500 focus:outline-none placeholder:${theme.styles.textMuted}`}
            />
            {searchQuery && (
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-neutral-400">
                  {filteredCount} {t('menu.results')}
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-neutral-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1.5 sm:py-2 text-xs font-black flex items-center gap-1.5 ${theme.styles.radius} border-2 ${
              showFilters || activeTag !== 'all'
                ? `${theme.styles.accent} border-transparent shadow-xs`
                : `${theme.styles.bgCard} ${theme.styles.textSecondary} ${theme.styles.border}`
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('menu.filters')}</span>
            {activeTag !== 'all' && <span className="w-2 h-2 rounded-full bg-amber-400" />}
          </button>
        </div>

        {/* Row 2: Category Badges Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = productCounts[cat.id] || 0;
            const categoryName = language === 'en' && cat.nameEn ? cat.nameEn : cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shrink-0 active:scale-95 ${
                  isSelected
                    ? `${theme.styles.accent} shadow-xs`
                    : `${theme.styles.bgCard} ${theme.styles.textSecondary} border-2 ${theme.styles.border} hover:border-amber-500/40`
                }`}
              >
                <span>{cat.icon}</span>
                <span>{categoryName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10 text-neutral-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Collapsible Row 3: Dietary Tags Bar */}
        {showFilters && (
          <div className="pt-1 pb-0.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none animate-in fade-in slide-in-from-top-1 duration-150 border-t border-black/5 dark:border-white/5">
            <span className={`text-[10px] font-black uppercase ${theme.styles.textMuted} shrink-0`}>
              {language === 'es' ? 'Filtro:' : 'Filter:'}
            </span>
            {filterTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setActiveTag(tag.id)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 shrink-0 transition-all ${
                  activeTag === tag.id
                    ? `${theme.styles.accent}`
                    : `${theme.styles.bgCard} ${theme.styles.textSecondary} border ${theme.styles.border}`
                }`}
              >
                {tag.icon}
                <span>{tag.label}</span>
              </button>
            ))}

            {activeTag !== 'all' && (
              <button
                onClick={() => setActiveTag('all')}
                className="text-[10px] font-black text-rose-500 hover:underline shrink-0 ml-1"
              >
                {t('menu.clearFilters')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
