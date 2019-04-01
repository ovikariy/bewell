import React from 'react';
import { Icon } from 'react-native-elements';
import { View, ScrollView, Image } from 'react-native';
import { createStackNavigator, createDrawerNavigator, DrawerItems, SafeAreaView, StackActions, NavigationActions } from 'react-navigation';
import { DrawerNavOptions } from '../constants/Constants'
import { styles, Colors } from '../assets/styles/style';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MoodHistoryScreen from '../screens/MoodHistoryScreen';
import NoteHistoryScreen from '../screens/NoteHistoryScreen';
import GratitudeHistoryScreen from '../screens/GratitudeHistoryScreen';
import DreamHistoryScreen from '../screens/DreamHistoryScreen';
import SleepHistoryScreen from '../screens/SleepHistoryScreen';
import DailyHistoryScreen from '../screens/DailyHistoryScreen';
import ChartScreen from '../screens/ChartScreen';

const HomeNavigator = createStackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: ({ navigation }) => ({
            /* show drawer icon is on HomeScreen only */
            headerLeft: <Icon name='menu' containerStyle={{ margin: 16 }}
                color='white' onPress={() => navigation.toggleDrawer()} />
        })
    },
    GratitudeHistory: { screen: GratitudeHistoryScreen },
    DreamHistory: { screen: DreamHistoryScreen },
    MoodHistory: { screen: MoodHistoryScreen },
    SleepHistory: { screen: SleepHistoryScreen },
    NoteHistory: { screen: NoteHistoryScreen },
    DailyHistory: { screen: DailyHistoryScreen }
}, {
        initialRouteName: 'Home',
        headerLayoutPreset: 'center',
        defaultNavigationOptions: ({ navigation }) => ({
            ...DrawerNavOptions
        })
    });

const SettingsNavigator = createStackNavigator({
    Settings: { screen: SettingsScreen }
}, {
        headerLayoutPreset: 'center',
        defaultNavigationOptions: ({ navigation }) => ({
            ...DrawerNavOptions,
            headerLeft: <Icon name='menu' containerStyle={{ margin: 16 }}
                color='white' onPress={() => navigation.toggleDrawer()} />
        })
    });

const ChartsNavigator = createStackNavigator({
    Charts: { screen: ChartScreen }
}, {
        headerLayoutPreset: 'center',
        defaultNavigationOptions: ({ navigation }) => ({
            ...DrawerNavOptions,
            headerLeft: <Icon name='menu' containerStyle={{ margin: 16 }}
                color='white' onPress={() => navigation.toggleDrawer()} />
        })
    });

const CustomDrawerContentComponent = (props) => (
    <ScrollView>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <View style={[ styles.logoContainer, { flex: 1, backgroundColor: Colors.darkBackground }]}>
                <Image source={require('../assets/images/logo.png')}
                    style={styles.logoImage} />
            </View>
            <DrawerItems {...props} />
        </SafeAreaView>
    </ScrollView>
);

const MainDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomeNavigator,
        navigationOptions: ({ navigation }) => ({
            drawerLabel: 'Home',
            drawerIcon: ({ tintColor }) => (
                <Icon name='home'
                    type='font-awesome'
                    size={24}
                    color={tintColor} />
            )
        })
    },
    Charts: {
        screen: ChartsNavigator,
        navigationOptions: {
            title: 'Charts',
            drawerLabel: 'Charts',
            drawerIcon: ({ tintColor }) => (
                <Icon name='area-chart'
                    type='font-awesome'
                    size={24}
                    color={tintColor} />
            )
        }
    },
    Settings: {
        screen: SettingsNavigator,
        navigationOptions: {
            title: 'Settings',
            drawerLabel: 'Settings',
            drawerIcon: ({ tintColor }) => (
                <Icon name='info-circle'
                    type='font-awesome'
                    size={24}
                    color={tintColor} />
            )
        }
    }
}, {
        //resetOnBlur: true, /* reset the state of any nested navigators when switching away from a screen */
        initialRouteName: 'Home', /* default is to show the page of the first menu item but we want it to be Home */
        //drawerBackgroundColor: '#ffffff',
        contentComponent: CustomDrawerContentComponent
    });

export default MainDrawerNavigator;

