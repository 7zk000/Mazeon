// ゲーム全体で使用する定数

// ゲーム状態
export const GAME_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  MENU: 'menu',
  LOBBY: 'lobby',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
  VICTORY: 'victory',
  ERROR: 'error',
};

// プレイヤー状態
export const PLAYER_STATES = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  READY: 'ready',
  PLAYING: 'playing',
  SPECTATING: 'spectating',
  AFK: 'afk',
};

// 方向
export const DIRECTIONS = {
  NORTH: 'north',
  SOUTH: 'south',
  EAST: 'east',
  WEST: 'west',
  NORTHEAST: 'northeast',
  NORTHWEST: 'northwest',
  SOUTHEAST: 'southeast',
  SOUTHWEST: 'southwest',
};

// アイテムタイプ
export const ITEM_TYPES = {
  KEY: 'key',
  EXIT: 'exit',
  POWER_UP: 'powerUp',
  TRAP: 'trap',
  COIN: 'coin',
  GEM: 'gem',
  HEALTH: 'health',
  SPEED: 'speed',
};

// タイルタイプ
export const TILE_TYPES = {
  WALL: 'wall',
  PATH: 'path',
  START: 'start',
  END: 'end',
  WATER: 'water',
  LAVA: 'lava',
  ICE: 'ice',
  TELEPORT: 'teleport',
};

// イベントタイプ
export const EVENT_TYPES = {
  // プレイヤー関連
  PLAYER_JOIN: 'playerJoin',
  PLAYER_LEAVE: 'playerLeave',
  PLAYER_MOVE: 'playerMove',
  PLAYER_COLLECT: 'playerCollect',
  PLAYER_DIE: 'playerDie',
  PLAYER_RESPAWN: 'playerRespawn',
  
  // ゲーム関連
  GAME_START: 'gameStart',
  GAME_END: 'gameEnd',
  GAME_PAUSE: 'gamePause',
  GAME_RESUME: 'gameResume',
  LEVEL_COMPLETE: 'levelComplete',
  GAME_WIN: 'gameWin',
  GAME_LOSE: 'gameLose',
  
  // アイテム関連
  ITEM_SPAWN: 'itemSpawn',
  ITEM_COLLECT: 'itemCollect',
  ITEM_DESPAWN: 'itemDespawn',
  
  // システム関連
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  DEBUG: 'debug',
};

// 難易度レベル
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard',
  EXPERT: 'expert',
};

// ゲームモード
export const GAME_MODES = {
  SINGLE_PLAYER: 'singlePlayer',
  MULTIPLAYER: 'multiplayer',
  COOPERATIVE: 'cooperative',
  COMPETITIVE: 'competitive',
  TIME_TRIAL: 'timeTrial',
  SURVIVAL: 'survival',
};

// アニメーションタイプ
export const ANIMATION_TYPES = {
  FADE_IN: 'fadeIn',
  FADE_OUT: 'fadeOut',
  SLIDE_IN: 'slideIn',
  SLIDE_OUT: 'slideOut',
  SCALE_IN: 'scaleIn',
  SCALE_OUT: 'scaleOut',
  ROTATE: 'rotate',
  BOUNCE: 'bounce',
  SHAKE: 'shake',
  PULSE: 'pulse',
};

// 音響タイプ
export const AUDIO_TYPES = {
  SFX: 'sfx',
  MUSIC: 'music',
  AMBIENT: 'ambient',
  VOICE: 'voice',
};

// UI要素タイプ
export const UI_ELEMENT_TYPES = {
  BUTTON: 'button',
  LABEL: 'label',
  INPUT: 'input',
  SLIDER: 'slider',
  TOGGLE: 'toggle',
  DROPDOWN: 'dropdown',
  MODAL: 'modal',
  TOOLTIP: 'tooltip',
  PROGRESS_BAR: 'progressBar',
  SCORE_DISPLAY: 'scoreDisplay',
  TIMER: 'timer',
};

