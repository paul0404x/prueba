import React, { useState, useEffect, useRef } from "react";
import { useGameState } from "./hooks/useGameState";
import MainMenu from "./components/MainMenu";
import GameScene from "./components/GameScene";
import StatsPanel from "./components/StatsPanel";
import CreditsScreen from "./components/CreditsScreen";
import EndScreen from "./components/EndScreen";
import dilemasData from "./data/dilemas.json";
import { playClickSound, playSuccessSound, playErrorSound } from "./utils/audio";
import { musicManager } from "./utils/musicManager";
import { Volume2, VolumeX } from "lucide-react";
import type { Dilema } from "./types/game";
import { motion, AnimatePresence } from "framer-motion";

const dilemas: Dilema[] = dilemasData as Dilema[];

function App() {
  const {
    gameState,
    startNewGame,
    continueGame,
    nextDilema,
    selectOption,
    setLanguage,
    getPhase,
    goToMainMenu,
    toggleMute,
  } = useGameState();
  
  const [showCredits, setShowCredits] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize music manager
  useEffect(() => {
    musicManager.setMuted(gameState.isMuted);
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Update music manager when mute state changes
  useEffect(() => {
    musicManager.setMuted(gameState.isMuted);
  }, [gameState.isMuted]);

  // Play phase-appropriate music
  useEffect(() => {
    if (gameState.gamePhase === "playing" && !gameState.isMuted) {
      const phase = getPhase();
      musicManager.playPhaseMusic(phase as any);
    } else if (gameState.gamePhase === "menu" && !gameState.isMuted) {
      musicManager.playMenuMusic();
    }
  }, [gameState.gamePhase, getPhase, gameState.isMuted]);

  const currentDilema = dilemas.find((d) => d.id === gameState.currentDilema);

  const handleContinue = () => {
    if (!gameState.isMuted) playClickSound();
    if (gameState.currentDilema >= dilemas.length - 1) return;
    nextDilema();
  };

  const handleToggleLanguage = () => {
    if (!gameState.isMuted) playClickSound();
    setLanguage(gameState.language === "es" ? "en" : "es");
  };

  const handleSelectOption = (option: any) => {
    if (!gameState.isMuted) {
      playClickSound();
      if (option.es_correcta) {
        playSuccessSound();
      } else {
        playErrorSound();
      }
    }
    selectOption(option);
  };

  const handleToggleMute = () => {
    toggleMute();
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full"></div>
            </div>
          </motion.div>
          <motion.h1
            className="text-4xl font-bold text-white mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            WELL OF POWER
          </motion.h1>
          <motion.p
            className="text-slate-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {gameState.language === "es" ? "Cargando..." : "Loading..."}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (showCredits) {
    return (
      <CreditsScreen
        language={gameState.language}
        onBack={() => setShowCredits(false)}
      />
    );
  }

  if (gameState.gamePhase === "menu") {
    return (
      <MainMenu
        language={gameState.language}
        hasSavedGame={localStorage.getItem("well-of-power-save") !== null}
        isMuted={gameState.isMuted}
        onStartGame={() => {
          if (!gameState.isMuted) playClickSound();
          startNewGame();
        }}
        onContinueGame={() => {
          if (!gameState.isMuted) playClickSound();
          continueGame();
        }}
        onShowCredits={() => {
          if (!gameState.isMuted) playClickSound();
          setShowCredits(true);
        }}
        onToggleLanguage={handleToggleLanguage}
        onToggleMute={handleToggleMute}
      />
    );
  }

  if (!currentDilema) {
    return (
      <EndScreen
        stats={gameState.stats}
        language={gameState.language}
        onRestart={startNewGame}
        onMainMenu={goToMainMenu}
      />
    );
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <GameScene
          key={currentDilema.id}
          dilema={currentDilema}
          language={gameState.language}
          showResponse={gameState.showResponse}
          selectedOption={gameState.selectedOption}
          onSelectOption={handleSelectOption}
          onContinue={handleContinue}
          phase={getPhase()}
          isMuted={gameState.isMuted}
        />
      </AnimatePresence>

      {/* Stats Panel */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <StatsPanel stats={gameState.stats} language={gameState.language} />
      </motion.div>

      {/* Control buttons */}
      <motion.div
        className="fixed bottom-4 left-4 z-50 flex space-x-3"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <motion.button
          onClick={handleToggleMute}
          className="bg-slate-800/90 hover:bg-slate-700/90 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-slate-600 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle Sound"
        >
          {gameState.isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </motion.button>

        <motion.button
          onClick={handleToggleLanguage}
          className="bg-slate-800/90 hover:bg-slate-700/90 text-white px-3 py-2 rounded-lg text-sm transition-all duration-300 backdrop-blur-sm border border-slate-600 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {gameState.language === "es" ? "EN" : "ES"}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default App;