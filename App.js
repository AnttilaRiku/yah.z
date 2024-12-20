import React from 'react';
import { View } from 'react-native';
import Home from './components/Home';
import Gameboard from './components/Gameboard';
import Scoreboard from './components/Scoreboard';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from './style/style';

const Tab = createBottomTabNavigator();

export default App = () => {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Tab.Navigator
          sceneContainerStyle={{ backgroundColor: 'transparent' }}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'information' : 'information-outline';
              } else if (route.name === 'Gameboard') {
                iconName = focused ? 'dice-multiple' : 'dice-multiple-outline';
              } else if (route.name === 'Scoreboard') {
                iconName = focused ? 'view-list' : 'view-list-outline';
              }

              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            },
            tabBarActiveTintColor: 'red',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: { backgroundColor: '#006400' },
          })}
        >
          <Tab.Screen name="Home" component={Home} options={{ tabBarStyle: { display: 'none' } }} />
          <Tab.Screen name="Gameboard" component={Gameboard} />
          <Tab.Screen name="Scoreboard" component={Scoreboard} />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}