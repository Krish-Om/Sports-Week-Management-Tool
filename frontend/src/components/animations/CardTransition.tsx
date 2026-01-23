import React from 'react'
import { motion } from 'framer-motion'

interface CardTransitionProps {
  children: React.ReactNode
  delay?: number
  index?: number
}

/**
 * CardTransition Component
 * Individual card animation with fade-in and slide-up
 * 
 * Based on COMPONENT_ENHANCEMENTS.md - List item animations
 * Duration: 200ms (fast interaction)
 * Can be used with index for stagger effect
 * 
 * @example
 * {cards.map((card, i) => (
 *   <CardTransition key={card.id} index={i}>
 *     <CardContent />
 *   </CardTransition>
 * ))}
 */
export const CardTransition: React.FC<CardTransitionProps> = ({ 
  children, 
  delay = 0,
  index = 0 
}) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0.01 : 0.2,
        delay: prefersReducedMotion ? 0 : (index * 0.05 + delay),
        ease: 'easeOut',
      }}
      whileHover={!prefersReducedMotion ? { y: -4 } : {}}
    >
      {children}
    </motion.div>
  )
}
