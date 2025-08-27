import Sound from 'react-native-sound';
import { GameConfig } from '../config/GameConfig';
import { log } from '../utils/GameUtils';

class AudioService {
  constructor() {
    this.sounds = new Map();
    this.music = null;
    this.isEnabled = GameConfig.audio.enabled;
    this.volumes = { ...GameConfig.audio.volume };
    
    // Soundの設定
    Sound.setCategory('Playback');
  }

  /**
   * 音声ファイルを読み込み
   * @param {string} key - 音声のキー
   * @param {string} filename - ファイル名
   * @param {string} type - 音声タイプ ('sfx' | 'music')
   */
  loadSound = (key, filename, type = 'sfx') => {
    return new Promise((resolve, reject) => {
      const sound = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          log('error', `Failed to load sound: ${filename}`, error);
          reject(error);
        } else {
          this.sounds.set(key, { sound, type });
          log('debug', `Loaded sound: ${key} (${filename})`);
          resolve(sound);
        }
      });
    });
  };

  /**
   * すべての音声ファイルを読み込み
   */
  loadAllSounds = async () => {
    const soundFiles = GameConfig.audio.sounds;
    const loadPromises = [];

    for (const [key, filename] of Object.entries(soundFiles)) {
      const type = key === 'background' ? 'music' : 'sfx';
      loadPromises.push(this.loadSound(key, filename, type));
    }

    try {
      await Promise.all(loadPromises);
      log('info', 'All sounds loaded successfully');
    } catch (error) {
      log('error', 'Failed to load some sounds', error);
    }
  };

  /**
   * 効果音を再生
   * @param {string} key - 音声のキー
   * @param {number} volume - 音量（0-1）
   */
  playSFX = (key, volume = null) => {
    if (!this.isEnabled) return;

    const soundData = this.sounds.get(key);
    if (!soundData || soundData.type !== 'sfx') {
      log('warn', `SFX not found: ${key}`);
      return;
    }

    const { sound } = soundData;
    const finalVolume = volume !== null ? volume : this.volumes.sfx;
    
    sound.setVolume(finalVolume);
    sound.play((success) => {
      if (!success) {
        log('error', `Failed to play SFX: ${key}`);
      }
    });
  };

  /**
   * 音楽を再生
   * @param {string} key - 音楽のキー
   * @param {boolean} loop - ループ再生するか
   * @param {number} volume - 音量（0-1）
   */
  playMusic = (key, loop = true, volume = null) => {
    if (!this.isEnabled) return;

    const soundData = this.sounds.get(key);
    if (!soundData || soundData.type !== 'music') {
      log('warn', `Music not found: ${key}`);
      return;
    }

    // 現在の音楽を停止
    this.stopMusic();

    const { sound } = soundData;
    const finalVolume = volume !== null ? volume : this.volumes.music;
    
    sound.setVolume(finalVolume);
    sound.setNumberOfLoops(loop ? -1 : 0);
    sound.play((success) => {
      if (!success) {
        log('error', `Failed to play music: ${key}`);
      }
    });

    this.music = sound;
  };

  /**
   * 音楽を停止
   */
  stopMusic = () => {
    if (this.music) {
      this.music.stop();
      this.music = null;
    }
  };

  /**
   * 音楽を一時停止
   */
  pauseMusic = () => {
    if (this.music) {
      this.music.pause();
    }
  };

  /**
   * 音楽を再開
   */
  resumeMusic = () => {
    if (this.music) {
      this.music.play();
    }
  };

  /**
   * 音量を設定
   * @param {string} type - 音量タイプ ('master' | 'sfx' | 'music')
   * @param {number} volume - 音量（0-1）
   */
  setVolume = (type, volume) => {
    this.volumes[type] = Math.max(0, Math.min(1, volume));
    
    // 現在再生中の音楽の音量を更新
    if (type === 'music' && this.music) {
      this.music.setVolume(this.volumes.music);
    }
  };

  /**
   * 音量を取得
   * @param {string} type - 音量タイプ
   * @returns {number} 音量
   */
  getVolume = (type) => {
    return this.volumes[type] || 0;
  };

  /**
   * 音響を有効/無効にする
   * @param {boolean} enabled - 有効にするか
   */
  setEnabled = (enabled) => {
    this.isEnabled = enabled;
    
    if (!enabled) {
      this.stopMusic();
    }
  };

  /**
   * 音響が有効かチェック
   * @returns {boolean} 有効かどうか
   */
  isAudioEnabled = () => {
    return this.isEnabled;
  };

  /**
   * すべての音声を停止
   */
  stopAll = () => {
    this.stopMusic();
    
    // 効果音は自動的に停止するため、特別な処理は不要
    log('debug', 'All sounds stopped');
  };

  /**
   * リソースを解放
   */
  release = () => {
    this.stopAll();
    
    for (const [key, soundData] of this.sounds) {
      soundData.sound.release();
      log('debug', `Released sound: ${key}`);
    }
    
    this.sounds.clear();
  };

  /**
   * ゲームイベントに基づいて音響を再生
   * @param {string} eventType - イベントタイプ
   */
  playEventSound = (eventType) => {
    const soundMap = {
      'playerMove': 'move',
      'itemCollect': 'collect',
      'gameWin': 'win',
      'gameLose': 'lose',
      'levelComplete': 'levelUp',
    };

    const soundKey = soundMap[eventType];
    if (soundKey) {
      this.playSFX(soundKey);
    }
  };
}

// シングルトンインスタンス
const audioService = new AudioService();

export default audioService;
