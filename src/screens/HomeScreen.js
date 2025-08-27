import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useGame } from '../context/GameContext';

const HomeScreen = ({ navigation }) => {
  const { isConnected, createRoom, joinRoom, error, clearError } = useGame();
  const [roomId, setRoomId] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [roomConfig, setRoomConfig] = useState({
    playerCount: 4,
    mazeWidth: 10,
    mazeHeight: 10,
    levels: 1,
  });

  const handleCreateRoom = () => {
    if (!isConnected) {
      Alert.alert('エラー', 'サーバーに接続されていません');
      return;
    }
    
    createRoom(roomConfig);
    navigation.navigate('Lobby');
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      Alert.alert('エラー', 'ルームIDを入力してください');
      return;
    }
    
    if (!isConnected) {
      Alert.alert('エラー', 'サーバーに接続されていません');
      return;
    }
    
    joinRoom(roomId.trim());
    navigation.navigate('Lobby');
  };

  if (error) {
    Alert.alert('エラー', error, [
      { text: 'OK', onPress: clearError }
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Mazeon</Text>
          <Text style={styles.subtitle}>協力型迷路攻略ゲーム</Text>
          <View style={styles.connectionStatus}>
            <View style={[styles.statusDot, { backgroundColor: isConnected ? '#27ae60' : '#e74c3c' }]} />
            <Text style={styles.statusText}>
              {isConnected ? 'サーバー接続済み' : 'サーバー未接続'}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.createButton]}
            onPress={() => setShowCreateForm(!showCreateForm)}
          >
            <Text style={styles.buttonText}>新しいルームを作成</Text>
          </TouchableOpacity>

          {showCreateForm && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>ルーム設定</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>プレイヤー数</Text>
                <TextInput
                  style={styles.input}
                  value={roomConfig.playerCount.toString()}
                  onChangeText={(text) => setRoomConfig({
                    ...roomConfig,
                    playerCount: parseInt(text) || 4
                  })}
                  keyboardType="numeric"
                  placeholder="4"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>迷路の幅</Text>
                <TextInput
                  style={styles.input}
                  value={roomConfig.mazeWidth.toString()}
                  onChangeText={(text) => setRoomConfig({
                    ...roomConfig,
                    mazeWidth: parseInt(text) || 10
                  })}
                  keyboardType="numeric"
                  placeholder="10"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>迷路の高さ</Text>
                <TextInput
                  style={styles.input}
                  value={roomConfig.mazeHeight.toString()}
                  onChangeText={(text) => setRoomConfig({
                    ...roomConfig,
                    mazeHeight: parseInt(text) || 10
                  })}
                  keyboardType="numeric"
                  placeholder="10"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>階層数</Text>
                <TextInput
                  style={styles.input}
                  value={roomConfig.levels.toString()}
                  onChangeText={(text) => setRoomConfig({
                    ...roomConfig,
                    levels: parseInt(text) || 1
                  })}
                  keyboardType="numeric"
                  placeholder="1"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleCreateRoom}
              >
                <Text style={styles.buttonText}>ルームを作成</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>または</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.joinContainer}>
            <TextInput
              style={styles.roomInput}
              value={roomId}
              onChangeText={setRoomId}
              placeholder="ルームIDを入力"
              placeholderTextColor="#95a5a6"
            />
            <TouchableOpacity
              style={[styles.button, styles.joinButton]}
              onPress={handleJoinRoom}
            >
              <Text style={styles.buttonText}>ルームに参加</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>ゲームルール</Text>
          <Text style={styles.infoText}>• プレイ人数: 1人〜8人</Text>
          <Text style={styles.infoText}>• 迷路は自動生成されます</Text>
          <Text style={styles.infoText}>• 階層: 1〜3階層まで</Text>
          <Text style={styles.infoText}>• アイテム: 脱出用鍵や攻略の手助け</Text>
          <Text style={styles.infoText}>• 制限時間: 15分</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#bdc3c7',
    textAlign: 'center',
    marginBottom: 20,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    color: '#ecf0f1',
    fontSize: 14,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  createButton: {
    backgroundColor: '#3498db',
  },
  joinButton: {
    backgroundColor: '#e67e22',
  },
  confirmButton: {
    backgroundColor: '#27ae60',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#2c3e50',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  formTitle: {
    color: '#ecf0f1',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: '#bdc3c7',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#34495e',
    color: '#ecf0f1',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#7f8c8d',
  },
  dividerText: {
    color: '#bdc3c7',
    marginHorizontal: 15,
    fontSize: 16,
  },
  joinContainer: {
    marginTop: 10,
  },
  roomInput: {
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#2c3e50',
    padding: 20,
    borderRadius: 10,
  },
  infoTitle: {
    color: '#ecf0f1',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoText: {
    color: '#bdc3c7',
    fontSize: 14,
    marginBottom: 5,
  },
});

export default HomeScreen;
