import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { triggerQuizMatchConfetti } from '../../utils/confetti';
import { Star, MessageSquare, Sparkles, X, CheckCircle2, Gift, Send } from 'lucide-react';

interface CafeFeedbackSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEEDBACK_STORAGE_KEY = 'costa_bruma_saved_feedback';

export const CafeFeedbackSurveyModal: React.FC<CafeFeedbackSurveyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState<'review' | 'market'>('review');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [extractionQuality, setExtractionQuality] = useState('Perfecta y balanceada');
  const [serviceRating, setServiceRating] = useState('Excelente y amable');
  const [comment, setComment] = useState('');
  
  // Market Survey states
  const [visitorOrigin, setVisitorOrigin] = useState('Local de Rosarito');
  const [suggestedProducts, setSuggestedProducts] = useState<string[]>([]);
  const [frequency, setFrequency] = useState('Todos los días');
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleToggleSuggestion = (item: string) => {
    setSuggestedProducts((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      rating,
      extractionQuality,
      serviceRating,
      comment,
      visitorOrigin,
      suggestedProducts,
      frequency,
    };

    try {
      const existing = JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify([payload, ...existing]));
    } catch {
      // ignore
    }

    triggerQuizMatchConfetti();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg max-h-[92vh] flex flex-col ${theme.styles.bgCard} ${theme.styles.radius} border-2 ${theme.styles.border} shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-black flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base">Opinión & Encuesta Costa Bruma</h3>
              <p className={`text-xs ${theme.styles.textMuted}`}>
                Tu feedback mejora el tostado y servicio en Rosarito
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/10 text-neutral-400 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        {!isSubmitted && (
          <div className="flex border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 px-4 pt-2">
            <button
              onClick={() => setActiveTab('review')}
              className={`px-4 py-2.5 text-xs font-black flex items-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'review'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>¿Qué te pareció el café?</span>
            </button>

            <button
              onClick={() => setActiveTab('market')}
              className={`px-4 py-2.5 text-xs font-black flex items-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'market'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Encuesta & Deseos del Menú</span>
            </button>
          </div>
        )}

        {/* Form Content */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
            {activeTab === 'review' ? (
              <div className="space-y-4">
                {/* Star rating */}
                <div className="text-center space-y-2 py-1">
                  <label className="font-extrabold text-sm block">
                    ¿Cómo calificarías tu experiencia general?
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 active:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 ${
                            (hoverRating || rating) >= star
                              ? 'text-amber-500 fill-amber-500 drop-shadow-sm'
                              : 'text-neutral-300 dark:text-neutral-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-amber-600">
                    {rating === 5 && '⭐️⭐️⭐️⭐️⭐️ ¡Insuperable!'}
                    {rating === 4 && '⭐️⭐️⭐️⭐️ Muy bueno'}
                    {rating === 3 && '⭐️⭐️⭐️ Bueno'}
                    {rating === 2 && '⭐️⭐️ Regular'}
                    {rating === 1 && '⭐️ Por mejorar'}
                  </span>
                </div>

                {/* Calidad de Extracción */}
                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-neutral-400 block">
                    Temperatura y Extracción del Café
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      'Perfecta y balanceada',
                      'Muy caliente / Sedoso',
                      'Bien frío / Refrescante',
                      'Demasiado ácido / Faltó dulzura',
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setExtractionQuality(opt)}
                        className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                          extractionQuality === opt
                            ? `${theme.styles.accent} text-white border-transparent`
                            : `${theme.styles.bgCard} ${theme.styles.textSecondary} border-${theme.styles.border}`
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Servicio Barista */}
                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-neutral-400 block">
                    Atención de los Baristas
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Excelente y amable', 'Rápido y atento', 'Puede mejorar'].map((srv) => (
                      <button
                        type="button"
                        key={srv}
                        onClick={() => setServiceRating(srv)}
                        className={`p-2 text-center rounded-xl border font-bold transition-all ${
                          serviceRating === srv
                            ? `${theme.styles.accent} text-white border-transparent`
                            : `${theme.styles.bgCard} ${theme.styles.textSecondary} border-${theme.styles.border}`
                        }`}
                      >
                        {srv}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comentarios libres */}
                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-neutral-400 block">
                    ¿Alguna sugerencia o felicitación para la barra?
                  </label>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nos encanta leer qué podemos añadir o perfeccionar..."
                    className={`w-full p-2.5 rounded-xl border ${theme.styles.border} ${theme.styles.bgCard} ${theme.styles.textPrimary} focus:outline-none`}
                  />
                </div>
              </div>
            ) : (
              /* Market Survey Tab */
              <div className="space-y-4">
                {/* Visitor origin */}
                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-neutral-400 block">
                    ¿De dónde nos visitas hoy?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {[
                      'Local de Rosarito',
                      'Tijuana',
                      'Ensenada / Valle',
                      'San Diego / California',
                      'Turista Nacional',
                      'Otro País',
                    ].map((orig) => (
                      <button
                        type="button"
                        key={orig}
                        onClick={() => setVisitorOrigin(orig)}
                        className={`p-2 rounded-xl border font-bold text-center transition-all ${
                          visitorOrigin === orig
                            ? `${theme.styles.accent} text-white border-transparent`
                            : `${theme.styles.bgCard} ${theme.styles.textSecondary} border-${theme.styles.border}`
                        }`}
                      >
                        {orig}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deseos para el menú */}
                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-neutral-400 block">
                    ¿Qué novedades te gustaría ver en Costa Bruma?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {[
                      'Granos de Nayarit / Puebla',
                      'Opciones Keto / Sin Azúcar',
                      'Postres 100% Veganos',
                      'Cold Brew embotellado para llevar',
                      'Catas y talleres de barismo',
                      'Suscripción mensual de granos',
                    ].map((sug) => {
                      const isSel = suggestedProducts.includes(sug);
                      return (
                        <button
                          type="button"
                          key={sug}
                          onClick={() => handleToggleSuggestion(sug)}
                          className={`p-2.5 rounded-xl border font-bold text-left flex items-center justify-between transition-all ${
                            isSel
                              ? `${theme.styles.accent} text-white border-transparent`
                              : `${theme.styles.bgCard} ${theme.styles.textSecondary} border-${theme.styles.border}`
                          }`}
                        >
                          <span>{sug}</span>
                          {isSel && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Frecuencia de consumo */}
                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-neutral-400 block">
                    ¿Con qué frecuencia tomas café de especialidad?
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Todos los días', '2-3 por semana', 'Fines de semana'].map((freq) => (
                      <button
                        type="button"
                        key={freq}
                        onClick={() => setFrequency(freq)}
                        className={`p-2 text-center rounded-xl border font-bold transition-all ${
                          frequency === freq
                            ? `${theme.styles.accent} text-white border-transparent`
                            : `${theme.styles.bgCard} ${theme.styles.textSecondary} border-${theme.styles.border}`
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2 ${theme.styles.accent} ${theme.styles.buttonStyle} shadow-lg active:scale-95 transition-transform`}
              >
                <Send className="w-4 h-4" />
                <span>Enviar Opinión & Ganar Cupón 10%</span>
              </button>
            </div>
          </form>
        ) : (
          /* Thank You & Coupon View */
          <div className="p-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-500/15 text-emerald-600 mb-1">
              <Gift className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600 block">
                ¡Muchas Gracias por tu Feedback!
              </span>
              <h3 className="text-2xl font-black mt-1">Tu Cupón de Descuento</h3>
              <p className={`text-xs ${theme.styles.textSecondary} max-w-xs mx-auto mt-1`}>
                Muestra este código al barista en tu próxima visita o agrégalo en tu comanda de WhatsApp:
              </p>
            </div>

            {/* Coupon Box */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-amber-500 bg-amber-500/10 max-w-xs mx-auto space-y-1">
              <span className="font-mono font-black text-xl text-amber-700 dark:text-amber-300 tracking-wider">
                ROSACOFFEE10
              </span>
              <p className="text-[10px] font-bold text-neutral-500">
                10% OFF en cualquier café de especialidad
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleReset}
                className={`px-6 py-2.5 text-xs font-bold text-white ${theme.styles.accent} ${theme.styles.buttonStyle}`}
              >
                Volver al Menú
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
