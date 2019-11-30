import React from 'react';
import { Icon } from 'react-native-elements';
import { View, ScrollView, Image } from 'react-native';
import { createStackNavigator, createDrawerNavigator, DrawerItems, SafeAreaView, StackActions, NavigationActions } from 'react-navigation';
import { styles, colors, fonts } from '../assets/styles/style';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MoodHistoryScreen from '../screens/MoodHistoryScreen';
import NoteHistoryScreen from '../screens/NoteHistoryScreen';
import SleepHistoryScreen from '../screens/SleepHistoryScreen';
import ChartScreen from '../screens/ChartScreen';
import PasswordScreen from '../screens/PasswordScreen';
import BackupRestoreScreen from '../screens/BackupRestore';
import { text } from '../modules/Constants';

const DrawerNavOptions = {
    headerStyle: {
        borderWidth: 0
    },
    headerTitleStyle: styles.heading,
    headerTransparent: true,
    headerTintColor: styles.heading.color
}

const DrawerIcon = (props) => {
    return <Icon name='menu' size={30} containerStyle={{ margin: 16 }}
        color='white' onPress={() => props.navigation.toggleDrawer()} />
}

const HomeNavigator = createStackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: ({ navigation }) => ({
            /* show drawer icon is on HomeScreen only */
            headerLeft: <DrawerIcon navigation={navigation} />
        })
    },
    MoodHistory: { screen: MoodHistoryScreen },
    SleepHistory: { screen: SleepHistoryScreen },
    NoteHistory: { screen: NoteHistoryScreen }
}, {
    initialRouteName: 'Home',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: ({ navigation }) => ({
        ...DrawerNavOptions
    })
});

const SettingsNavigator = createStackNavigator({
    Settings: {
        screen: SettingsScreen,
        navigationOptions: ({ navigation }) => ({
            /* show drawer icon is on initial route only */
            headerLeft: <DrawerIcon navigation={navigation} />
        })
    },
    Password: { screen: PasswordScreen },
    BackupRestore: { screen: BackupRestoreScreen }
}, {
    headerLayoutPreset: 'center',
    defaultNavigationOptions: ({ navigation }) => ({
        ...DrawerNavOptions
    })
});

const ChartsNavigator = createStackNavigator({
    Charts: { screen: ChartScreen }
}, {
    headerLayoutPreset: 'center',
    defaultNavigationOptions: ({ navigation }) => ({
        ...DrawerNavOptions,
        headerLeft: <DrawerIcon navigation={navigation} />
    })
});

const CustomDrawerContentComponent = (props) => (
    <ScrollView>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <View style={[styles.logoContainer, { flex: 1, backgroundColor: colors.darkBackground }]}>
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
            drawerLabel: text.homeScreen.menuLabel,
            drawerIcon: ({ tintColor }) => (
                <Icon name='home'
                    type='font-awesome'
                    size={24}
                    color={tintColor} />
            )
        })
    },
    Settings: {
        screen: SettingsNavigator,
        navigationOptions: {
            title: text.settingsScreen.title,
            drawerLabel: text.settingsScreen.title,
            drawerIcon: ({ tintColor }) => (
                <Icon name='sliders'
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

