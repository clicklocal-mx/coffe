import confetti from 'canvas-confetti';

export const triggerOrderConfetti = () => {
  try {
    // Left burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: ['#C86D51', '#D4AF37', '#FF6B8B', '#06B6D4', '#2C4A52'],
    });
    // Right burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: ['#C86D51', '#D4AF37', '#FF6B8B', '#06B6D4', '#2C4A52'],
    });
  } catch {
    // Silently continue if canvas is unavailable
  }
};

export const triggerQuizMatchConfetti = () => {
  try {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C86D51', '#E3A857', '#FAF7F2'],
    });
  } catch {
    // Silently continue
  }
};
