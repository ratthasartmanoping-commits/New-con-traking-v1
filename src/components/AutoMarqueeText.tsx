import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface AutoMarqueeTextProps {
  text: string;
  className?: string;
}

export const AutoMarqueeText: React.FC<AutoMarqueeTextProps> = ({
  text,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflowDist, setOverflowDist] = useState<number>(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const diff = textRef.current.scrollWidth - containerRef.current.clientWidth;
        setOverflowDist(diff > 2 ? diff + 8 : 0);
      }
    };

    checkOverflow();
    const timer = setTimeout(checkOverflow, 120);
    const timer2 = setTimeout(checkOverflow, 360);
    window.addEventListener('resize', checkOverflow);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => checkOverflow());
      ro.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', checkOverflow);
    };
  }, [text]);

  const duration = Math.max(4, overflowDist * 0.04 + 2);

  return (
    <div ref={containerRef} className="w-full overflow-hidden whitespace-nowrap relative select-none">
      {overflowDist > 0 ? (
        <motion.div
          className="inline-block whitespace-nowrap will-change-transform"
          animate={{ x: [0, 0, -overflowDist, -overflowDist, 0] }}
          transition={{
            duration: duration * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.18, 0.5, 0.68, 1],
          }}
        >
          <span ref={textRef} className={`inline-block ${className}`}>
            {text}
          </span>
        </motion.div>
      ) : (
        <span ref={textRef} className={`inline-block ${className}`}>
          {text}
        </span>
      )}
    </div>
  );
};
