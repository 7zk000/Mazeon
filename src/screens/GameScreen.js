import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, SafeAreaView } from 'react-native';
import SkiaMazeView from '../components/SkiaMazeView';
import { useGame } from '../context/GameContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const GameScreen = ({ navigation }) => {
  const { maze, playerPosition, hasKey, movePlayer, gameState, room, keysCollected, keysRequired, exitOpen } = useGame();
  const [timeLeft, setTimeLeft] = useState(15 * 60 * 1000); // 15分
  const VIEWPORT = 21; // 表示範囲（奇数）

  useEffect(() => {
    if (!maze || gameState !== 'playing') {
      navigation.navigate('Lobby');
      return;
    }

    // タイマー更新
    const interval = setInterval(() => {
      if (room?.startTime) {
        const elapsed = Date.now() - room.startTime;
        const remaining = Math.max(0, room.timeLimit - elapsed);
        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          Alert.alert('ゲーム終了', '制限時間が終了しました', [
            { text: 'OK', onPress: () => navigation.navigate('Lobby') }
          ]);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [maze, gameState, room, navigation]);

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMove = (direction) => {
    movePlayer(direction);
  };

  const cellSize = useMemo(() => {
    // 表示範囲に基づいてセルサイズを決定（端末に合わせて自動調整）
    const paddingCols = 2; // 余白
    const paddingRows = 4; // タイトル/ヘッダ分
    const maxCols = Math.min(VIEWPORT, maze ? maze[0][0].length : VIEWPORT);
    const maxRows = Math.min(VIEWPORT, maze ? maze[0].length : VIEWPORT);
    return Math.min(screenWidth / (maxCols + paddingCols), screenHeight / (maxRows + paddingRows));
  }, [maze]);

  const renderMazeCell = (cell, x, y, level) => {
    const isPlayerHere = playerPosition.x === x && playerPosition.y === y && playerPosition.level === level;

    return (
      <View
        key={`${level}-${x}-${y}`}
        style={[
          styles.cell,
          {
            width: cellSize,
            height: cellSize,
            borderTopWidth: cell.walls.north ? 2 : 0,
            borderBottomWidth: cell.walls.south ? 2 : 0,
            borderLeftWidth: cell.walls.west ? 2 : 0,
            borderRightWidth: cell.walls.east ? 2 : 0,
            backgroundColor: isPlayerHere ? '#3498db' : '#2c3e50',
          },
        ]}
      >
        {isPlayerHere && (
          <View style={styles.player}>
            <Text style={styles.playerText}>P</Text>
          </View>
        )}
        {cell.hasKey && !hasKey && (
          <View style={styles.key}>
            <Text style={styles.keyText}>🔑</Text>
          </View>
        )}
        {cell.hasExit && (
          <View style={styles.exit}>
            <Text style={styles.exitText}>🚪</Text>
          </View>
        )}
      </View>
    );
  };

  const renderCurrentLevelViewport = () => {
    const level = playerPosition.level || 0;
    const levelMaze = maze[level];
    const half = Math.floor(VIEWPORT / 2);
    const startY = Math.max(0, playerPosition.y - half);
    const endY = Math.min(levelMaze.length - 1, playerPosition.y + half);
    const startX = Math.max(0, playerPosition.x - half);
    const endX = Math.min(levelMaze[0].length - 1, playerPosition.x + half);

    const rows = [];
    for (let y = startY; y <= endY; y++) {
      const cells = [];
      for (let x = startX; x <= endX; x++) {
        cells.push(renderMazeCell(levelMaze[y][x], x, y, level));
      }
      rows.push(
        <View key={y} style={styles.mazeRow}>
          {cells}
        </View>
      );
    }

    return (
      <View key={level} style={styles.mazeLevel}>
        <Text style={styles.levelTitle}>階層 {level + 1}（{startX},{startY}〜{endX},{endY}）</Text>
        <View style={styles.mazeContainer}>
          {rows}
        </View>
      </View>
    );
  };

  if (!maze) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>迷路を読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.infoRow}>
          <Text style={styles.timeText}>残り時間: {formatTime(timeLeft)}</Text>
          <View style={styles.keyStatus}>
            <Text style={styles.keyText}>鍵: {keysCollected}/{keysRequired}（出口: {exitOpen ? '開放' : '閉鎖'}）</Text>
          </View>
        </View>
        <Text style={styles.positionText}>
          位置: ({playerPosition.x}, {playerPosition.y}) - 階層{playerPosition.level + 1}
        </Text>
      </View>

      <View style={styles.mazeContainer}>
        {/* Skiaが利用可能ならSkia描画、無ければ既存ビュー描画 */}
        <SkiaMazeView maze={maze} playerPosition={playerPosition} exitOpen={exitOpen} viewport={41} />
        {!SkiaMazeView && renderCurrentLevelViewport()}
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleMove('north')}
          >
            <Text style={styles.controlText}>↑</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleMove('west')}
          >
            <Text style={styles.controlText}>←</Text>
          </TouchableOpacity>
          <View style={styles.centerButton} />
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleMove('east')}
          >
            <Text style={styles.controlText}>→</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleMove('south')}
          >
            <Text style={styles.controlText}>↓</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#3498db' }]} />
          <Text style={styles.legendText}>プレイヤー</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={styles.legendText}>🔑 鍵</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={styles.legendText}>🚪 出口</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Lobby')}
      >
        <Text style={styles.backButtonText}>ロビーに戻る</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ecf0f1',
    fontSize: 18,
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  timeText: {
    color: '#ecf0f1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  keyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  keyText: {
    color: '#ecf0f1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  positionText: {
    color: '#bdc3c7',
    fontSize: 14,
  },
  mazeContainer: {
    flex: 1,
    padding: 10,
  },
  mazeLevel: {
    marginBottom: 20,
  },
  levelTitle: {
    color: '#ecf0f1',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  mazeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    borderColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  player: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  key: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  exit: {
    position: 'absolute',
    bottom: 2,
    left: 2,
  },
  controlsContainer: {
    padding: 20,
    backgroundColor: '#2c3e50',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  controlButton: {
    width: 60,
    height: 60,
    backgroundColor: '#3498db',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  controlText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  centerButton: {
    width: 60,
    height: 60,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#2c3e50',
    borderTopWidth: 1,
    borderTopColor: '#34495e',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendBox: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  legendText: {
    color: '#ecf0f1',
    fontSize: 14,
  },
  backButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameScreen;
