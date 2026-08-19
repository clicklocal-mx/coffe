import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { Wifi, X, Copy, Check, Smartphone, Sparkles } from 'lucide-react';

interface WifiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WifiModal: React.FC<WifiModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const ssid = 'CostaBrumaCafe';
  const password = 'RosaritoWaves';
  const security = 'WPA';

  // Standard universal WiFi QR protocol for iOS & Android
  const wifiQrString = `WIFI:T:${security};S:${ssid};P:${password};;`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    wifiQrString
  )}&bgcolor=ffffff&color=231b15&margin=2`;

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md ${theme.styles.bgCard} ${theme.styles.radius} border-2 ${theme.styles.border} shadow-2xl p-6 relative overflow-hidden`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors text-neutral-400 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 mb-1">
            <Wifi className="w-6 h-6 animate-pulse" />
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Conexión Automática Clientes</span>
          </div>

          <h3 className="text-2xl font-bold tracking-tight">WiFi Costa Bruma</h3>
          <p className={`text-xs ${theme.styles.textSecondary} max-w-xs mx-auto`}>
            Escanea el código con tu cámara para conectarte automáticamente sin escribir la contraseña.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="my-5 flex flex-col items-center">
          <div className="p-3.5 rounded-2xl bg-white border-2 border-amber-500/30 shadow-lg relative group">
            <img
              src={qrCodeUrl}
              alt="Código QR para conectar al WiFi"
              className="w-48 h-48 sm:w-52 sm:h-52 rounded-lg object-contain"
            />
            <div className="absolute inset-x-0 bottom-1 flex justify-center pointer-events-none">
              <span className="text-[9px] font-mono bg-black/80 text-white px-2 py-0.5 rounded-full backdrop-blur-xs font-bold">
                Auto-Connect iOS / Android
              </span>
            </div>
          </div>
        </div>

        {/* Credentials & Copy Button */}
        <div className="space-y-2.5 p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 font-semibold">Red WiFi:</span>
            <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
              {ssid}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5">
            <span className="text-neutral-500 font-semibold">Contraseña:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                {password}
              </span>
              <button
                onClick={handleCopyPassword}
                className="p-1 rounded-md hover:bg-black/10 text-neutral-500 transition-colors"
                title="Copiar contraseña"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Button: Direct Copy Password / Mobile instructions */}
        <div className="mt-4 space-y-2">
          <button
            onClick={handleCopyPassword}
            className={`w-full py-3 px-4 text-xs font-bold text-white flex items-center justify-center gap-2 ${
              copied ? 'bg-emerald-600' : theme.styles.accent
            } ${theme.styles.buttonStyle} shadow-md transition-all`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Contraseña Copiada al Portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Contraseña (1 Clic)</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>En iPhone/Android: Abre la cámara normal y toca la notificación.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
