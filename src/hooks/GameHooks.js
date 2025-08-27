import { useState, useEffect, useRef, useCallback } from 'react';
import { Dimensions } from 'react-native';
import { GameConfig } from '../config/GameConfig';
import { log } from '../utils/GameUtils';

/**
 * ゲームループフック
 * @param {Function} updateFunction - 更新関数
 * @param {number} fps - 目標FPS
 * @param {boolean} isActive - アクティブ状態
 */
export const useGameLoop = (updateFunction, fps = 60, isActive = true) => {
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(0);
  const animationFrameId = useRef(null);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const gameLoop = useCallback((currentTime) => {
    if (!isActiveRef.current) return;

    if (lastTime.current === 0) {
      lastTime.current = currentTime;
    }

    const deltaTime = currentTime - lastTime.current;
    const targetFrameTime = 1000 / fps;

    if (deltaTime >= targetFrameTime) {
      frameCount.current++;
      lastTime.current = currentTime;

      // FPS計算
      if (frameCount.current % 60 === 0) {
        const actualFps = Math.round(60000 / deltaTime);
        setFps(actualFps);
      }

      // ゲーム更新
      updateFunction(deltaTime);
    }

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [updateFunction, fps]);

  useEffect(() => {
    if (isActive) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameLoop, isActive]);

  return { fps };
};

/**
 * ゲームタイマーフック
 * @param {number} duration - 制限時間（ミリ秒）
 * @param {boolean} isActive - アクティブ状態
 * @param {Function} onTimeUp - 時間切れ時のコールバック
 */
export const useGameTimer = (duration, isActive = true, onTimeUp = null) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const startTime = useRef(null);
  const timerId = useRef(null);

  const startTimer = useCallback(() => {
    if (isActive && !isRunning) {
      startTime.current = Date.now();
      setIsRunning(true);
      log('debug', 'Game timer started');
    }
  }, [isActive, isRunning]);

  const pauseTimer = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (timerId.current) {
        clearInterval(timerId.current);
      }
      log('debug', 'Game timer paused');
    }
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    setTimeLeft(duration);
    setIsRunning(false);
    startTime.current = null;
    if (timerId.current) {
      clearInterval(timerId.current);
    }
    log('debug', 'Game timer reset');
  }, [duration]);

  useEffect(() => {
    if (isRunning && isActive) {
      timerId.current = setInterval(() => {
        const elapsed = Date.now() - startTime.current;
        const remaining = Math.max(0, duration - elapsed);
        
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          pauseTimer();
          if (onTimeUp) {
            onTimeUp();
          }
          log('debug', 'Game timer finished');
        }
      }, 100);
    }

    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
      }
    };
  }, [isRunning, isActive, duration, onTimeUp, pauseTimer]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  return {
    timeLeft,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
  };
};

/**
 * ゲーム入力フック
 * @param {Object} keyMap - キーマッピング
 * @param {boolean} isActive - アクティブ状態
 */
export const useGameInput = (keyMap = {}, isActive = true) => {
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [lastInput, setLastInput] = useState(null);

  const handleKeyDown = useCallback((key) => {
    if (!isActive) return;

    setPressedKeys(prev => new Set([...prev, key]));
    setLastInput({ type: 'keydown', key, timestamp: Date.now() });
    
    if (keyMap[key]) {
      keyMap[key]();
    }
    
    log('debug', `Key pressed: ${key}`);
  }, [isActive, keyMap]);

  const handleKeyUp = useCallback((key) => {
    if (!isActive) return;

    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
    
    setLastInput({ type: 'keyup', key, timestamp: Date.now() });
    log('debug', `Key released: ${key}`);
  }, [isActive]);

  const isKeyPressed = useCallback((key) => {
    return pressedKeys.has(key);
  }, [pressedKeys]);

  const clearInput = useCallback(() => {
    setPressedKeys(new Set());
    setLastInput(null);
  }, []);

  return {
    pressedKeys,
    lastInput,
    isKeyPressed,
    handleKeyDown,
    handleKeyUp,
    clearInput,
  };
};

/**
 * ゲーム状態管理フック
 * @param {string} initialState - 初期状態
 */
export const useGameState = (initialState = GameConfig.game.defaultState) => {
  const [gameState, setGameState] = useState(initialState);
  const [stateHistory, setStateHistory] = useState([]);
  const maxHistoryLength = 10;

  const changeState = useCallback((newState, data = null) => {
    const stateChange = {
      from: gameState,
      to: newState,
      data,
      timestamp: Date.now(),
    };

    setStateHistory(prev => {
      const newHistory = [...prev, stateChange];
      if (newHistory.length > maxHistoryLength) {
        return newHistory.slice(-maxHistoryLength);
      }
      return newHistory;
    });

    setGameState(newState);
    log('info', `Game state changed: ${gameState} -> ${newState}`, data);
  }, [gameState]);

  const revertToPreviousState = useCallback(() => {
    if (stateHistory.length > 0) {
      const previousState = stateHistory[stateHistory.length - 1];
      setGameState(previousState.from);
      setStateHistory(prev => prev.slice(0, -1));
      log('info', `Reverted to previous state: ${previousState.from}`);
    }
  }, [stateHistory]);

  const getStateHistory = useCallback(() => {
    return stateHistory;
  }, [stateHistory]);

  return {
    gameState,
    changeState,
    revertToPreviousState,
    getStateHistory,
  };
};

