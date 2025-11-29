import { motion } from 'framer-motion';
import React, { useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export const GlowingParticles: React.FC = () => {
  const particles = useMemo(() => {
    const particleCount = 30;
    const colors = [
      'rgba(0, 0, 0, 0.15)',
      'rgba(0, 0, 0, 0.1)',
      'rgba(0, 0, 0, 0.08)',
    ];

    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 30, // 30-90px
      duration: Math.random() * 30 + 25, // 25-55 seconds
      delay: Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    })) as Particle[];
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
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, 0],
            y: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, 0],
            scale: [1, 1.3, 0.8, 1],
            opacity: [0.3, 0.6, 0.4, 0.3],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
