import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'costa_bruma_language';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  es: {
    // Brand & Header
    'brand.name': 'Costa Bruma',
    'brand.tagline': 'Café de Especialidad • Playas de Rosarito',
    'nav.menu': 'Menú',
    'nav.ourCafe': 'Nuestra Cafetería',
    'nav.cart': 'Comanda',
    'nav.myBasket': 'Mi Comanda',
    'nav.favorites': 'Favoritos',
    'nav.quiz': '¿Qué café va contigo?',
    'nav.theme': 'Cambiar Tema',
    'nav.wifi': 'WiFi Clientes',
    'nav.profile': 'Mi Perfil & Sellos',
    'nav.survey': 'Encuesta / Cupón',
    'nav.currency': 'Moneda',
    'nav.barista': 'Modo Barista',
    'nav.more': 'Más opciones',
    'nav.language': 'Idioma',

    // Hero
    'hero.badge': 'Tostaduría & Barra • Playas de Rosarito',
    'hero.title': 'Café de Especialidad frente a las olas de',
    'hero.subtitle': 'Granos de altura tostados semanalmente en casa. Panadería de masa madre y desayunos frescos de la costa.',
    'hero.exploreMenu': 'Ver Menú',
    'hero.coffeeMatch': 'Coffee Match (Swipe)',
    'hero.vibeQuiz': 'Recomendador por Vibra',
    'hero.themeButton': 'Tema',

    // Menu Controls
    'menu.searchPlaceholder': 'Buscar espresso, frío, tostadas, pan...',
    'menu.all': 'Todo el Menú',
    'menu.classics': 'Café Clásico & Espresso',
    'menu.frappes': 'Frappés & Fríos',
    'menu.teaChocolate': 'Tés, Chai, Matcha & Cacao',
    'menu.methods': 'Métodos Artesanales (V60, Chemex)',
    'menu.bakery': 'Panadería de Masa Madre',
    'menu.brunch': 'Toasts & Desayunos',
    'menu.beans': 'Granos para Casa (250g)',
    'menu.filters': 'Filtros Dietéticos',
    'menu.clearFilters': 'Limpiar filtros',
    'menu.results': 'productos encontrados',

    // Card & Product
    'product.customize': 'Personalizar ›',
    'product.add': 'Agregar +',
    'product.outOfStock': 'Agotado por hoy',
    'product.houseFavorite': 'Favorito de Casa',
    'product.prepTime': 'min prep',
    'product.price': 'Precio',
    'product.addToCart': 'Agregar a la Comanda',
    'product.tastingNotes': 'Notas de cata',
    'product.origin': 'Origen del Grano',
    'product.size': 'Tamaño',
    'product.milk': 'Tipo de Leche',
    'product.sweetness': 'Dulzura',
    'product.ice': 'Hielo',
    'product.syrups': 'Jarabes Artesanales',

    // Showcase
    'showcase.ourMenu': 'NUESTRO MENÚ',
    'showcase.ourCafe': 'LA BARRA',
    'showcase.search': 'BUSCAR CAFÉ',
    'showcase.myBasket': 'MI COMANDA',
    'showcase.selectSize': 'Tamaño del Vaso',
    'showcase.selectMilk': 'Tipo de Leche',
    'showcase.drinkType': 'Tipo de Preparación',
    'showcase.addToBasket': 'AGREGAR A LA COMANDA',
    'showcase.added': '¡Agregado con éxito!',
    'showcase.viewRecipe': 'Ver Receta & Notas Completas',

    // Cart & Checkout
    'cart.title': 'Tu Comanda Costera',
    'cart.empty': 'Tu comanda está vacía',
    'cart.emptySub': 'Elige tus cafés y antojos favoritos para comenzar.',
    'cart.subtotal': 'Subtotal',
    'cart.tip': 'Propina para el Barista',
    'cart.total': 'Total a Pagar',
    'cart.orderType': '¿Dónde recibirás tu orden?',
    'cart.table': 'Mesa en Cafetería',
    'cart.pickup': 'Para Llevar / Barra',
    'cart.beach': 'Entrega en Playa / Dunas',
    'cart.sendWhatsapp': 'Pedir por WhatsApp al 661 286 5423',
    'cart.posTicket': 'Generar Ticket Térmico',

    // Language Toggle
    'lang.es': 'Español',
    'lang.en': 'English',
  },
  en: {
    // Brand & Header
    'brand.name': 'Costa Bruma',
    'brand.tagline': 'Specialty Coffee • Rosarito Beach',
    'nav.menu': 'Menu',
    'nav.ourCafe': 'Our Coffeehouse',
    'nav.cart': 'Order Basket',
    'nav.myBasket': 'My Basket',
    'nav.favorites': 'Favorites',
    'nav.quiz': 'Which coffee fits your vibe?',
    'nav.theme': 'Switch Theme',
    'nav.wifi': 'Guest WiFi',
    'nav.profile': 'My Profile & Stamp Card',
    'nav.survey': 'Survey / 10% OFF Coupon',
    'nav.currency': 'Currency',
    'nav.barista': 'Barista Mode',
    'nav.more': 'More Options',
    'nav.language': 'Language',

    // Hero
    'hero.badge': 'Roastery & Espresso Bar • Playas de Rosarito',
    'hero.title': 'Specialty Coffee by the ocean waves of',
    'hero.subtitle': 'High-altitude Mexican coffee roasted in-house weekly. Sourdough bakery and fresh coastal brunches.',
    'hero.exploreMenu': 'Explore Menu',
    'hero.coffeeMatch': 'Coffee Match (Swipe)',
    'hero.vibeQuiz': 'Vibe Matchmaker',
    'hero.themeButton': 'Theme',

    // Menu Controls
    'menu.searchPlaceholder': 'Search espresso, iced, sourdough toasts, bakery...',
    'menu.all': 'All Menu Items',
    'menu.classics': 'Classic Coffee & Espresso Bar',
    'menu.frappes': 'Frappés & Iced Drinks',
    'menu.teaChocolate': 'Teas, Chai, Ceremonial Matcha & Cacao',
    'menu.methods': 'Manual Brew Methods (V60, Chemex)',
    'menu.bakery': 'Artisanal Sourdough Bakery',
    'menu.brunch': 'Coastal Toasts & Brunch',
    'menu.beans': 'Whole Bean Bags (250g)',
    'menu.filters': 'Dietary Filters',
    'menu.clearFilters': 'Clear filters',
    'menu.results': 'items found',

    // Card & Product
    'product.customize': 'Customize ›',
    'product.add': 'Add +',
    'product.outOfStock': 'Sold out today',
    'product.houseFavorite': 'House Favorite',
    'product.prepTime': 'min prep',
    'product.price': 'Price',
    'product.addToCart': 'Add to Order Basket',
    'product.tastingNotes': 'Tasting Notes',
    'product.origin': 'Single-Origin Bean',
    'product.size': 'Cup Size',
    'product.milk': 'Milk Option',
    'product.sweetness': 'Sweetness',
    'product.ice': 'Ice Level',
    'product.syrups': 'Artisanal Syrups',

    // Showcase
    'showcase.ourMenu': 'OUR MENU',
    'showcase.ourCafe': 'OUR CAFE',
    'showcase.search': 'SEARCH DRINKS',
    'showcase.myBasket': 'MY BASKET',
    'showcase.selectSize': 'Cup Size',
    'showcase.selectMilk': 'Milk Option',
    'showcase.drinkType': 'Brew Style',
    'showcase.addToBasket': 'ADD TO BASKET',
    'showcase.added': 'Added to Basket!',
    'showcase.viewRecipe': 'View Full Recipe & Tasting Notes',

    // Cart & Checkout
    'cart.title': 'Your Coastal Coffee Order',
    'cart.empty': 'Your basket is empty',
    'cart.emptySub': 'Pick your favorite coffee and bakery items to start.',
    'cart.subtotal': 'Subtotal',
    'cart.tip': 'Barista Tip',
    'cart.total': 'Total Due',
    'cart.orderType': 'Where would you like your order?',
    'cart.table': 'Dine-In Table',
    'cart.pickup': 'To-Go / Counter Pickup',
    'cart.beach': 'Beach Delivery / Pier Spot',
    'cart.sendWhatsapp': 'Send WhatsApp Order to 661 286 5423',
    'cart.posTicket': 'Print Thermal POS Receipt',

    // Language Toggle
    'lang.es': 'Español',
    'lang.en': 'English',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
      return saved === 'en' || saved === 'es' ? saved : 'es';
    } catch {
      return 'es';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (err) {
      console.warn('Could not save language', err);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  const t = (key: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.es;
    return dict[key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
