/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens (Akan segera saya buat versi Native-nya)
import HomeScreen from './screens/HomeScreen';
import VideoScreen from './screens/VideoScreen';
import PackageScreen from './screens/PackageScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#fff',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: '#f4f4f5',
            },
            headerTitleStyle: {
              fontWeight: '900',
              fontStyle: 'italic',
              fontSize: 20,
              letterSpacing: -1,
            },
            headerTitle: 'ALTO',
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ALTO' }} />
          <Stack.Screen name="Video" component={VideoScreen} options={{ title: 'VIDEO' }} />
          <Stack.Screen name="Packages" component={PackageScreen} options={{ title: 'STORE' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'ME' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
