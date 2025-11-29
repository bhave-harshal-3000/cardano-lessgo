import { motion } from 'framer-motion';
import React, { useMemo } from 'react';

interface CurrencySymbol {
  id: number;
  symbol: string;
  x: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
  rotation: number;
}

export const FallingCurrency: React.FC = () => {
  const symbols = useMemo(() => {
    const currencySymbols = ['₹', '$', '₳', '€', '£', '¥'];
    const count = 20;

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      symbol: currencySymbols[Math.floor(Math.random() * currencySymbols.length)],
      x: Math.random() * 100,
      duration: Math.random() * 20 + 15, // 15-35 seconds
      delay: Math.random() * 10,
      size: Math.random() * 30 + 20, // 20-50px
      opacity: Math.random() * 0.15 + 0.05, // 0.05-0.2
      rotation: Math.random() * 360,
    })) as CurrencySymbol[];
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {symbols.map((item) => (
        <motion.div
          key={item.id}
          initial={{
            x: `${item.x}vw`,
            y: '-10%',
            rotate: item.rotation,
            opacity: 0,
          }}
          animate={{
            y: '110%',
            rotate: item.rotation + 360,
            opacity: [0, item.opacity, item.opacity, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.1, 0.9, 1],
          }}
          style={{
            position: 'absolute',
            fontSize: `${item.size}px`,
            fontWeight: 'bold',
            fontFamily: "'Courier New', Courier, monospace",
            color: '#000',
          }}
        >
          {item.symbol}
        </motion.div>
      ))}
    </div>
  );
};
