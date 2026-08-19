import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { Coffee, MapPin, Clock, Wifi, Waves, Camera, Star, User } from 'lucide-react';

interface FooterProps {
  onOpenWifi: () => void;
  onOpenProfile: () => void;
  onOpenFeedback: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenWifi,
  onOpenProfile,
  onOpenFeedback,
}) => {
  const { theme, setIsThemeModalOpen } = useTheme();

  return (
    <footer
      className={`mt-16 border-t ${theme.styles.border} ${theme.styles.bgCard} text-xs transition-colors`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl ${theme.styles.accent} flex items-center justify-center`}
              >
                <Coffee className="w-4 h-4" />
              </div>
              <span className={`font-extrabold text-base tracking-tight ${theme.styles.textPrimary}`}>
                Costa Bruma Café
              </span>
            </div>
            <p className={`${theme.styles.textSecondary} leading-relaxed`}>
              Tostaduría de café de especialidad y cocina de mar en Playas de Rosarito, Baja California.
            </p>
            <div className="flex items-center gap-2 text-cyan-600 font-bold">
              <Waves className="w-4 h-4" />
              <span>A 200m de las olas de Rosarito</span>
            </div>
          </div>

          {/* Col 2: Location & Contact */}
          <div className="space-y-2.5">
            <h4 className="font-bold uppercase tracking-wider text-neutral-400">Ubicación & Contacto</h4>
            <div className="flex items-start gap-2 text-neutral-600 dark:text-neutral-300">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Blvd. Benito Juárez #450, Playas de Rosarito, B.C., México</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Lunes a Domingo: 7:00 AM - 9:00 PM</span>
            </div>
          </div>

          {/* Col 3: WiFi & Loyalty */}
          <div className="space-y-2.5">
            <h4 className="font-bold uppercase tracking-wider text-neutral-400">Para Clientes</h4>
            <div
              onClick={onOpenWifi}
              className="p-3 rounded-xl bg-black/5 dark:bg-white/5 space-y-1 cursor-pointer hover:bg-black/10 transition-colors border border-black/5 dark:border-white/5"
            >
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-amber-500" />
                  <span>WiFi de Alta Velocidad</span>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-1.5 py-0.5 rounded">
                  Auto-Conectar
                </span>
              </div>
              <p className="font-mono text-[11px] text-neutral-500">
                Red: <strong>CostaBrumaCafe</strong> | Clave: <strong>RosaritoWaves</strong>
              </p>
            </div>

            {/* Quick Profile / Stamps trigger */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onOpenProfile}
                className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 font-bold flex items-center justify-center gap-1.5 hover:bg-black/5"
              >
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span>Tarjeta Sellos</span>
              </button>

              <button
                onClick={onOpenFeedback}
                className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 font-bold flex items-center justify-center gap-1.5 hover:bg-black/5"
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Encuesta</span>
              </button>
            </div>
          </div>

          {/* Col 4: Theme Demo Switcher */}
          <div className="space-y-2.5">
            <h4 className="font-bold uppercase tracking-wider text-neutral-400">Emprendimiento Digital</h4>
            <p className={`${theme.styles.textSecondary}`}>
              Mockup interactivo para cafeterías con 7 identidades visuales completas.
            </p>
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-black ${theme.styles.accent} ${theme.styles.buttonStyle} flex items-center justify-center gap-1.5 shadow-sm`}
            >
              <span>Probar otros 6 Diseños</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500">
          <p>© {new Date().getFullYear()} Costa Bruma Café & Tostaduría. Hecho con ❤️ en Rosarito, B.C.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-amber-500 cursor-pointer flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              @costabrumacafe
            </span>
            <span>•</span>
            <span>PWA Offline Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
