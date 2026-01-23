import React from 'react'
import { motion } from 'framer-motion'

interface StaggerContainerProps {
  children: React.ReactNode
  staggerDelay?: number
  delayChildren?: number
}

/**
 * StaggerContainer Component
 * Creates a staggered animation effect for multiple children
 * 
 * Based on DESIGN_SYSTEM.md - Animation timing
 * Uses children-delay for coordinated animations
 * 
 * @example
 * <StaggerContainer staggerDelay={0.1}>
 *   <Item />
 *   <Item />
 *   <Item />
 * </StaggerContainer>
 */
export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.1,
  delayChildren = 0,
}) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: prefersReducedMotion ? 0 : delayChildren,
            staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