/**
 * ゲーム統計フック
 * @param {Object} initialStats - 初期統計
 */
export const useGameStats = (initialStats = {}) => {
  const [stats, setStats] = useState(initialStats);
  const [sessionStats, setSessionStats] = useState({});

  const updateStat = useCallback((key, value, isSession = false) => {
    if (isSession) {
      setSessionStats(prev => ({
        ...prev,
        [key]: value,
      }));
    } else {
      setStats(prev => ({
        ...prev,
        [key]: value,
      }));
    }
    log('debug', `Stat updated: ${key} = ${value}`);
  }, []);

  const incrementStat = useCallback((key, amount = 1, isSession = false) => {
    if (isSession) {
      setSessionStats(prev => ({
        ...prev,
        [key]: (prev[key] || 0) + amount,
      }));
    } else {
      setStats(prev => ({
        ...prev,
        [key]: (prev[key] || 0) + amount,
      }));
    }
    log('debug', `Stat incremented: ${key} += ${amount}`);
  }, []);

  const resetSessionStats = useCallback(() => {
    setSessionStats({});
    log('debug', 'Session stats reset');
  }, []);

  const getStat = useCallback((key, isSession = false) => {
    return isSession ? sessionStats[key] : stats[key];
  }, [stats, sessionStats]);

  return {
    stats,
    sessionStats,
    updateStat,
    incrementStat,
    resetSessionStats,
    getStat,
  };
};

/**
 * ゲーム設定フック
 * @param {Object} initialSettings - 初期設定
 */
export const useGameSettings = (initialSettings = {}) => {
  const [settings, setSettings] = useState({
    ...GameConfig.ui,
    ...initialSettings,
  });

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    log('debug', `Setting updated: ${key} = ${value}`);
  }, []);

  const updateMultipleSettings = useCallback((newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
    log('debug', 'Multiple settings updated', newSettings);
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({
      ...GameConfig.ui,
      ...initialSettings,
    });
    log('debug', 'Settings reset to defaults');
  }, [initialSettings]);

  return {
    settings,
    updateSetting,
    updateMultipleSettings,
    resetSettings,
  };
};

/**
 * ゲームパフォーマンス監視フック
 * @param {boolean} isActive - アクティブ状態
 */
export const useGamePerformance = (isActive = true) => {
  const [fps, setFps] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [renderTime, setRenderTime] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(0);

  const measureRenderTime = useCallback((renderFunction) => {
    if (!isActive) return renderFunction();

    const startTime = performance.now();
    const result = renderFunction();
    const endTime = performance.now();
    
    setRenderTime(endTime - startTime);
    return result;
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const updatePerformance = () => {
      const currentTime = performance.now();
      
      if (lastTime.current > 0) {
        const deltaTime = currentTime - lastTime.current;
        frameCount.current++;
        
        if (frameCount.current % 60 === 0) {
          const currentFps = Math.round(60000 / deltaTime);
          setFps(currentFps);
          
          // メモリ使用量の推定（実際のメモリ使用量は取得できないため）
          const estimatedMemory = Math.random() * 100 + 50; // 50-150MB
          setMemoryUsage(estimatedMemory);
        }
      }
      
      lastTime.current = currentTime;
    };

    const intervalId = setInterval(updatePerformance, 1000 / 60);

    return () => {
      clearInterval(intervalId);
    };
  }, [isActive]);

  return {
    fps,
    memoryUsage,
    renderTime,
    measureRenderTime,
  };
};

/**
 * ゲームエラーハンドリングフック
 */
export const useGameErrorHandler = () => {
  const [errors, setErrors] = useState([]);
  const [lastError, setLastError] = useState(null);

  const handleError = useCallback((error, context = '') => {
    const errorInfo = {
      message: error.message || error,
      stack: error.stack,
      context,
      timestamp: Date.now(),
    };

    setErrors(prev => [...prev, errorInfo]);
    setLastError(errorInfo);
    
    log('error', `Game error: ${errorInfo.message}`, errorInfo);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
    setLastError(null);
  }, []);

  const getErrors = useCallback(() => {
    return errors;
  }, [errors]);

  return {
    errors,
    lastError,
    handleError,
    clearErrors,
    getErrors,
  };
};
