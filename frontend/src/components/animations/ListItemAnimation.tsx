import React from 'react'
import { motion } from 'framer-motion'

interface ListItemAnimationProps {
  children: React.ReactNode
  index?: number
  delay?: number
}

/**
 * ListItemAnimation Component
 * Smooth fade-in animation for list items with optional stagger
 * 
 * Based on COMPONENT_ENHANCEMENTS.md - List item animations
 * Duration: 200ms
 * Easing: ease-out
 * 
 * @example
 * <ul>
 *   {items.map((item, i) => (
 *     <ListItemAnimation key={item.id} index={i}>
 *       <li>{item.name}</li>
 *     </ListItemAnimation>
 *   ))}
 * </ul>
 */
export const ListItemAnimation: React.FC<ListItemAnimationProps> = ({
  children,
  index = 0,
  delay = 0,
}) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{
        duration: prefersReducedMotion ? 0.01 : 0.2,
        delay: prefersReducedMotion ? 0 : (index * 0.05 + delay),
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  )
}
