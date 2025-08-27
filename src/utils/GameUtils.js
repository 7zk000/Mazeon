import { Dimensions, PixelRatio } from 'react-native';
import { GameConfig, Directions } from '../config/GameConfig';

// 画面サイズの取得
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * デバイスに応じたスケーリング
 * @param {number} size - 基準サイズ
 * @returns {number} スケールされたサイズ
 */
export const scaledSize = (size) => {
  const scale = Math.min(screenWidth / 375, screenHeight / 667);
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

/**
 * 時間をフォーマット（分:秒）
 * @param {number} milliseconds - ミリ秒
 * @returns {string} フォーマットされた時間
 */
export const formatTime = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * 残り時間を計算
 * @param {number} startTime - 開始時間
 * @param {number} timeLimit - 制限時間
 * @returns {number} 残り時間（ミリ秒）
 */
export const calculateRemainingTime = (startTime, timeLimit) => {
  const elapsed = Date.now() - startTime;
  return Math.max(0, timeLimit - elapsed);
};

/**
 * 2点間の距離を計算
 * @param {Object} point1 - 点1 {x, y}
 * @param {Object} point2 - 点2 {x, y}
 * @returns {number} 距離
 */
export const calculateDistance = (point1, point2) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * 方向に基づいて移動後の位置を計算
 * @param {Object} currentPosition - 現在位置 {x, y}
 * @param {string} direction - 方向
 * @returns {Object} 新しい位置 {x, y}
 */
export const calculateNewPosition = (currentPosition, direction) => {
  const { x, y } = currentPosition;
  
  switch (direction) {
    case Directions.NORTH:
      return { x, y: y - 1 };
    case Directions.SOUTH:
      return { x, y: y + 1 };
    case Directions.EAST:
      return { x: x + 1, y };
    case Directions.WEST:
      return { x: x - 1, y };
    default:
      return currentPosition;
  }
};

/**
 * 位置が迷路の範囲内かチェック
 * @param {Object} position - 位置 {x, y}
 * @param {Object} mazeSize - 迷路サイズ {width, height}
 * @returns {boolean} 範囲内かどうか
 */
export const isPositionValid = (position, mazeSize) => {
  return position.x >= 0 && 
         position.x < mazeSize.width && 
         position.y >= 0 && 
         position.y < mazeSize.height;
};

/**
 * ランダムな位置を生成
 * @param {Object} mazeSize - 迷路サイズ {width, height}
 * @returns {Object} ランダムな位置 {x, y}
 */
export const generateRandomPosition = (mazeSize) => {
  return {
    x: Math.floor(Math.random() * mazeSize.width),
    y: Math.floor(Math.random() * mazeSize.height),
  };
};

/**
 * ユニークなIDを生成
 * @returns {string} ユニークなID
 */
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 配列をシャッフル
 * @param {Array} array - シャッフルする配列
 * @returns {Array} シャッフルされた配列
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * デバウンス関数
 * @param {Function} func - 実行する関数
 * @param {number} delay - 遅延時間（ミリ秒）
 * @returns {Function} デバウンスされた関数
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * スロットル関数
 * @param {Function} func - 実行する関数
 * @param {number} limit - 制限時間（ミリ秒）
 * @returns {Function} スロットルされた関数
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 色の明度を調整
 * @param {string} color - 16進数カラーコード
 * @param {number} percent - 調整割合（-100 から 100）
 * @returns {string} 調整された色
 */
export const adjustColorBrightness = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

/**
 * ログ出力（デバッグ設定に基づく）
 * @param {string} level - ログレベル
 * @param {string} message - メッセージ
 * @param {*} data - 追加データ
 */
export const log = (level, message, data = null) => {
  if (!GameConfig.debug.enabled) return;
  
  const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };
  
  const currentLevel = logLevels[GameConfig.debug.logLevel] || 2;
  const messageLevel = logLevels[level] || 2;
  
  if (messageLevel <= currentLevel) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }
};

/**
 * パフォーマンス測定
 * @param {string} name - 測定名
 * @param {Function} func - 測定する関数
 * @returns {*} 関数の結果
 */
export const measurePerformance = (name, func) => {
  const start = performance.now();
  const result = func();
  const end = performance.now();
  
  log('debug', `Performance [${name}]: ${(end - start).toFixed(2)}ms`);
  return result;
};

/**
 * ローカルストレージにデータを保存
 * @param {string} key - キー
 * @param {*} value - 値
 */
export const saveToStorage = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    // AsyncStorageを使用する場合はここで実装
    // await AsyncStorage.setItem(key, jsonValue);
    log('debug', `Saved to storage: ${key}`);
  } catch (error) {
    log('error', `Failed to save to storage: ${key}`, error);
  }
};

/**
 * ローカルストレージからデータを取得
 * @param {string} key - キー
 * @param {*} defaultValue - デフォルト値
 * @returns {*} 保存された値またはデフォルト値
 */
export const loadFromStorage = async (key, defaultValue = null) => {
  try {
    // AsyncStorageを使用する場合はここで実装
    // const jsonValue = await AsyncStorage.getItem(key);
    // return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
    log('debug', `Loaded from storage: ${key}`);
    return defaultValue;
  } catch (error) {
    log('error', `Failed to load from storage: ${key}`, error);
    return defaultValue;
  }
};

/**
 * 数値を指定範囲に制限
 * @param {number} value - 値
 * @param {number} min - 最小値
 * @param {number} max - 最大値
 * @returns {number} 制限された値
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * 線形補間
 * @param {number} start - 開始値
 * @param {number} end - 終了値
 * @param {number} factor - 補間係数（0-1）
 * @returns {number} 補間された値
 */
export const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};

/**
 * 角度をラジアンに変換
 * @param {number} degrees - 角度
 * @returns {number} ラジアン
 */
export const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * ラジアンを角度に変換
 * @param {number} radians - ラジアン
 * @returns {number} 角度
 */
export const radiansToDegrees = (radians) => {
  return radians * (180 / Math.PI);
};
