import React from 'react';
import { motion } from 'framer-motion';

/**
 * Fade In animation variant
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

/**
 * Slide In from left animation variant
 */
export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 },
};

/**
 * Slide In from right animation variant
 */
export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 },
};

/**
 * Slide In from bottom animation variant
 */
export const slideInBottom = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3 },
};

/**
 * Scale In animation variant
 */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 },
};

/**
 * Stagger container for animating children sequentially
 */
export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Stagger item variant
 */
export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

/**
 * Pulse animation for loading states
 */
export const pulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
  },
};

/**
 * Animated Card Component
 */
interface AnimatedCardProps {
  children: React.ReactNode;
  variant?: 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'slideInBottom' | 'scaleIn';
  className?: string;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  variant = 'fadeIn',
  className = '',
}) => {
  const variants = {
    fadeIn,
    slideInLeft,
    slideInRight,
    slideInBottom,
    scaleIn,
  };

  return (
    <motion.div className={className} variants={variants[variant]} initial="initial" animate="animate">
      {children}
    </motion.div>
  );
};

/**
 * Animated List Component that staggers children
 */
interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

/**
 * Animated List Item
 */
interface AnimatedListItemProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({ children, className = '' }) => {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
};

/**
 * Page Transition Wrapper
 */
interface PageTransitionProps {
  children: React.ReactNode;
  variant?: 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'slideInBottom' | 'scaleIn';
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  variant = 'fadeIn',
}) => {
  const variants = {
    fadeIn,
    slideInLeft,
    slideInRight,
    slideInBottom,
    scaleIn,
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants[variant]}
    >
      {children}
    </motion.div>
  );
};

/**
 * Hover Scale Animation Wrapper
 */
interface HoverScaleProps {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

export const HoverScale: React.FC<HoverScaleProps> = ({ children, scale = 1.05, className = '' }) => {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Counter Animation Component
 */
interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from,
  to,
  duration = 1,
  className = '',
}) => {
  const nodeRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!nodeRef.current) return;

    let current = from;
    const range = to - from;
    const increment = range / (duration * 60);
    let frameId: number;

    const updateCounter = () => {
      current += increment;
      if ((increment > 0 && current >= to) || (increment < 0 && current <= to)) {
        current = to;
      }

      if (nodeRef.current) {
        nodeRef.current.textContent = Math.floor(current).toString();
      }

      if (current !== to) {
        frameId = requestAnimationFrame(updateCounter);
      }
    };

    frameId = requestAnimationFrame(updateCounter);

    return () => cancelAnimationFrame(frameId);
  }, [from, to, duration]);

  return <span ref={nodeRef} className={className}>{from}</span>;
};
