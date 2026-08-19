import React, { useState } from 'react';
import { MOOD_QUESTIONS } from '../../data/moodQuestions';
import { PRODUCTS } from '../../data/products';
import type { Product } from '../../types/menu';
import { useTheme } from '../../theme/ThemeContext';
import { useBarista } from '../../context/BaristaContext';
import { formatCurrency } from '../../utils/formatters';
import { triggerQuizMatchConfetti } from '../../utils/confetti';
import { X, Sparkles, ArrowRight, RotateCcw, Plus, Flame } from 'lucide-react';

interface MoodQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const MoodQuizModal: React.FC<MoodQuizModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { theme } = useTheme();
  const { currency } = useBarista();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQuestion = MOOD_QUESTIONS[currentStep];

  const handleSelectOption = (tagMatch: string) => {
    const updated = [...selectedAnswers, tagMatch];
    setSelectedAnswers(updated);

    if (currentStep < MOOD_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate best matches
      calculateMatches(updated);
    }
  };

  const calculateMatches = (answers: string[]) => {
    // Scoring logic based on category or tags
    const scored = PRODUCTS.map((prod) => {
      let score = 0;
      if (answers.includes(prod.categoryId)) score += 3;
      if (prod.isHouseFavorite) score += 2;
      if (prod.isPopular) score += 1;
      if (answers.includes('hot') && (prod.categoryId === 'classics' || prod.categoryId === 'tea-chocolate')) score += 2;
      if (answers.includes('cold-brew') && prod.categoryId === 'frappes-cold') score += 3;
      if (answers.includes('food') && (prod.categoryId === 'bakery' || prod.categoryId === 'brunch')) score += 3;
      return { product: prod, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topPicks = scored.slice(0, 2).map((s) => s.product);
    setRecommendedProducts(topPicks);
    setIsFinished(true);
    triggerQuizMatchConfetti();
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setRecommendedProducts([]);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg ${theme.styles.bgCard} ${theme.styles.radius} border-2 ${theme.styles.border} shadow-2xl p-6 relative overflow-hidden`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors text-neutral-400 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {!isFinished ? (
          <div className="space-y-6">
            {/* Step Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-600">
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Descubre tu Café Ideal</span>
                </span>
                <span>
                  Paso {currentStep + 1} de {MOOD_QUESTIONS.length}
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${theme.styles.accent} transition-all duration-300`}
                  style={{
                    width: `${((currentStep + 1) / MOOD_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {currentQuestion.title}
              </h2>
              <p className={`text-xs sm:text-sm ${theme.styles.textSecondary} mt-1`}>
                {currentQuestion.subtitle}
              </p>
            </div>

            {/* Options list */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt.tagMatch)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 group transition-all ${theme.styles.bgCard} ${theme.styles.border} hover:border-amber-500 hover:shadow-md active:scale-98`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-black/5 dark:bg-white/5 shrink-0 group-hover:scale-110 transition-transform">
                      {opt.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm leading-snug">{opt.label}</h4>
                      <p className={`text-xs ${theme.styles.textMuted} mt-0.5`}>
                        {opt.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="space-y-5 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 mb-1">
              <Flame className="w-7 h-7 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block">
                ¡Tu maridaje de café perfecto!
              </span>
              <h2 className="text-2xl font-black mt-1">Recomendación para tu Vibra</h2>
              <p className={`text-xs ${theme.styles.textSecondary} mt-1 max-w-sm mx-auto`}>
                Basado en tu momento del día frente a la costa de Rosarito, seleccionamos estas joyas:
              </p>
            </div>

            {/* Recommended cards */}
            <div className="space-y-3 text-left">
              {recommendedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between gap-3"
                >
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-16 h-16 rounded-xl object-cover shadow-xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{prod.name}</h4>
                    <p className={`text-[11px] ${theme.styles.textSecondary} line-clamp-1`}>
                      {prod.shortDescription}
                    </p>
                    <span className="font-extrabold text-xs text-amber-600">
                      {formatCurrency(prod.basePrice, currency)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onSelectProduct(prod);
                    }}
                    className={`px-3 py-2 text-xs font-bold text-white flex items-center gap-1 shrink-0 ${theme.styles.accent} ${theme.styles.buttonStyle}`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>Elegir</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Restart button */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleRestart}
                className="text-xs font-semibold text-neutral-500 hover:text-black flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Volver a responder el quiz</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
