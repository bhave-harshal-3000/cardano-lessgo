import { motion } from 'framer-motion';
import React, { useMemo } from 'react';

interface FloatingNumber {
  id: number;
  text: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
  size: number;
}

export const FloatingNumbers: React.FC = () => {
  const numbers = useMemo(() => {
    const values = [
      '₹12,450',
      '+25%',
      '$8,320',
      '₳500',
      '-₹240',
      '+18%',
      '€1,250',
      '+42%',
      '₹5,890',
      '$15,000',
    ];

    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      text: values[i % values.length],
      x: Math.random() * 90 + 5, // 5-95%
      y: Math.random() * 80 + 10, // 10-90%
      duration: Math.random() * 4 + 3, // 3-7 seconds
      delay: Math.random() * 5,
      size: Math.random() * 10 + 14, // 14-24px
    })) as FloatingNumber[];
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
        zIndex: 1,
      }}
    >
      {numbers.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.3, 0.3, 0],
            scale: [0.8, 1, 1, 0.8],
            y: [0, -20, -20, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.3, 0.7, 1],
          }}
          style={{
            position: 'absolute',
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
            fontWeight: 'bold',
            fontFamily: "'Courier New', Courier, monospace",
            color: item.text.includes('+') ? '#059669' : item.text.includes('-') ? '#dc2626' : '#000',
          }}
        >
          {item.text}
        </motion.div>
      ))}
    </div>
  );
};
