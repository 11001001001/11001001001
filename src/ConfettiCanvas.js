import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

function ConfettiCanvas({ trigger }) {
  useEffect(() => {
    if (trigger) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
      });
    }
  }, [trigger]);

  return <canvas id="confettiCanvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

export default ConfettiCanvas;
