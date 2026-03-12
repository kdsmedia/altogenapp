import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import BonusScreen from '../screens/BonusScreen';
import GenScreen from '../screens/GenScreen';
import SaldoScreen from '../screens/SaldoScreen';
import ProfilScreen from '../screens/ProfilScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bonus" component={BonusScreen} />
      <Tab.Screen name="Gen" component={GenScreen} />
      <Tab.Screen name="Saldo" component={SaldoScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;