import * as React from 'react';
import { View, Image, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { styles } from '../assets/styles/style';
import { text } from '../modules/Constants';
import { IconForButton } from './MiscComponents';

import HomeScreen from '../screens/HomeScreen';
import ItemHistoryScreen from '../screens/ItemHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PasswordScreen from '../screens/PasswordScreen';
import BackupRestoreScreen from '../screens/BackupRestore';
import RestoreScreen from '../screens/RestoreScreen';
import BackupScreen from '../screens/BackupScreen';
import InsightsScreen from '../screens/InsightsScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignOutScreen from '../screens/SignOutScreen';
import SetupPasswordScreen from '../screens/SetupPasswordScreen';
import SetupPINScreen from '../screens/SetupPINScreen';

const MenuHeaderButton = (props) => {
    return <Icon name='menu' size={30} containerStyle={{ margin: 16 }}
        color='white' onPress={() => props.navigation.toggleDrawer()} />
}

const ScreenNavOptions = {
    headerStyle: { borderWidth: 0 },
    headerTitleStyle: styles.heading,
    headerTitleAlign: 'center',
    headerTransparent: true,
    headerTintColor: styles.heading.color
}

const WelcomeStack = createStackNavigator();
function WelcomeNavigator() {
    return (
        <WelcomeStack.Navigator initialRouteName='Welcome' screenOptions={ScreenNavOptions} >
            <WelcomeStack.Screen
                name='Welcome'
                component={WelcomeScreen}
                options={({ route, navigation }) => ({
                    title: ''
                })}
            />
            <WelcomeStack.Screen
                name='SetupPassword'
                component={SetupPasswordScreen}
                options={({ route, navigation }) => ({
                    title: ''
                })}
            />
            <Drawer.Screen name='SignIn'
                component={SignInScreen}
                options={({ route, navigation }) => ({
                    title: ''
                })}
            />            
        </WelcomeStack.Navigator>
    );
}

const HomeStack = createStackNavigator();
function HomeNavigator() {
    return (
        <HomeStack.Navigator initialRouteName='Home' screenOptions={ScreenNavOptions} >
            <HomeStack.Screen
                name='Home'
                component={HomeScreen}
                options={({ route, navigation }) => ({
                    title: text.homeScreen.title,
                    headerLeft: () => <MenuHeaderButton navigation={navigation} />,
                    headerRight: () => <Image source={require('../assets/images/logo_small.png')} style={[styles.logoImageSmall, { marginRight: 10 }]}
                    />
                })}
            />
            <HomeStack.Screen
                name='ItemHistory'
                component={ItemHistoryScreen}
                options={ItemHistoryScreen.navigationOptions} /* dynamic nav options in the component */
            />
        </HomeStack.Navigator>
    );
}

const InsightsStack = createStackNavigator();
function InsightsNavigator() {
    return (
        <InsightsStack.Navigator initialRouteName='Insights' screenOptions={ScreenNavOptions} >
            <InsightsStack.Screen
                name='Insights'
                component={InsightsScreen}
                options={({ route, navigation }) => ({
                    title: text.insightsScreen.title,
                    headerLeft: () => <MenuHeaderButton navigation={navigation} />
                })}
            />
            <InsightsStack.Screen
                name='ItemHistory'
                component={ItemHistoryScreen}
                options={ItemHistoryScreen.navigationOptions} /* dynamic nav options in the component */
            />
        </InsightsStack.Navigator>
    );
}

const SettingsStack = createStackNavigator();
function SettingsNavigator() {
    return (
        <SettingsStack.Navigator initialRouteName='Settings' screenOptions={ScreenNavOptions} >
            <SettingsStack.Screen
                name='Settings'
                component={SettingsScreen}
                options={({ route, navigation }) => ({
                    title: text.settingsScreen.title,
                    headerLeft: () => <MenuHeaderButton navigation={navigation} />
                })}
            />
            <SettingsStack.Screen
                name='Password'
                component={PasswordScreen}
                options={{ title: text.passwordScreen.title }}
            />
            {/*TODO: SetupPINScreen should not be visible if not password has been created yet */}
            <SettingsStack.Screen
                name='SetupPINScreen'
                component={SetupPINScreen}
                options={{ title: text.setupPINScreen.title }}
            />
            <SettingsStack.Screen
                name='BackupRestore'
                component={BackupRestoreScreen}
                options={{ title: text.backupRestoreScreen.title }}
            />
            <SettingsStack.Screen
                name='Restore'
                component={RestoreScreen}
                options={{ title: text.restoreScreen.title }}
            />
            <SettingsStack.Screen
                name='Backup'
                component={BackupScreen}
                options={{ title: text.backupScreen.title }}
            />
        </SettingsStack.Navigator>
    );
}

const SignOutStack = createStackNavigator();
function SignOutNavigator() {
    return (
        <SignOutStack.Navigator initialRouteName='SignOut' screenOptions={ScreenNavOptions} >
            <SignOutStack.Screen
                name='SignOut'
                component={SignOutScreen}
                options={({ route, navigation }) => ({
                    title: text.signOutScreen.title,
                    headerLeft: () => <MenuHeaderButton navigation={navigation} />,
                    headerRight: () => <Image source={require('../assets/images/logo_small.png')} style={[styles.logoImageSmall, { marginRight: 10 }]} />
                })}
            />
        </SignOutStack.Navigator>
    )
}

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView style={styles.menuBackground} {...props}>
            <View style={[styles.flex, styles.rowContainer, { marginBottom: 20 }]}>
                <Image source={require('../assets/images/logo_small.png')} style={[styles.logoImageSmall, { marginRight: 10 }]} />
                <Text style={styles.heading}>{text.app.name}</Text>
            </View>
            <DrawerItemList itemStyle={[styles.drawerItem]}
                labelStyle={[styles.drawerLabel]}
                activeTintColor={styles.brightColor.color}
                inactiveTintColor={styles.bodyText.color}
                activeBackgroundColor={styles.toolbarContainer.backgroundColor}
                {...props} />
        </DrawerContentScrollView>
    );
}

