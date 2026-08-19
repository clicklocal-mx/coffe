import React, { useEffect, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallBanner: React.FC = () => {
  const { theme } = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowBanner(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert(
        'Para instalar en iPhone: Toca el botón "Compartir" en Safari y selecciona "Agregar al Inicio".\nEn Android/Chrome: Usa el menú del navegador y selecciona "Instalar aplicación".'
      );
      return;
    }
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner && !installed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40 animate-in slide-in-from-bottom duration-300">
      <div
        className={`p-4 rounded-2xl ${theme.styles.bgCard} border-2 ${theme.styles.border} shadow-2xl flex items-center justify-between gap-3`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${theme.styles.accent} text-white`}>
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs">Instala la App de Costa Bruma</h4>
            <p className={`text-[11px] ${theme.styles.textMuted}`}>
              Accede al menú offline y haz pedidos sin descargar nada de la App Store.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className={`px-3 py-1.5 text-xs font-bold text-white flex items-center gap-1 ${theme.styles.accent} ${theme.styles.buttonStyle}`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar</span>
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
