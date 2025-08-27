// ゲーム全体の設定
export const GameConfig = {
  // ゲーム基本設定
  game: {
    name: 'Mazeon',
    version: '1.0.0',
    maxPlayers: 8,
    minPlayers: 1,
    timeLimit: 15 * 60 * 1000, // 15分（ミリ秒）
    defaultMazeSize: { width: 10, height: 10 },
    maxMazeSize: { width: 20, height: 20 },
    minMazeSize: { width: 5, height: 5 },
    maxLevels: 3,
    minLevels: 1,
  },

  // プレイヤー設定
  player: {
    defaultSpeed: 1,
    maxSpeed: 3,
    minSpeed: 0.5,
    defaultSize: 40,
    colors: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'],
  },

  // 迷路設定
  maze: {
    cellSize: 50,
    wallThickness: 2,
    backgroundColor: '#2c3e50',
    wallColor: '#ecf0f1',
    pathColor: '#34495e',
  },

  // アイテム設定
  items: {
    key: {
      symbol: '🔑',
      color: '#f39c12',
      size: 20,
      collectible: true,
    },
    exit: {
      symbol: '🚪',
      color: '#27ae60',
      size: 30,
      collectible: false,
    },
    powerUp: {
      symbol: '⚡',
      color: '#f1c40f',
      size: 25,
      collectible: true,
    },
    trap: {
      symbol: '💀',
      color: '#e74c3c',
      size: 20,
      collectible: false,
    },
  },

  // アニメーション設定
  animation: {
    playerMove: {
      duration: 200,
      easing: 'ease-out',
    },
    itemCollect: {
      duration: 300,
      easing: 'bounce',
    },
    levelTransition: {
      duration: 500,
      easing: 'ease-in-out',
    },
  },

  // 音響設定
  audio: {
    enabled: true,
    volume: {
      master: 0.8,
      sfx: 0.6,
      music: 0.4,
    },
    sounds: {
      move: 'move.mp3',
      collect: 'collect.mp3',
      win: 'win.mp3',
      lose: 'lose.mp3',
      levelUp: 'levelup.mp3',
    },
  },

  // UI設定
  ui: {
    colors: {
      primary: '#3498db',
      secondary: '#2ecc71',
      danger: '#e74c3c',
      warning: '#f39c12',
      info: '#9b59b6',
      light: '#ecf0f1',
      dark: '#2c3e50',
      background: '#34495e',
      text: '#ffffff',
      textSecondary: '#bdc3c7',
    },
    fonts: {
      title: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      subtitle: {
        fontSize: 18,
        fontWeight: '600',
      },
      body: {
        fontSize: 16,
        fontWeight: 'normal',
      },
      caption: {
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
    },
  },

  // ネットワーク設定
  network: {
    serverUrl: 'http://localhost:3000',
    reconnectAttempts: 5,
    reconnectDelay: 1000,
    timeout: 10000,
  },

  // デバッグ設定
  debug: {
    enabled: __DEV__,
    showFPS: true,
    showGrid: false,
    showCollisionBoxes: false,
    logLevel: 'info', // 'error', 'warn', 'info', 'debug'
  },
};

// ゲーム状態の定数
export const GameStates = {
  IDLE: 'idle',
  WAITING: 'waiting',
  PLAYING: 'playing',
  PAUSED: 'paused',
  FINISHED: 'finished',
  ERROR: 'error',
};

// プレイヤー状態の定数
export const PlayerStates = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  READY: 'ready',
  PLAYING: 'playing',
  SPECTATING: 'spectating',
};

// 方向の定数
export const Directions = {
  NORTH: 'north',
  SOUTH: 'south',
  EAST: 'east',
  WEST: 'west',
};

// アイテムタイプの定数
export const ItemTypes = {
  KEY: 'key',
  EXIT: 'exit',
  POWER_UP: 'powerUp',
  TRAP: 'trap',
};

// イベントタイプの定数
export const EventTypes = {
  PLAYER_MOVE: 'playerMove',
  ITEM_COLLECT: 'itemCollect',
  LEVEL_COMPLETE: 'levelComplete',
  GAME_WIN: 'gameWin',
  GAME_LOSE: 'gameLose',
  PLAYER_JOIN: 'playerJoin',
  PLAYER_LEAVE: 'playerLeave',
};

// 難易度設定
export const DifficultyLevels = {
  EASY: {
    name: 'easy',
    mazeSize: { width: 8, height: 8 },
    levels: 1,
    timeLimit: 20 * 60 * 1000,
    itemCount: { keys: 1, powerUps: 2, traps: 1 },
  },
  NORMAL: {
    name: 'normal',
    mazeSize: { width: 12, height: 12 },
    levels: 2,
    timeLimit: 15 * 60 * 1000,
    itemCount: { keys: 2, powerUps: 3, traps: 2 },
  },
  HARD: {
    name: 'hard',
    mazeSize: { width: 16, height: 16 },
    levels: 3,
    timeLimit: 10 * 60 * 1000,
    itemCount: { keys: 3, powerUps: 4, traps: 4 },
  },
};

// ローカライゼーション設定
export const Localization = {
  defaultLanguage: 'ja',
  supportedLanguages: ['ja', 'en'],
  translations: {
    ja: {
      gameTitle: 'Mazeon',
      startGame: 'ゲーム開始',
      joinGame: 'ゲーム参加',
      settings: '設定',
      exit: '終了',
      // 他の翻訳キー
    },
    en: {
      gameTitle: 'Mazeon',
      startGame: 'Start Game',
      joinGame: 'Join Game',
      settings: 'Settings',
      exit: 'Exit',
      // 他の翻訳キー
    },
  },
};
