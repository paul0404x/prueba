import React, { useEffect } from "react";
import { Dilema, Option, Translation } from "../types/game";
import { translations } from "../data/translations";
import { ChevronRight, Zap, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedCharacter from "./AnimatedCharacter";
import AnimatedBackground from "./AnimatedBackground";
import { musicManager } from "../utils/musicManager";

interface GameSceneProps {
  dilema: Dilema;
  language: "es" | "en";
  showResponse: boolean;
  selectedOption: Option | null;
  onSelectOption: (option: Option) => void;
  onContinue: () => void;
  phase: string;
  isMuted: boolean;
}

const characterImages: Record<string, string> = {
  "paul.png": "/assets/characters/paul_nuevo.png",
  "carlos.png": "/assets/characters/carlos_nuevo.png",
  "javier.png": "/assets/characters/javier_nuevo.png",
  "laura.png": "/assets/characters/laura_nueva.png",
  "sr_torres.png": "/assets/characters/sr_torres_nuevo.png",
  "marco.png": "/assets/characters/marco_nuevo.png",
  "alex.png": "/assets/characters/alex.png",
  "dome.png": "/assets/characters/Dome.png",
  "roxana.png": "/assets/characters/jefa_roxana.png",
};

const GameScene: React.FC<GameSceneProps> = ({
  dilema,
  language,
  showResponse,
  selectedOption,
  onSelectOption,
  onContinue,
  phase,
  isMuted,
}) => {
  const getText = (text: Translation | string | undefined): string => {
    if (!text) return "";
    if (typeof text === "string") return text;
    return text[language] || text.es;
  };

  // Determinar tipo de dilema para música
  const getDilemmaType = () => {
    const situation = getText(dilema.situacion).toLowerCase();
    if (situation.includes('seguridad') || situation.includes('safety')) return 'safety';
    if (situation.includes('técnico') || situation.includes('technical')) return 'technical';
    if (situation.includes('gerente') || situation.includes('manager')) return 'management';
    if (situation.includes('negocio') || situation.includes('business')) return 'business';
    if (situation.includes('crisis') || situation.includes('emergency')) return 'crisis';
    return 'default';
  };

  // Cambiar música según el dilema
  useEffect(() => {
    if (!isMuted) {
      const dilemmaType = getDilemmaType();
      musicManager.playDilemmaMusic(dilemmaType as any);
    }
  }, [dilema.id, isMuted]);

  // Determinar emoción del personaje
  const getCharacterEmotion = () => {
    if (showResponse && selectedOption) {
      return selectedOption.es_correcta ? 'happy' : 'concerned';
    }
    const situation = getText(dilema.situacion).toLowerCase();
    if (situation.includes('crisis') || situation.includes('problema')) return 'concerned';
    if (situation.includes('éxito') || situation.includes('felicita')) return 'happy';
    if (situation.includes('serio') || situation.includes('importante')) return 'serious';
    return 'neutral';
  };

  return (
    <motion.div
      key={dilema.id}
      className="min-h-screen relative overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <AnimatedBackground 
        src={dilema.escena_imagen || "/assets/backgrounds/default.jpg"}
        parallax={true}
      />

      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen p-4">
        <AnimatePresence mode="wait">
          {dilema.personaje_imagen && (
            <motion.div
              className="mb-8"
              key={`character-${dilema.id}`}
              initial={{ y: -50, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <AnimatedCharacter
                src={characterImages[dilema.personaje_imagen] || "/assets/characters/paul_nuevo.png"}
                alt="Character"
                emotion={getCharacterEmotion()}
                isActive={true}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="w-full max-w-4xl text-center bg-black/80 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.h2 
            className="text-4xl font-bold text-white mb-4 drop-shadow-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {dilema.titulo}
          </motion.h2>

          <motion.p 
            className="text-white text-lg leading-relaxed mb-8 min-h-[6rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {getText(dilema.situacion)}
          </motion.p>

          <AnimatePresence mode="wait">
            {!showResponse ? (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {dilema.opciones.map((opcion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => onSelectOption(opcion)}
                    className="w-full text-left bg-slate-800/80 hover:bg-blue-600/80 text-white p-5 rounded-lg transition-all duration-300 border border-slate-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-bold mr-3 text-blue-400">
                      {String.fromCharCode(65 + index)}:
                    </span>
                    {getText(opcion.texto)}
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className={`p-6 rounded-lg border-l-4 min-h-[6rem] ${
                    selectedOption?.es_correcta 
                      ? 'bg-green-900/50 border-green-500' 
                      : 'bg-slate-800/80 border-blue-500'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-white">
                    {getText(selectedOption?.respuesta_narrativa)}
                  </p>
                  {selectedOption?.es_correcta && (
                    <motion.div
                      className="flex items-center mt-3 text-green-400"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      <span className="font-semibold">
                        {language === 'es' ? '¡Respuesta correcta!' : 'Correct answer!'}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.button
                  onClick={onContinue}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {translations.continue[language]} 
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ChevronRight size={20} />
                  </motion.div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GameScene;