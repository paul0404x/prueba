export const playSound = (soundFile: string, volume: number = 0.3) => {
  try {
    const audio = new Audio(soundFile);
    audio.volume = volume;
    audio
      .play()
      .catch((error) => console.error("Error al reproducir sonido:", error));
  } catch (error) {
    console.error("Error al crear audio:", error);
  }
};

export const playClickSound = () => {
  const clickSounds = ['/assets/sounds/click1.mp3', '/assets/sounds/click2.mp3'];
  const randomSound = clickSounds[Math.floor(Math.random() * clickSounds.length)];
  playSound(randomSound, 0.4);
};

export const playSuccessSound = () => {
  playSound("/assets/sounds/game1.mp3", 0.5);
};

export const playErrorSound = () => {
  playSound("/assets/sounds/game2.mp3", 0.4);
};

export const playNotificationSound = () => {
  playSound("/assets/sounds/game3.mp3", 0.3);
};