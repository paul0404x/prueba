import React, { useEffect } from "react";
import { translations } from "../data/translations";
import { Settings, Play, BookOpen, Award, Zap, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { musicManager } from "../utils/musicManager";
import { playClickSound } from "../utils/audio";

interface MainMenuProps {
  language: "es" | "en";
  onStartGame: () => void;
  onContinueGame: () => void;
  onShowCredits: () => void;
  onToggleLanguage: () => void;
  onToggleMute: () => void;
  hasSavedGame: boolean;
  isMuted: boolean;
}

const MainMenu: React.FC<MainMenuProps> = ({
  language,
  onStartGame,
  onContinueGame,
  onShowCredits,
  onToggleLanguage,
  onToggleMute,
  hasSavedGame,
  isMuted,
}) => {
  useEffect(() => {
    musicManager.setMuted(isMuted);
    if (!isMuted) {
      musicManager.playMenuMusic();
    } else {
      musicManager.stop();
    }
  }, [isMuted]);

  const handleClick = (action: () => void) => {
    if (!isMuted) playClickSound();
    action();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
        animate={{
          background: [
            "linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a)",
            "linear-gradient(to bottom right, #1e3a8a, #0f172a, #1e3a8a)",
            "linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a)"
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url('/assets/backgrounds/iniciogame.png')` }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      {/* Enhanced Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 4 === 0 ? 'bg-orange-400' :
              i % 4 === 1 ? 'bg-blue-400' :
              i % 4 === 2 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div 
          className="max-w-lg w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Enhanced Logo section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.div 
              className="relative mb-8"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-500 via-red-600 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  boxShadow: [
                    "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    "0 25px 50px -12px rgba(249, 115, 22, 0.4)",
                    "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <BookOpen className="w-16 h-16 text-white drop-shadow-lg" />
              </motion.div>
              
              <motion.div 
                className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-br from-orange-500/30 to-red-600/30 rounded-full blur-xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.h1 
              className="text-5xl font-bold text-white mb-4 tracking-wider drop-shadow-2xl"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.5)",
                  "0 0 30px rgba(249,115,22,0.8)",
                  "0 0 20px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {translations.title[language]}
            </motion.h1>
            
            <motion.div 
              className="w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-4"
              animate={{ width: [128, 160, 128] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <p className="text-slate-300 text-xl font-medium">
              {translations.subtitle[language]}
            </p>
            <p className="text-slate-400 text-sm mt-2">
              {language === "es" ? "Por Paul Mora" : "By Paul Mora"}
            </p>
          </motion.div>

          {/* Enhanced Menu buttons */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              onClick={() => handleClick(onStartGame)}
              className="w-full bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 hover:from-orange-700 hover:via-red-700 hover:to-orange-700 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl border border-orange-400/30 group overflow-hidden relative"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-100, 400] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <Play className="w-6 h-6 group-hover:animate-pulse relative z-10" />
              <span className="text-xl relative z-10">{translations.startGame[language]}</span>
              <Zap className="w-5 h-5 group-hover:animate-bounce relative z-10" />
            </motion.button>

            {hasSavedGame && (
              <motion.button
                onClick={() => handleClick(onContinueGame)}
                className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-700 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl border border-blue-400/30 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <BookOpen className="w-6 h-6 group-hover:animate-pulse" />
                <span className="text-xl">{translations.continueGame[language]}</span>
              </motion.button>
            )}

            <motion.button
              onClick={() => handleClick(onShowCredits)}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl border border-purple-400/30 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <Award className="w-6 h-6 group-hover:animate-pulse" />
              <span className="text-xl">{translations.credits[language]}</span>
            </motion.button>

            {/* Control buttons row */}
            <div className="flex space-x-4">
              <motion.button
                onClick={() => handleClick(onToggleLanguage)}
                className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl border border-slate-500/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                <Settings className="w-5 h-5" />
                <span className="text-sm">
                  {language === "es" ? "ES" : "EN"}
                </span>
              </motion.button>

              <motion.button
                onClick={() => handleClick(onToggleMute)}
                className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl border border-slate-500/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                <span className="text-sm">
                  {language === "es" ? (isMuted ? "Silencio" : "Sonido") : (isMuted ? "Muted" : "Sound")}
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Enhanced Footer */}
          <motion.div 
            className="mt-12 text-center text-slate-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <p>
              © 2025 Paul Mora -{" "}
              {language === "es"
                ? "Todos los derechos reservados"
                : "All rights reserved"}
            </p>
            <p className="mt-2 text-xs opacity-75">
              {language === "es"
                ? "Una experiencia inmersiva sobre la industria petrolera"
                : "An immersive experience about the petroleum industry"}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MainMenu;