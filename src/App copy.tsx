import React, { useState, useEffect, useRef } from "react";
import { useGameState } from "./hooks/useGameState";
import MainMenu from "./components/MainMenu";
import GameScene from "./components/GameScene";
import StatsPanel from "./components/StatsPanel";
import CreditsScreen from "./components/CreditsScreen";
import EndScreen from "./components/EndScreen";
import dilemasData from "./data/dilemas.json";
import { playClickSound, playSuccessSound } from "./utils/audio";
import { Volume2, VolumeX } from "lucide-react";
import type { Dilema } from "./types/game";

// Le decimos a TypeScript que el archivo importado es una lista de Dilemas
const dilemas: Dilema[] = dilemasData as Dilema[];

// Lista de tus canciones
const songList: string[] = [
  "/assets/sounds/game1.mp3",
  "/assets/sounds/game2.mp3",
  "/assets/sounds/game3.mp3",
  "/assets/sounds/game4.mp3",
  "/assets/sounds/game5.mp3",
  "/assets/sounds/game6.mp3",
  "/assets/sounds/game7.mp3",
  "/assets/sounds/game8.mp3",
  "/assets/sounds/game9.mp3",
  "/assets/sounds/game10.mp3",
  "/assets/sounds/game11.mp3",
  "/assets/sounds/game12.mp3",
  "/assets/sounds/game13.mp3",
];

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // useEffect para la música de fondo
  useEffect(() => {
    if (gameState.gamePhase === "menu" || !songList.length) {
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const randomIndex = Math.floor(Math.random() * songList.length);
    const newSongSrc = songList[randomIndex];
    const newAudio = new Audio(newSongSrc);
    newAudio.volume = 0.2;
    newAudio.muted = gameState.isMuted;
    newAudio
      .play()
      .catch((error) => console.error("Error al reproducir audio:", error));
    audioRef.current = newAudio;

    return () => {
      newAudio.pause();
    };
  }, [gameState.currentDilema, gameState.gamePhase]);

  // Sincronizar el estado de silencio con la música
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = gameState.isMuted;
    }
  }, [gameState.isMuted]);

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
      }
    }
    selectOption(option);
  };

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
      <GameScene
        dilema={currentDilema}
        language={gameState.language}
        showResponse={gameState.showResponse}
        selectedOption={gameState.selectedOption}
        onSelectOption={handleSelectOption}
        onContinue={handleContinue}
        phase={getPhase()}
      />

      <div className="fixed top-4 right-4 z-50">
        <StatsPanel stats={gameState.stats} language={gameState.language} />
      </div>

      <button
        onClick={toggleMute}
        className="fixed bottom-4 left-4 z-50 bg-slate-800/90 hover:bg-slate-700/90 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-slate-600"
        aria-label="Toggle Sound"
      >
        {gameState.isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      <button
        onClick={handleToggleLanguage}
        className="fixed bottom-4 right-4 z-50 bg-slate-800/90 hover:bg-slate-700/90 text-white px-3 py-2 rounded-lg text-sm transition-all duration-300 backdrop-blur-sm border border-slate-600"
      >
        {gameState.language === "es" ? "EN" : "ES"}
      </button>
    </div>
  );
}

export default App;
