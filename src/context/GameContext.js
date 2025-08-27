import React, { createContext, useContext, useReducer, useEffect } from 'react';
import io from 'socket.io-client';

const GameContext = createContext();

const initialState = {
  socket: null,
  isConnected: false,
  roomId: null,
  room: null,
  players: [],
  gameState: 'idle', // idle, waiting, playing, finished
  maze: null,
  playerPosition: { x: 0, y: 0, level: 0 },
  hasKey: false,
  gameTime: 0,
  error: null
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'CONNECT_SOCKET':
      return {
        ...state,
        socket: action.payload,
        isConnected: true
      };
    
    case 'DISCONNECT_SOCKET':
      return {
        ...state,
        socket: null,
        isConnected: false,
        roomId: null,
        room: null,
        players: [],
        gameState: 'idle'
      };
    
    case 'SET_ROOM':
      return {
        ...state,
        roomId: action.payload.roomId,
        room: action.payload.room
      };
    
    case 'SET_GAME_STATE':
      return {
        ...state,
        gameState: action.payload
      };
    
    case 'SET_MAZE':
      return {
        ...state,
        maze: action.payload
      };
    
    case 'SET_PLAYER_POSITION':
      return {
        ...state,
        playerPosition: action.payload
      };
    
    case 'SET_HAS_KEY':
      return {
        ...state,
        hasKey: action.payload
      };
    
    case 'UPDATE_PLAYERS':
      return {
        ...state,
        players: action.payload
      };
    
    case 'SET_GAME_TIME':
      return {
        ...state,
        gameTime: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    // Socket.IO接続
    const socket = io('http://localhost:3000');
    
    socket.on('connect', () => {
      console.log('サーバーに接続しました');
      dispatch({ type: 'CONNECT_SOCKET', payload: socket });
    });
    
    socket.on('disconnect', () => {
      console.log('サーバーから切断されました');
      dispatch({ type: 'DISCONNECT_SOCKET' });
    });
    
    socket.on('roomCreated', (data) => {
      dispatch({ type: 'SET_ROOM', payload: data });
      dispatch({ type: 'SET_GAME_STATE', payload: 'waiting' });
    });
    
    socket.on('roomJoined', (data) => {
      dispatch({ type: 'SET_ROOM', payload: data });
      dispatch({ type: 'SET_GAME_STATE', payload: 'waiting' });
    });
    
    socket.on('gameStarted', (data) => {
      dispatch({ type: 'SET_MAZE', payload: data.maze });
      dispatch({ type: 'SET_GAME_STATE', payload: 'playing' });
      dispatch({ type: 'SET_PLAYER_POSITION', payload: { x: 0, y: 0, level: 0 } });
      dispatch({ type: 'SET_HAS_KEY', payload: false });
    });
    
    socket.on('playerMoved', (data) => {
      if (data.playerId === socket.id) {
        dispatch({ type: 'SET_PLAYER_POSITION', payload: data.position });
        dispatch({ type: 'SET_HAS_KEY', payload: data.hasKey });
      }
    });
    
    socket.on('keyCollected', (data) => {
      if (data.playerId === socket.id) {
        dispatch({ type: 'SET_HAS_KEY', payload: true });
      }
    });
    
    socket.on('gameWon', (data) => {
      dispatch({ type: 'SET_GAME_STATE', payload: 'finished' });
    });
    
    socket.on('error', (data) => {
      dispatch({ type: 'SET_ERROR', payload: data.message });
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = (roomConfig) => {
    if (state.socket) {
      state.socket.emit('createRoom', roomConfig);
    }
  };

  const joinRoom = (roomId) => {
    if (state.socket) {
      state.socket.emit('joinRoom', roomId);
    }
  };

  const startGame = () => {
    if (state.socket && state.roomId) {
      state.socket.emit('startGame', state.roomId);
    }
  };

  const movePlayer = (direction) => {
    if (state.socket && state.gameState === 'playing') {
      state.socket.emit('movePlayer', { direction });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    createRoom,
    joinRoom,
    startGame,
    movePlayer,
    clearError
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
