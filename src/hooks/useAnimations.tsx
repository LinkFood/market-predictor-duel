
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

// Custom hook for animations
const useAnimations = () => {
  return {
    containerVariants,
    itemVariants,
  };
};

export default useAnimations;
