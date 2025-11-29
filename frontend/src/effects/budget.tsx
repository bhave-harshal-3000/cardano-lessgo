import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface TrueFocusProps {
  sentence?: string;
  separator?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence = 'TUse Money Wisely',
  separator = ' ',
  manualMode = false,
  blurAmount = 5,
  borderColor = 'green',
  glowColor = 'rgba(0, 255, 0, 0.6)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1
}) => {
  const words = sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState<FocusRect>({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(
        () => {
          setCurrentIndex(prev => (prev + 1) % words.length);
        },
        (animationDuration + pauseBetweenAnimations) * 1000
      );

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex!);
    }
  };

  return (
    <div
      className="relative flex justify-center items-center flex-wrap"
      ref={containerRef}
      style={{ outline: 'none', userSelect: 'none', gap: '40px' }}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={el => {
              wordRefs.current[index] = el;
            }}
            className="relative font-black cursor-pointer"
            style={
              {
                fontSize: '70px',
                letterSpacing: 'normal',
                filter: manualMode
                  ? isActive
                    ? `blur(0px)`
                    : `blur(${blurAmount}px)`
                  : isActive
                    ? `blur(0px)`
                    : `blur(${blurAmount}px)`,
                transition: `filter ${animationDuration}s ease`,
                outline: 'none',
                userSelect: 'none'
              } as React.CSSProperties
            }
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="absolute top-0 left-0 pointer-events-none box-border border-0"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0
        }}
        transition={{
          duration: animationDuration
        }}
        style={
          {
            '--border-color': borderColor,
            '--glow-color': glowColor
          } as React.CSSProperties
        }
      >
        <span
          style={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            borderWidth: '5px',
            borderStyle: 'solid',
            borderRadius: '8px',
            top: '-20px',
            left: '-20px',
            borderRight: '0',
            borderBottom: '0',
            borderColor: borderColor,
            filter: `drop-shadow(0 0 10px ${borderColor})`
          }}
        ></span>
        <span
          style={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            borderWidth: '5px',
            borderStyle: 'solid',
            borderRadius: '8px',
            top: '-20px',
            right: '-20px',
            borderLeft: '0',
            borderBottom: '0',
            borderColor: borderColor,
            filter: `drop-shadow(0 0 10px ${borderColor})`
          }}
        ></span>
        <span
          style={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            borderWidth: '5px',
            borderStyle: 'solid',
            borderRadius: '8px',
            bottom: '-20px',
            left: '-20px',
            borderRight: '0',
            borderTop: '0',
            borderColor: borderColor,
            filter: `drop-shadow(0 0 10px ${borderColor})`
          }}
        ></span>
        <span
          style={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            borderWidth: '5px',
            borderStyle: 'solid',
            borderRadius: '8px',
            bottom: '-20px',
            right: '-20px',
            borderLeft: '0',
            borderTop: '0',
            borderColor: borderColor,
            filter: `drop-shadow(0 0 10px ${borderColor})`
          }}
        ></span>
      </motion.div>
    </div>
  );
};

export default TrueFocus;
