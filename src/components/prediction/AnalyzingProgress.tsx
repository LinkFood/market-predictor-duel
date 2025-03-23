
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Swords, TrendingUp } from 'lucide-react';

interface AnalyzingProgressProps {
  onComplete: () => void;
}

const AnalyzingProgress: React.FC<AnalyzingProgressProps> = ({ onComplete }) => {
  useEffect(() => {
    // Trigger the onComplete callback after animation completes
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-32 h-32 mb-6">
        {/* Background circle */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-indigo-100"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Spinner */}
        <motion.div 
          className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center icon */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Swords className="h-16 w-16 text-indigo-600" />
        </motion.div>
        
        {/* Orbiting icons */}
        <motion.div 
          className="absolute"
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0], 
            x: [0, 60, 0, -60, 0], 
            y: [0, 30, 60, 30, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
          style={{ top: '50%', left: '50%', marginLeft: -12, marginTop: -12 }}
        >
          <TrendingUp className="h-6 w-6 text-green-500" />
        </motion.div>
        
        <motion.div 
          className="absolute"
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0], 
            x: [0, -60, 0, 60, 0], 
            y: [0, 30, 60, 30, 0] 
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "loop", delay: 0.5 }}
          style={{ top: '50%', left: '50%', marginLeft: -12, marginTop: -12 }}
        >
          <Brain className="h-6 w-6 text-purple-500" />
        </motion.div>
        
        <motion.div 
          className="absolute"
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0], 
            x: [0, 30, 60, 30, 0], 
            y: [0, -60, 0, 60, 0] 
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "loop", delay: 1 }}
          style={{ top: '50%', left: '50%', marginLeft: -12, marginTop: -12 }}
        >
          <Sparkles className="h-6 w-6 text-amber-500" />
        </motion.div>
      </div>
      
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-2">Creating Your Bracket</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <motion.li 
            className="flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="h-5 w-5 mr-2 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
            <span>Setting up bracket structure</span>
          </motion.li>
          <motion.li 
            className="flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
          >
            <div className="h-5 w-5 mr-2 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
            <span>Matching your stocks against AI picks</span>
          </motion.li>
          <motion.li 
            className="flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
          >
            <div className="h-5 w-5 mr-2 rounded-full bg-indigo-100 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></div>
            </div>
            <span>Preparing tournament visualization</span>
          </motion.li>
        </ul>
      </motion.div>
    </div>
  );
};

export default AnalyzingProgress;
