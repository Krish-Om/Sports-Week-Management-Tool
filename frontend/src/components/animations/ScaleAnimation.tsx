import React from 'react'
import { motion } from 'framer-motion'

interface ScaleAnimationProps {
  children: React.ReactNode
  delay?: number
}

/**
 * ScaleAnimation Component
 * Smooth scale animation for elements like badges, status indicators
 * 
 * Based on DESIGN_SYSTEM.md - Animation timing
 * Duration: 200ms (fast)
 * Easing: spring for natural feel
 * 
 * @example
 * <ScaleAnimation>
 *   <StatusBadge />
 * </ScaleAnimation>
 */
export const ScaleAnimation: React.FC<ScaleAnimationProps> = ({ children, delay = 0 }) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0.01 : 0.2,
        delay,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  )
}
