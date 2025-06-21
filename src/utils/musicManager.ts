export class MusicManager {
  private currentAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.3;

  // Música por fase del juego
  private phaseMusic = {
    menu: ['/assets/sounds/game1.mp3', '/assets/sounds/game2.mp3'],
    intern: ['/assets/sounds/game3.mp3', '/assets/sounds/game4.mp3'],
    junior: ['/assets/sounds/game5.mp3', '/assets/sounds/game6.mp3'],
    supervisor: ['/assets/sounds/game7.mp3', '/assets/sounds/game8.mp3'],
    manager: ['/assets/sounds/game9.mp3', '/assets/sounds/game10.mp3'],
    magnate: ['/assets/sounds/game11.mp3', '/assets/sounds/game12.mp3', '/assets/sounds/game13.mp3']
  };

  // Música por tipo de dilema
  private dilemmaMusic = {
    safety: '/assets/sounds/game3.mp3',
    technical: '/assets/sounds/game5.mp3',
    management: '/assets/sounds/game7.mp3',
    business: '/assets/sounds/game9.mp3',
    crisis: '/assets/sounds/game11.mp3',
    default: '/assets/sounds/game1.mp3'
  };

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.currentAudio) {
      this.currentAudio.muted = muted;
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }

  private stopCurrentMusic() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  private async playMusic(src: string) {
    try {
      this.stopCurrentMusic();
      
      const audio = new Audio(src);
      audio.volume = this.volume;
      audio.muted = this.isMuted;
      audio.loop = true;
      
      await audio.play();
      this.currentAudio = audio;
      
      // Fade in effect
      this.fadeIn(audio);
      
    } catch (error) {
      console.error('Error playing music:', error);
    }
  }

  private fadeIn(audio: HTMLAudioElement) {
    audio.volume = 0;
    const targetVolume = this.volume;
    const fadeStep = targetVolume / 20;
    
    const fadeInterval = setInterval(() => {
      if (audio.volume < targetVolume - fadeStep) {
        audio.volume += fadeStep;
      } else {
        audio.volume = targetVolume;
        clearInterval(fadeInterval);
      }
    }, 50);
  }

  playPhaseMusic(phase: keyof typeof this.phaseMusic) {
    const songs = this.phaseMusic[phase];
    if (songs && songs.length > 0) {
      const randomSong = songs[Math.floor(Math.random() * songs.length)];
      this.playMusic(randomSong);
    }
  }

  playDilemmaMusic(dilemmaType: keyof typeof this.dilemmaMusic = 'default') {
    const song = this.dilemmaMusic[dilemmaType] || this.dilemmaMusic.default;
    this.playMusic(song);
  }

  playMenuMusic() {
    this.playPhaseMusic('menu');
  }

  stop() {
    this.stopCurrentMusic();
  }
}

export const musicManager = new MusicManager();