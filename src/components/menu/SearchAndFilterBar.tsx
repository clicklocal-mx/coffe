import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { Search, X, Sparkles, Leaf, Award, Wheat, Heart } from 'lucide-react';
import type { DietaryTag } from '../../types/menu';

interface SearchAndFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTag: DietaryTag['id'] | 'all' | 'favorites';
  setActiveTag: (tag: DietaryTag['id'] | 'all' | 'favorites') => void;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  activeTag,
  setActiveTag,
}) => {
  const { theme } = useTheme();

  const filterTags: Array<{ id: DietaryTag['id'] | 'all' | 'favorites'; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'Todos', icon: null },
    { id: 'house-special', label: 'Especiales Rosarito', icon: <Sparkles className="w-3 h-3 text-amber-500" /> },
    { id: 'local-beans', label: 'Granos Mexicanos', icon: <Award className="w-3 h-3 text-emerald-500" /> },
    { id: 'vegan', label: 'Plant-Based / Vegano', icon: <Leaf className="w-3 h-3 text-emerald-600" /> },
    { id: 'gluten-free', label: 'Sin Gluten', icon: <Wheat className="w-3 h-3 text-amber-600" /> },
    { id: 'favorites', label: 'Mis Favoritos', icon: <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
      {/* Search Input Box */}
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.styles.textMuted}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar café de especialidad, V60, toast de aguacate, matcha..."
          className={`w-full pl-11 pr-10 py-3 text-sm font-medium ${theme.styles.bgCard} ${theme.styles.textPrimary} border ${theme.styles.border} ${theme.styles.radius} focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-xs placeholder:${theme.styles.textMuted}`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 text-neutral-400 hover:text-neutral-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dietary & Highlight Tags */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {filterTags.map((tag) => {
          const isActive = activeTag === tag.id;
          return (
            <button
              key={tag.id}
              onClick={() => setActiveTag(tag.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 whitespace-nowrap transition-all border ${
                isActive
                  ? `${theme.styles.accent} text-white border-transparent shadow-xs`
                  : `${theme.styles.bgCard} ${theme.styles.textSecondary} border-${theme.styles.border} hover:border-neutral-400`
              }`}
            >
              {tag.icon}
              <span>{tag.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
