import React from 'react';
import { Icon } from 'react-native-elements';
import { View, ScrollView, Image, Text } from 'react-native';
import { createStackNavigator, createDrawerNavigator, DrawerItems, SafeAreaView, StackActions, NavigationActions } from 'react-navigation';
import { styles } from '../assets/styles/style';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ItemHistoryScreen from '../screens/ItemHistoryScreen';
import ChartScreen from '../screens/ChartScreen';
import PasswordScreen from '../screens/PasswordScreen';
import BackupRestoreScreen from '../screens/BackupRestore';
import { text } from '../modules/Constants';
import { IconForButton } from './MiscComponents';
import InsightsScreen from '../screens/InsightsScreen';

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
    ItemHistory: { screen: ItemHistoryScreen }
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

const InsightsNavigator = createStackNavigator({
    Insights: {
        screen: InsightsScreen,
        navigationOptions: ({ navigation }) => ({
            /* show drawer icon is on initial route only */
            headerLeft: <DrawerIcon navigation={navigation} />
        })
    },
    ItemHistory: { screen: ItemHistoryScreen }
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
    <ScrollView style={styles.menuBackground}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <View style={[styles.flex, styles.rowContainer]}>
                <Image source={require('../assets/images/logo_small.png')}
                    style={styles.logoImage} />
                <Text style={styles.heading}>{text.homeScreen.title}</Text>
            </View>
            <DrawerItems activeLabelStyle={styles.bodyTextBright}
                inactiveLabelStyle={styles.bodyText}
                activeBackgroundColor={styles.toolbarContainer.backgroundColor}
                {...props} />
        </SafeAreaView>
    </ScrollView>
);

const MainDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomeNavigator,
        navigationOptions: ({ navigation }) => ({
            drawerLabel: text.homeScreen.menuLabel,
            drawerIcon: <IconForButton name='home' iconStyle={styles.iconPrimarySmall} />
        })
    },
    Insights: {
        screen: InsightsNavigator,
        navigationOptions: {
            title: text.insightsScreen.title,
            drawerLabel: text.insightsScreen.title,
            drawerIcon: <IconForButton name='history' type='font-awesome' iconStyle={styles.iconPrimarySmall} />
        }
    },    
    Settings: {
        screen: SettingsNavigator,
        navigationOptions: {
            title: text.settingsScreen.title,
            drawerLabel: text.settingsScreen.title,
            drawerIcon: <IconForButton name='sliders' type='font-awesome' iconStyle={styles.iconPrimarySmall} />
        }
    }
}, {
    //resetOnBlur: true, /* reset the state of any nested navigators when switching away from a screen */
    initialRouteName: 'Home', /* default is to show the page of the first menu item but we want it to be Home */
    contentComponent: CustomDrawerContentComponent
});

export default MainDrawerNavigator;

