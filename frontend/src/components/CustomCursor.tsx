import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.style.cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    // Hide default cursor
    document.body.style.cursor = 'none';
    const style = document.createElement('style');
    style.innerHTML = '* { cursor: none !important; }';
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
      style.remove();
    };
  }, []);

  return (
    <>
      {/* Pen body */}
      <motion.div
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isHovering ? 1.1 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '4px',
          height: '30px',
          backgroundColor: '#000',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-2px, -30px) rotate(45deg)',
          borderRadius: '2px 2px 0 0',
          boxShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        }}
      />
      {/* Pen nib (metal part) */}
      <motion.div
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isHovering ? 1.1 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '4px',
          height: '6px',
          background: 'linear-gradient(to bottom, #666, #999)',
          pointerEvents: 'none',
          zIndex: 10000,
          transform: 'translate(-2px, -6px) rotate(45deg)',
          borderRadius: '0 0 2px 2px',
        }}
      />
      {/* Pen tip */}
      <motion.div
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isHovering ? 1.1 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '0',
          height: '0',
          borderLeft: '2px solid transparent',
          borderRight: '2px solid transparent',
          borderTop: '4px solid #333',
          pointerEvents: 'none',
          zIndex: 10001,
          transform: 'translate(-2px, -2px) rotate(45deg)',
        }}
      />
    </>
  );
};
