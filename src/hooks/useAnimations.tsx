
import { AnimationProps, Variants, Variant } from "framer-motion";

// Common animation variants
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.07
    }
  }
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }
  }
};

// Navigation animations
export const navItemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }
  },
  tap: { 
    scale: 0.95, 
    transition: { duration: 0.1 } 
  }
};

export const navIndicatorVariants: Variants = {
  hidden: { opacity: 0, width: 0 },
  visible: { 
    opacity: 1, 
    width: "2rem", 
    transition: { duration: 0.2 } 
  }
};

export const pageTransitionVariants: Variants = {
  initial: { 
    opacity: 0,
    x: -10 
  },
  enter: { 
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }
  },
  exit: { 
    opacity: 0,
    x: 10,
    transition: { duration: 0.2 }
  }
};

// Prediction form animations
export const predictionFormVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }
  }
};

// Custom hook for animations
const useAnimations = () => {
  return {
    containerVariants,
    itemVariants,
    navItemVariants,
    navIndicatorVariants,
    pageTransitionVariants,
    predictionFormVariants
  };
};

export default useAnimations;
