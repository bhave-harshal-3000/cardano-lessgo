import { motion } from 'framer-motion';
import React from 'react';

interface ScanningLightProps {
  children: React.ReactNode;
}

export const ScanningLight: React.FC<ScanningLightProps> = ({ children }) => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {children}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