function getSigninScreens(props) {
    return (
        <React.Fragment>
            <Drawer.Screen name='SignIn'
                component={SignInScreen}
                options={({ route, navigation }) => ({
                    title: ''
                })}
            />
        </React.Fragment>
    )
}

function getFirstTimeUserScreens() {
    return (
        <React.Fragment>
            <Drawer.Screen name="Welcome" component={WelcomeNavigator} />
        </React.Fragment>
    )
}

function getAuthenticatedUserScreens() {
    return (
        <React.Fragment>
            <Drawer.Screen name="Home" component={HomeNavigator}
                options={{
                    drawerLabel: text.homeScreen.menuLabel,
                    drawerIcon: ({ focused }) => <IconForButton name='home'
                        iconStyle={[styles.iconPrimarySmall,
                        { color: (focused ? styles.brightColor.color : styles.bodyText.color) }]} />
                }}
            />
            <Drawer.Screen name="Insights" component={InsightsNavigator}
                options={{
                    drawerLabel: text.insightsScreen.title,
                    drawerIcon: ({ focused }) => <IconForButton name='history' type='font-awesome'
                        iconStyle={[styles.iconPrimarySmall,
                        { color: (focused ? styles.brightColor.color : styles.bodyText.color) }]} />
                }}
            />
            <Drawer.Screen name="Settings" component={SettingsNavigator}
                options={{
                    drawerLabel: text.settingsScreen.title,
                    drawerIcon: ({ focused }) => <IconForButton name='sliders' type='font-awesome'
                        iconStyle={[styles.iconPrimarySmall,
                        { color: (focused ? styles.brightColor.color : styles.bodyText.color) }]} />
                }}
            />
            <Drawer.Screen name="SignOut" component={SignOutNavigator}
                options={{
                    drawerLabel: text.signOutScreen.title,
                    drawerIcon: ({ focused }) => <IconForButton name='sign-out' type='font-awesome'
                        iconStyle={[styles.iconPrimarySmall,
                        { color: (focused ? styles.brightColor.color : styles.bodyText.color) }]} />
                }}
            />
        </React.Fragment>
    )
}

const Drawer = createDrawerNavigator();
export function MainDrawerNavigator(props) {
    let drawerContent;
    let initialRouteName = "SignIn";


    //todo: check isEncrypted here and show login 

    if (props.auth.isInitialized !== true) {
        drawerContent = getFirstTimeUserScreens(); /* first time user (TODO: or maybe new phone? Think about restore flow maybe) */
    }
    else if (props.auth.isSignedIn === true) {
        drawerContent = getAuthenticatedUserScreens();
    }
    else {
        drawerContent = getSigninScreens(props);        
    }

    return (
        <Drawer.Navigator initialRouteName={initialRouteName} drawerContent={(config) =>
            <CustomDrawerContent {...config} userToken={props.userToken} signOut={props.signOut} />
        }>
            {drawerContent}
        </ Drawer.Navigator>
    );
}
