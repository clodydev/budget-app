import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Text } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1F2937' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Бюджет' }} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: 'Новая операция', presentation: 'modal' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: '#1F2937', borderTopColor: '#374151' },
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#6B7280',
          tabBarIcon: ({ focused }) => {
            const icons: Record<string, string> = { Home: '🏠', Stats: '📊', Settings: '⚙️' };
            return <Text style={{ fontSize: 20 }}>{icons[route.name] || '📁'}</Text>;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Главная' }} />
        <Tab.Screen name="Stats" component={StatsScreen} options={{ title: 'Статистика' }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Настройки' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
