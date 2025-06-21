import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  src: string;
  overlay?: boolean;
  parallax?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  src, 
  overlay = true, 
  parallax = false 
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${src})` }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ 
          scale: parallax ? [1.1, 1.05, 1.1] : 1,
          opacity: 1 
        }}
        transition={{ 
          scale: { duration: 20, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1 }
        }}
      />
      
      {overlay && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      )}
      
      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;