import AsyncStorage from '@react-native-async-storage/async-storage';
import { log } from '../utils/GameUtils';

class StorageService {
  constructor() {
    this.prefix = 'mazeon_';
  }

  /**
   * 完全なキーを生成
   * @param {string} key - キー
   * @returns {string} 完全なキー
   */
  getFullKey = (key) => {
    return `${this.prefix}${key}`;
  };

  /**
   * データを保存
   * @param {string} key - キー
   * @param {*} value - 値
   * @returns {Promise<boolean>} 成功したかどうか
   */
  save = async (key, value) => {
    try {
      const fullKey = this.getFullKey(key);
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(fullKey, jsonValue);
      log('debug', `Saved to storage: ${key}`);
      return true;
    } catch (error) {
      log('error', `Failed to save to storage: ${key}`, error);
      return false;
    }
  };

  /**
   * データを取得
   * @param {string} key - キー
   * @param {*} defaultValue - デフォルト値
   * @returns {Promise<*>} 保存された値またはデフォルト値
   */
  load = async (key, defaultValue = null) => {
    try {
      const fullKey = this.getFullKey(key);
      const jsonValue = await AsyncStorage.getItem(fullKey);
      
      if (jsonValue !== null) {
        const value = JSON.parse(jsonValue);
        log('debug', `Loaded from storage: ${key}`);
        return value;
      }
      
      return defaultValue;
    } catch (error) {
      log('error', `Failed to load from storage: ${key}`, error);
      return defaultValue;
    }
  };

  /**
   * データを削除
   * @param {string} key - キー
   * @returns {Promise<boolean>} 成功したかどうか
   */
  remove = async (key) => {
    try {
      const fullKey = this.getFullKey(key);
      await AsyncStorage.removeItem(fullKey);
      log('debug', `Removed from storage: ${key}`);
      return true;
    } catch (error) {
      log('error', `Failed to remove from storage: ${key}`, error);
      return false;
    }
  };

  /**
   * すべてのデータを削除
   * @returns {Promise<boolean>} 成功したかどうか
   */
  clear = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(appKeys);
      log('info', 'Cleared all app data from storage');
      return true;
    } catch (error) {
      log('error', 'Failed to clear storage', error);
      return false;
    }
  };

  /**
   * 複数のデータを一度に保存
   * @param {Object} data - 保存するデータ {key: value}
   * @returns {Promise<boolean>} 成功したかどうか
   */
  saveMultiple = async (data) => {
    try {
      const keyValuePairs = Object.entries(data).map(([key, value]) => [
        this.getFullKey(key),
        JSON.stringify(value)
      ]);
      
      await AsyncStorage.multiSet(keyValuePairs);
      log('debug', `Saved multiple items to storage: ${Object.keys(data).join(', ')}`);
      return true;
    } catch (error) {
      log('error', 'Failed to save multiple items to storage', error);
      return false;
    }
  };

  /**
   * 複数のデータを一度に取得
   * @param {Array<string>} keys - キーの配列
   * @returns {Promise<Object>} 取得したデータ {key: value}
   */
  loadMultiple = async (keys) => {
    try {
      const fullKeys = keys.map(key => this.getFullKey(key));
      const keyValuePairs = await AsyncStorage.multiGet(fullKeys);
      
      const result = {};
      keyValuePairs.forEach(([fullKey, jsonValue]) => {
        if (jsonValue !== null) {
          const key = fullKey.replace(this.prefix, '');
          result[key] = JSON.parse(jsonValue);
        }
      });
      
      log('debug', `Loaded multiple items from storage: ${Object.keys(result).join(', ')}`);
      return result;
    } catch (error) {
      log('error', 'Failed to load multiple items from storage', error);
      return {};
    }
  };

  /**
   * ゲーム設定を保存
   * @param {Object} settings - ゲーム設定
   * @returns {Promise<boolean>} 成功したかどうか
   */
  saveGameSettings = async (settings) => {
    return await this.save('gameSettings', settings);
  };

  /**
   * ゲーム設定を取得
   * @returns {Promise<Object>} ゲーム設定
   */
  loadGameSettings = async () => {
    return await this.load('gameSettings', {
      audioEnabled: true,
      volume: { master: 0.8, sfx: 0.6, music: 0.4 },
      language: 'ja',
      difficulty: 'normal',
    });
  };

  /**
   * プレイヤー統計を保存
   * @param {Object} stats - プレイヤー統計
   * @returns {Promise<boolean>} 成功したかどうか
   */
  savePlayerStats = async (stats) => {
    return await this.save('playerStats', stats);
  };

  /**
   * プレイヤー統計を取得
   * @returns {Promise<Object>} プレイヤー統計
   */
  loadPlayerStats = async () => {
    return await this.load('playerStats', {
      gamesPlayed: 0,
      gamesWon: 0,
      totalPlayTime: 0,
      bestTime: null,
      averageTime: 0,
      keysCollected: 0,
      levelsCompleted: 0,
    });
  };

  /**
   * ハイスコアを保存
   * @param {Array} highScores - ハイスコア配列
   * @returns {Promise<boolean>} 成功したかどうか
   */
  saveHighScores = async (highScores) => {
    return await this.save('highScores', highScores);
  };

  /**
   * ハイスコアを取得
   * @returns {Promise<Array>} ハイスコア配列
   */
  loadHighScores = async () => {
    return await this.load('highScores', []);
  };

  /**
   * 新しいハイスコアを追加
   * @param {Object} score - スコアオブジェクト
   * @returns {Promise<boolean>} 成功したかどうか
   */
  addHighScore = async (score) => {
    try {
      const highScores = await this.loadHighScores();
      highScores.push({
        ...score,
        date: new Date().toISOString(),
        id: Date.now().toString(),
      });
      
      // 時間でソート（短い時間が上位）
      highScores.sort((a, b) => a.time - b.time);
      
      // 上位10件のみ保持
      const topScores = highScores.slice(0, 10);
      
      return await this.saveHighScores(topScores);
    } catch (error) {
      log('error', 'Failed to add high score', error);
      return false;
    }
  };

  /**
   * ゲーム進行状況を保存
   * @param {Object} progress - 進行状況
   * @returns {Promise<boolean>} 成功したかどうか
   */
  saveGameProgress = async (progress) => {
    return await this.save('gameProgress', progress);
  };

  /**
   * ゲーム進行状況を取得
   * @returns {Promise<Object>} 進行状況
   */
  loadGameProgress = async () => {
    return await this.load('gameProgress', {
      currentLevel: 1,
      unlockedLevels: [1],
      completedLevels: [],
      currentMaze: null,
      playerPosition: { x: 0, y: 0, level: 0 },
      collectedItems: [],
    });
  };

  /**
   * ストレージの使用量を取得
   * @returns {Promise<Object>} 使用量情報
   */
  getStorageInfo = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.prefix));
      
      let totalSize = 0;
      for (const key of appKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
      
      return {
        totalKeys: appKeys.length,
        totalSize: totalSize,
        totalSizeKB: (totalSize / 1024).toFixed(2),
      };
    } catch (error) {
      log('error', 'Failed to get storage info', error);
      return { totalKeys: 0, totalSize: 0, totalSizeKB: '0.00' };
    }
  };
}

// シングルトンインスタンス
const storageService = new StorageService();

export default storageService;
