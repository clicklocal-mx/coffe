import { useState, useMemo } from 'react';
import type { CategoryId, DietaryTag } from '../types/menu';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { useCart } from '../context/CartContext';

export const useProductFilter = () => {
  const { favorites } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<DietaryTag['id'] | 'all' | 'favorites'>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Compute product counts per category
  const productCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      all: PRODUCTS.length,
      classics: 0,
      'frappes-cold': 0,
      'tea-chocolate': 0,
      methods: 0,
      bakery: 0,
      brunch: 0,
      beans: 0,
    };

    PRODUCTS.forEach((p) => {
      if (counts[p.categoryId] !== undefined) {
        counts[p.categoryId]++;
      }
    });

    return counts;
  }, []);

  // Filter products based on category, search, tag, and favorites
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((prod) => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && prod.categoryId !== selectedCategory) {
        return false;
      }

      // 2. Favorites Filter
      if (showOnlyFavorites || activeTag === 'favorites') {
        if (!favorites.includes(prod.id)) return false;
      }

      // 3. Tag Filter
      if (activeTag !== 'all' && activeTag !== 'favorites') {
        if (!prod.tags.includes(activeTag)) return false;
      }

      // 4. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = prod.name.toLowerCase().includes(q);
        const matchDesc = prod.shortDescription.toLowerCase().includes(q) || prod.fullDescription.toLowerCase().includes(q);
        const matchNotes = prod.notes?.toLowerCase().includes(q) || false;
        const matchOrigin = prod.origin?.toLowerCase().includes(q) || false;
        if (!matchName && !matchDesc && !matchNotes && !matchOrigin) return false;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, activeTag, showOnlyFavorites, favorites]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setActiveTag('all');
    setShowOnlyFavorites(false);
  };

  return {
    categories: CATEGORIES,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    activeTag,
    setActiveTag,
    showOnlyFavorites,
    setShowOnlyFavorites,
    productCounts,
    filteredProducts,
    resetFilters,
  };
};
