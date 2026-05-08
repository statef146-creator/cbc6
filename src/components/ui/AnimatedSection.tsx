import { motion, useAnimation, Variants } from 'framer-motion'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

interface AnimatedSectionProps {
  children: React.ReactNode
  variants?: Variants
  className?: string
  delay?: number
  once?: boolean
}

export default function AnimatedSection({ 
  children, 
  variants, 
  className = '', 
  delay = 0,
  once = true 
}: AnimatedSectionProps) {
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: once, threshold: 0.1 })

  useEffect(() => {
    if (inView) controls.start('visible')
  }, [controls, inView])

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, delay, ease: 'easeOut' } 
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants || defaultVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}