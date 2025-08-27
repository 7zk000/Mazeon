const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ミドルウェア
app.use(helmet());
app.use(cors());
app.use(express.json());

// ゲーム状態管理
const gameRooms = new Map();
const players = new Map();

// 迷路生成アルゴリズム
function generateMaze(width, height, levels = 1) {
  const maze = [];
  
  for (let level = 0; level < levels; level++) {
    const levelMaze = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row.push({
          x, y, level,
          walls: { north: true, south: true, east: true, west: true },
          isWall: false,
          hasKey: false,
          hasExit: false,
          items: []
        });
      }
      levelMaze.push(row);
    }
    maze.push(levelMaze);
  }
  
  // 簡単な迷路生成（ランダムウォーク）
  for (let level = 0; level < levels; level++) {
    let x = 0, y = 0;
    const visited = new Set();
    
    while (visited.size < width * height) {
      const key = `${x},${y}`;
      visited.add(key);
      
      const directions = [];
      if (x > 0) directions.push('west');
      if (x < width - 1) directions.push('east');
      if (y > 0) directions.push('north');
      if (y < height - 1) directions.push('south');
      
      const direction = directions[Math.floor(Math.random() * directions.length)];
      
      switch (direction) {
        case 'north':
          if (y > 0) {
            maze[level][y][x].walls.north = false;
            maze[level][y-1][x].walls.south = false;
            y--;
          }
          break;
        case 'south':
          if (y < height - 1) {
            maze[level][y][x].walls.south = false;
            maze[level][y+1][x].walls.north = false;
            y++;
          }
          break;
        case 'east':
          if (x < width - 1) {
            maze[level][y][x].walls.east = false;
            maze[level][y][x+1].walls.west = false;
            x++;
          }
          break;
        case 'west':
          if (x > 0) {
            maze[level][y][x].walls.west = false;
            maze[level][y][x-1].walls.east = false;
            x--;
          }
          break;
      }
    }
    
    // アイテムと出口を配置
    const exitX = Math.floor(Math.random() * width);
    const exitY = Math.floor(Math.random() * height);
    maze[level][exitY][exitX].hasExit = true;
    
    // 鍵を配置
    const keyX = Math.floor(Math.random() * width);
    const keyY = Math.floor(Math.random() * height);
    maze[level][keyY][keyX].hasKey = true;
  }
  
  return maze;
}

