import React, { useState, useRef } from 'react';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider, useCart } from './context/CartContext';
import { BaristaProvider } from './context/BaristaContext';
import { useProductFilter } from './hooks/useProductFilter';
import type { Product } from './types/menu';

import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/layout/HeroSection';
import { Footer } from './components/layout/Footer';
import { ThemeSelectorModal } from './components/layout/ThemeSelectorModal';
import { StickyZoomButton } from './components/layout/StickyZoomButton';

import { StickyMenuControlBar } from './components/menu/StickyMenuControlBar';
import { ProductGrid } from './components/menu/ProductGrid';
import { ProductDetailModal } from './components/menu/ProductDetailModal';

import { CartDrawer } from './components/cart/CartDrawer';
import { MobileFloatingCartPill } from './components/cart/MobileFloatingCartPill';
import { MoodQuizModal } from './components/quiz/MoodQuizModal';
import { CoffeeTinderModal } from './components/gamification/CoffeeTinderModal';
import { ThermalTicketModal } from './components/ticket/ThermalTicketModal';
import { BaristaStockToggleModal } from './components/barista/BaristaStockToggleModal';
import { PwaInstallBanner } from './components/pwa/PwaInstallBanner';
import { WifiModal } from './components/layout/WifiModal';
import { CustomerProfileModal } from './components/loyalty/CustomerProfileModal';
import { CafeFeedbackSurveyModal } from './components/feedback/CafeFeedbackSurveyModal';
import { EditorialSpotlightBanner } from './components/marketing/EditorialSpotlightBanner';

const MainMenuContent: React.FC = () => {
  const { activeTicketOrder, setActiveTicketOrder } = useCart();
  const { setIsThemeModalOpen } = useTheme();
  const menuSectionRef = useRef<HTMLDivElement>(null);

  const {
    categories,
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
  } = useProductFilter();

  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isMoodQuizOpen, setIsMoodQuizOpen] = useState(false);
  const [isTinderModalOpen, setIsTinderModalOpen] = useState(false);
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleScrollToMenu = () => {
    menuSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-500 selection:text-white pb-16 sm:pb-0">
      {/* Top Clean Navigation */}
      <Navbar
        onOpenMoodQuiz={() => setIsMoodQuizOpen(true)}
        onOpenWifi={() => setIsWifiModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
        onOpenTinderGame={() => setIsTinderModalOpen(true)}
        showOnlyFavorites={showOnlyFavorites}
        setShowOnlyFavorites={setShowOnlyFavorites}
      />

      {/* Hero Coastal Specialty Banner with Tinder & Theme Action */}
      <HeroSection
        onOpenMoodQuiz={() => setIsMoodQuizOpen(true)}
        onOpenTinderGame={() => setIsTinderModalOpen(true)}
        onExploreMenu={handleScrollToMenu}
        onOpenThemeSelector={() => setIsThemeModalOpen(true)}
      />

      {/* Interactive Menu Anchor with Compact Sticky Header */}
      <main ref={menuSectionRef} className="flex-1 space-y-3 sm:space-y-4">
        {/* Sticky Search, Category & Filter Header */}
        <StickyMenuControlBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          productCounts={productCounts}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          filteredCount={filteredProducts.length}
        />

        {/* Products Grid / Mobile List */}
        <ProductGrid
          products={filteredProducts}
          onOpenDetail={(product) => setSelectedProductForModal(product)}
          onResetFilters={resetFilters}
        />

        {/* Editorial Spotlight Banner (Featured Drink Showcase matching Drinko) */}
        <EditorialSpotlightBanner />
      </main>

      {/* Footer */}
      <Footer
        onOpenWifi={() => setIsWifiModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
      />

      {/* Sticky Magnifying Glass Font Size Zoomer */}
      <StickyZoomButton />

      {/* Mobile Floating Cart Action */}
      <MobileFloatingCartPill />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />

      <CartDrawer />

      <CoffeeTinderModal
        isOpen={isTinderModalOpen}
        onClose={() => setIsTinderModalOpen(false)}
        onOpenProductDetail={(product) => {
          setIsTinderModalOpen(false);
          setSelectedProductForModal(product);
        }}
      />

      <MoodQuizModal
        isOpen={isMoodQuizOpen}
        onClose={() => setIsMoodQuizOpen(false)}
        onSelectProduct={(product) => setSelectedProductForModal(product)}
      />

      <WifiModal
        isOpen={isWifiModalOpen}
        onClose={() => setIsWifiModalOpen(false)}
      />

      <CustomerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <CafeFeedbackSurveyModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />

      <ThermalTicketModal
        order={activeTicketOrder}
        onClose={() => setActiveTicketOrder(null)}
      />

      <ThemeSelectorModal />

      <BaristaStockToggleModal />

      <PwaInstallBanner />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <CartProvider>
          <BaristaProvider>
            <MainMenuContent />
          </BaristaProvider>
        </CartProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
