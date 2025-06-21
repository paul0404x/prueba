import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCharacterProps {
  src: string;
  alt: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'serious' | 'excited';
  isActive?: boolean;
}

const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({ 
  src, 
  alt, 
  emotion = 'neutral',
  isActive = true 
}) => {
  const getEmotionAnimation = () => {
    switch (emotion) {
      case 'happy':
        return {
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0],
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        };
      case 'concerned':
        return {
          x: [0, -2, 2, 0],
          transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        };
      case 'serious':
        return {
          scale: [1, 0.98, 1],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        };
      case 'excited':
        return {
          y: [0, -5, 0],
          scale: [1, 1.02, 1],
          transition: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        };
      default:
        return {
          y: [0, -3, 0],
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        };
    }
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isActive ? 1 : 0.7,
        y: 0,
        ...getEmotionAnimation()
      }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-40 h-40 object-cover rounded-full border-4 border-white/30 shadow-2xl"
        style={{
          filter: isActive ? 'brightness(1)' : 'brightness(0.8) grayscale(0.3)'
        }}
      />
      
      {/* Glow effect when active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};

export default AnimatedCharacter;