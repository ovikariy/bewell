import React from 'react';
import { Icon } from 'react-native-elements';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MoodScreen from '../screens/MoodScreen';
import MoodHistoryScreen from '../screens/MoodHistoryScreen';
import NoteScreen from '../screens/NoteScreen';
import NoteHistoryScreen from '../screens/NoteHistoryScreen';
import GratitudeScreen from '../screens/GratitudeScreen';
import GratitudeHistoryScreen from '../screens/GratitudeHistoryScreen';
import DreamScreen from '../screens/DreamScreen';
import DreamHistoryScreen from '../screens/DreamHistoryScreen';
import SleepScreen from '../screens/SleepScreen';
import SleepHistoryScreen from '../screens/SleepHistoryScreen';
import { TabBarOptions } from '../constants/Constants';

//TODO: popToTop when clicking on tabs (bug: click to record mood then go to Links
//via bottom tabs then Home via bottom tabs - the stack is at Mood)
const HomeStack = getStackNavigator({
  Home: HomeScreen,
  Gratitude: GratitudeScreen,
  GratitudeHistory: GratitudeHistoryScreen,
  Dream: DreamScreen,
  DreamHistory: DreamHistoryScreen,
  Mood: MoodScreen,
  MoodHistory: MoodHistoryScreen,
  Sleep: SleepScreen,
  SleepHistory: SleepHistoryScreen,
  Note: NoteScreen,
  NoteHistory: NoteHistoryScreen
}, 'Home', 'home');

const GratitudeStack = getStackNavigator({
  Gratitude: GratitudeScreen,
  GratitudeHistory: GratitudeHistoryScreen
}, 'Gratitude', 'heart-o');

const DreamStack = getStackNavigator({
  Dream: DreamScreen,
  DreamHistory: DreamHistoryScreen
}, 'Dream', 'bed');

const MoodStack = getStackNavigator({
  Mood: MoodScreen,
  MoodHistory: MoodHistoryScreen
}, 'Mood', 'smile-o');

const SleepStack = getStackNavigator({
  Sleep: SleepScreen,
  SleepHistory: SleepHistoryScreen
}, 'Sleep', 'moon-o');


const NoteStack = getStackNavigator({
  Note: NoteScreen,
  NoteHistory: NoteHistoryScreen
}, 'Note', 'sticky-note-o');

const SettingsStack = getStackNavigator({
  Settings: SettingsScreen
}, 'More', 'ellipsis-h');

function getStackNavigator(stackItems, tabBarLabel, tabBarIconName) {
  const stackNavigator = createStackNavigator(stackItems);
  stackNavigator.navigationOptions = {
    tabBarLabel: tabBarLabel,
    tabBarIcon: ({ focused }) => (
      <Icon
        type='font-awesome'  /* try type link, material, zocial, etc */
        name={tabBarIconName}
        size={26}
        color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    ),
  };
  return stackNavigator;
}

export default createBottomTabNavigator({
  HomeStack,
  GratitudeStack,
  DreamStack,
  MoodStack,
  SleepStack,
  NoteStack,
  SettingsStack
},
  {
    tabBarOptions: {
      resetOnBlur: true,
      ...TabBarOptions
    }
  });
