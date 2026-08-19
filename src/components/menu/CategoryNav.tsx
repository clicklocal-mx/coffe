import React from 'react';
import type { Category, CategoryId } from '../../types/menu';
import { useTheme } from '../../theme/ThemeContext';

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  productCounts: Record<CategoryId, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  productCounts,
}) => {
  const { theme } = useTheme();

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2.5 min-w-max px-4 sm:px-6 lg:px-8">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = productCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                theme.styles.radius
              } ${
                isSelected
                  ? `${theme.styles.accent} text-white shadow-md scale-105`
                  : `${theme.styles.bgCard} ${theme.styles.textSecondary} hover:${theme.styles.textPrimary} border ${theme.styles.border}`
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isSelected
                    ? 'bg-white/25 text-white'
                    : 'bg-black/5 dark:bg-white/10 text-neutral-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
