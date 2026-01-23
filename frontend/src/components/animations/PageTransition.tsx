import React from 'react'
import { motion } from 'framer-motion'

interface PageTransitionProps {
  children: React.ReactNode
  delay?: number
}

/**
 * PageTransition Component
 * Wraps page content with smooth fade and slide-up animation
 * 
 * Based on COMPONENT_ENHANCEMENTS.md - Animation patterns
 * Duration: 300ms (normal transition)
 * Easing: ease-out (decelerating)
 * 
 * @example
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children, delay = 0 }) => {
  // Respect user's motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: prefersReducedMotion ? 0.01 : 0.3,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  )
}