// ネットワーク関連
export const NETWORK_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  ERROR: 'error',
  TIMEOUT: 'timeout',
};

// エラーコード
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  GAME_FULL: 'GAME_FULL',
  INVALID_MOVE: 'INVALID_MOVE',
  PLAYER_NOT_FOUND: 'PLAYER_NOT_FOUND',
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  TIMEOUT: 'TIMEOUT',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

// ゲーム設定のデフォルト値
export const DEFAULT_GAME_SETTINGS = {
  audioEnabled: true,
  musicVolume: 0.7,
  sfxVolume: 0.8,
  vibrationEnabled: true,
  language: 'ja',
  difficulty: DIFFICULTY_LEVELS.NORMAL,
  autoSave: true,
  showFPS: false,
  showDebugInfo: false,
};

// プレイヤー設定のデフォルト値
export const DEFAULT_PLAYER_SETTINGS = {
  name: 'Player',
  color: '#3498db',
  avatar: null,
  controls: {
    sensitivity: 1.0,
    invertY: false,
    showControls: true,
  },
};

// 迷路生成設定
export const MAZE_GENERATION_SETTINGS = {
  algorithm: 'recursiveBacktracking', // 'recursiveBacktracking', 'kruskal', 'prim'
  wallThickness: 2,
  cellSize: 50,
  complexity: 0.5, // 0.0 - 1.0
  density: 0.3, // 0.0 - 1.0
};

// 物理設定
export const PHYSICS_SETTINGS = {
  gravity: 9.8,
  friction: 0.8,
  bounce: 0.5,
  maxVelocity: 10,
  collisionDetection: true,
};

// レンダリング設定
export const RENDER_SETTINGS = {
  targetFPS: 60,
  vsync: true,
  antialiasing: true,
  shadows: false,
  particles: true,
  bloom: false,
};

// パフォーマンス設定
export const PERFORMANCE_SETTINGS = {
  maxParticles: 100,
  maxLights: 4,
  textureQuality: 'medium', // 'low', 'medium', 'high'
  modelQuality: 'medium', // 'low', 'medium', 'high'
  shadowQuality: 'low', // 'low', 'medium', 'high'
};

// ローカライゼーション
export const SUPPORTED_LANGUAGES = {
  JA: 'ja',
  EN: 'en',
  ZH: 'zh',
  KO: 'ko',
};

// ゲーム統計
export const GAME_STATS = {
  gamesPlayed: 0,
  gamesWon: 0,
  totalPlayTime: 0,
  bestTime: null,
  averageTime: 0,
  keysCollected: 0,
  levelsCompleted: 0,
  achievements: [],
};

// アチーブメント
export const ACHIEVEMENTS = {
  FIRST_WIN: {
    id: 'first_win',
    name: '初勝利',
    description: '初めてゲームに勝利しました',
    icon: '🏆',
  },
  SPEED_RUNNER: {
    id: 'speed_runner',
    name: 'スピードランナー',
    description: '5分以内にゲームをクリアしました',
    icon: '⚡',
  },
  KEY_COLLECTOR: {
    id: 'key_collector',
    name: '鍵コレクター',
    description: '100個の鍵を収集しました',
    icon: '🔑',
  },
  MASTER_EXPLORER: {
    id: 'master_explorer',
    name: 'マスターエクスプローラー',
    description: 'すべてのレベルをクリアしました',
    icon: '🗺️',
  },
};

// ゲームバランス設定
export const GAME_BALANCE = {
  playerSpeed: 1.0,
  keySpawnRate: 0.1,
  trapSpawnRate: 0.05,
  powerUpSpawnRate: 0.03,
  timeBonus: 1000, // ミリ秒
  scoreMultiplier: 1.0,
};

// デバッグ設定
export const DEBUG_SETTINGS = {
  enabled: __DEV__,
  logLevel: 'info', // 'error', 'warn', 'info', 'debug'
  showFPS: true,
  showGrid: false,
  showCollisionBoxes: false,
  showPathfinding: false,
  infiniteLives: false,
  godMode: false,
};