// Socket.IO接続処理
io.on('connection', (socket) => {
  console.log('新しいプレイヤーが接続しました:', socket.id);
  
  // プレイヤー情報を保存
  players.set(socket.id, {
    id: socket.id,
    name: `Player_${socket.id.slice(0, 6)}`,
    roomId: null,
    position: { x: 0, y: 0, level: 0 },
    hasKey: false,
    isReady: false
  });
  
  // ルーム作成
  socket.on('createRoom', (data) => {
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const { playerCount = 4, mazeWidth = 10, mazeHeight = 10, levels = 1 } = data;
    
    const maze = generateMaze(mazeWidth, mazeHeight, levels);
    
    const room = {
      id: roomId,
      players: [socket.id],
      maxPlayers: playerCount,
      maze: maze,
      gameState: 'waiting', // waiting, playing, finished
      startTime: null,
      timeLimit: 15 * 60 * 1000, // 15分
      createdBy: socket.id
    };
    
    gameRooms.set(roomId, room);
    players.get(socket.id).roomId = roomId;
    
    socket.join(roomId);
    socket.emit('roomCreated', { roomId, room });
    console.log(`ルーム ${roomId} が作成されました`);
  });
  
  // ルーム参加
  socket.on('joinRoom', (roomId) => {
    const room = gameRooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'ルームが見つかりません' });
      return;
    }
    
    if (room.players.length >= room.maxPlayers) {
      socket.emit('error', { message: 'ルームが満員です' });
      return;
    }
    
    room.players.push(socket.id);
    players.get(socket.id).roomId = roomId;
    
    socket.join(roomId);
    socket.emit('roomJoined', { roomId, room });
    io.to(roomId).emit('playerJoined', { 
      playerId: socket.id, 
      playerCount: room.players.length 
    });
    
    console.log(`プレイヤー ${socket.id} がルーム ${roomId} に参加しました`);
  });
  
  // ゲーム開始
  socket.on('startGame', (roomId) => {
    const room = gameRooms.get(roomId);
    if (!room || room.createdBy !== socket.id) {
      socket.emit('error', { message: 'ゲームを開始する権限がありません' });
      return;
    }
    
    room.gameState = 'playing';
    room.startTime = Date.now();
    
    // 全プレイヤーの位置をリセット
    room.players.forEach(playerId => {
      const player = players.get(playerId);
      if (player) {
        player.position = { x: 0, y: 0, level: 0 };
        player.hasKey = false;
        player.isReady = false;
      }
    });
    
    io.to(roomId).emit('gameStarted', { 
      startTime: room.startTime,
      timeLimit: room.timeLimit,
      maze: room.maze
    });
    
    console.log(`ルーム ${roomId} でゲームが開始されました`);
  });
  
  // プレイヤー移動
  socket.on('movePlayer', (data) => {
    const { direction } = data;
    const player = players.get(socket.id);
    if (!player || !player.roomId) return;
    
    const room = gameRooms.get(player.roomId);
    if (!room || room.gameState !== 'playing') return;
    
    const { x, y, level } = player.position;
    const currentCell = room.maze[level][y][x];
    
    let newX = x, newY = y, newLevel = level;
    
    switch (direction) {
      case 'north':
        if (!currentCell.walls.north && y > 0) newY = y - 1;
        break;
      case 'south':
        if (!currentCell.walls.south && y < room.maze[level].length - 1) newY = y + 1;
        break;
      case 'east':
        if (!currentCell.walls.east && x < room.maze[level][0].length - 1) newX = x + 1;
        break;
      case 'west':
        if (!currentCell.walls.west && x > 0) newX = x - 1;
        break;
    }
    
    if (newX !== x || newY !== y) {
      player.position = { x: newX, y: newY, level: newLevel };
      
      // アイテム取得チェック
      const newCell = room.maze[newLevel][newY][newX];
      if (newCell.hasKey && !player.hasKey) {
        player.hasKey = true;
        newCell.hasKey = false;
        io.to(roomId).emit('keyCollected', { playerId: socket.id });
      }
      
      // 出口チェック
      if (newCell.hasExit && player.hasKey) {
        room.gameState = 'finished';
        io.to(roomId).emit('gameWon', { 
          winnerId: socket.id,
          winnerName: player.name,
          timeElapsed: Date.now() - room.startTime
        });
      }
      
      io.to(roomId).emit('playerMoved', {
        playerId: socket.id,
        position: player.position,
        hasKey: player.hasKey
      });
    }
  });
  
  // 切断処理
  socket.on('disconnect', () => {
    const player = players.get(socket.id);
    if (player && player.roomId) {
      const room = gameRooms.get(player.roomId);
      if (room) {
        room.players = room.players.filter(id => id !== socket.id);
        
        if (room.players.length === 0) {
          gameRooms.delete(player.roomId);
          console.log(`ルーム ${player.roomId} が削除されました`);
        } else {
          io.to(player.roomId).emit('playerLeft', { 
            playerId: socket.id,
            playerCount: room.players.length 
          });
        }
      }
    }
    
    players.delete(socket.id);
    console.log('プレイヤーが切断しました:', socket.id);
  });
});

// API エンドポイント
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    activeRooms: gameRooms.size,
    activePlayers: players.size
  });
});

app.get('/api/rooms', (req, res) => {
  const roomList = Array.from(gameRooms.values()).map(room => ({
    id: room.id,
    playerCount: room.players.length,
    maxPlayers: room.maxPlayers,
    gameState: room.gameState,
    createdBy: room.createdBy
  }));
  
  res.json(roomList);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Mazeon ゲームサーバーがポート ${PORT} で起動しました`);
  console.log(`アクティブなルーム数: ${gameRooms.size}`);
  console.log(`アクティブなプレイヤー数: ${players.size}`);
});
