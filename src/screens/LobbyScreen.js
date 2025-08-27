import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useGame } from '../context/GameContext';

const LobbyScreen = ({ navigation }) => {
  const { room, roomId, gameState, startGame, socket } = useGame();
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!room) {
      navigation.navigate('Home');
      return;
    }

    // プレイヤーリストを更新
    if (room.players) {
      setPlayers(room.players.map(playerId => ({
        id: playerId,
        name: `Player_${playerId.slice(0, 6)}`,
        isHost: playerId === room.createdBy
      })));
    }

    // ゲーム状態が変わったらゲーム画面に遷移
    if (gameState === 'playing') {
      navigation.navigate('Game');
    }
  }, [room, gameState, navigation]);

  useEffect(() => {
    if (gameState === 'playing' && room?.startTime) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - room.startTime;
        const remaining = Math.max(0, room.timeLimit - elapsed);
        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          Alert.alert('ゲーム終了', '制限時間が終了しました');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState, room]);

  const handleStartGame = () => {
    if (socket && socket.id === room?.createdBy) {
      startGame();
    } else {
      Alert.alert('エラー', 'ゲームを開始する権限がありません');
    }
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit('leaveRoom', roomId);
    }
    navigation.navigate('Home');
  };

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!room) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>ルーム情報を読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>ゲームロビー</Text>
          <Text style={styles.roomId}>ルームID: {roomId}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>プレイヤー数:</Text>
            <Text style={styles.infoValue}>
              {players.length} / {room.maxPlayers}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>迷路サイズ:</Text>
            <Text style={styles.infoValue}>
              {room.maze?.[0]?.[0]?.length || 0} × {room.maze?.[0]?.length || 0}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>階層数:</Text>
            <Text style={styles.infoValue}>{room.maze?.length || 1}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>制限時間:</Text>
            <Text style={styles.infoValue}>15分</Text>
          </View>
        </View>

        <View style={styles.playersContainer}>
          <Text style={styles.sectionTitle}>プレイヤー一覧</Text>
          {players.map((player, index) => (
            <View key={player.id} style={styles.playerItem}>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                {player.isHost && (
                  <View style={styles.hostBadge}>
                    <Text style={styles.hostText}>ホスト</Text>
                  </View>
                )}
              </View>
              <View style={styles.playerStatus}>
                <View style={[styles.statusDot, { backgroundColor: '#27ae60' }]} />
                <Text style={styles.statusText}>準備完了</Text>
              </View>
            </View>
          ))}
        </View>

        {gameState === 'playing' && (
          <View style={styles.gameInfoContainer}>
            <Text style={styles.gameInfoTitle}>ゲーム進行中</Text>
            <Text style={styles.timeText}>残り時間: {formatTime(timeLeft)}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {socket?.id === room.createdBy && gameState === 'waiting' && (
            <TouchableOpacity
              style={[styles.button, styles.startButton]}
              onPress={handleStartGame}
              disabled={players.length < 1}
            >
              <Text style={styles.buttonText}>ゲーム開始</Text>
            </TouchableOpacity>
          )}

          {gameState === 'waiting' && (
            <TouchableOpacity
              style={[styles.button, styles.leaveButton]}
              onPress={handleLeaveRoom}
            >
              <Text style={styles.buttonText}>ルームを退出</Text>
            </TouchableOpacity>
          )}

          {gameState === 'playing' && (
            <TouchableOpacity
              style={[styles.button, styles.spectateButton]}
              onPress={() => navigation.navigate('Game')}
            >
              <Text style={styles.buttonText}>ゲームに参加</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495e',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
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
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: 10,
  },
  roomId: {
    fontSize: 16,
    color: '#bdc3c7',
    backgroundColor: '#2c3e50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  infoContainer: {
    backgroundColor: '#2c3e50',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    color: '#bdc3c7',
    fontSize: 16,
  },
  infoValue: {
    color: '#ecf0f1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playersContainer: {
    backgroundColor: '#2c3e50',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#ecf0f1',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerName: {
    color: '#ecf0f1',
    fontSize: 16,
    marginRight: 10,
  },
  hostBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  hostText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    color: '#bdc3c7',
    fontSize: 14,
  },
  gameInfoContainer: {
    backgroundColor: '#27ae60',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  gameInfoTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  startButton: {
    backgroundColor: '#27ae60',
  },
  leaveButton: {
    backgroundColor: '#e74c3c',
  },
  spectateButton: {
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LobbyScreen;
