import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import LobbyScreen from './screens/LobbyScreen';
import { GameProvider } from './context/GameContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GameProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#2c3e50',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ title: 'Mazeon' }}
              />
              <Stack.Screen 
                name="Lobby" 
                component={LobbyScreen} 
                options={{ title: 'ゲームロビー' }}
              />
              <Stack.Screen 
                name="Game" 
                component={GameScreen} 
                options={{ 
                  title: '迷路ゲーム',
                  headerShown: false 
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </GameProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
