import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import TrainingScreen from "../screens/TrainingScreen";
import RaceScreen from '../screens/RaceScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const TrainingStack = createStackNavigator({ Training: TrainingScreen }, config);
TrainingStack.navigationOptions = {
  tabBarLabel: "Training",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === "ios" ? "ios-cube" : "md-cube"} />
  )
}
TrainingStack.path = "";

const RaceStack = createStackNavigator({ Race: RaceScreen }, config);
RaceStack.navigationOptions = {
  tabBarLabel: "Race",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === "ios" ? "ios-speedometer" : "md-speedometer"} />
  )
}

const tabNavigator = createBottomTabNavigator({
  TrainingStack,
  RaceStack,
});

tabNavigator.path = '';

export default tabNavigator;
