import React, { useEffect, useState } from 'react';

interface ConfettiAnimationProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function ConfettiAnimation({ trigger, onComplete }: ConfettiAnimationProps) {
  const [pieces, setPieces] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    if (trigger) {
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1000,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!trigger || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}