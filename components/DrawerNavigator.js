import * as React from 'react';
import { View, Image, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { styles } from '../assets/styles/style';
import { text } from '../modules/Constants';
import { isNullOrEmpty } from '../modules/helpers';
import { IconForButton, IconButton } from './MiscComponents';

import HomeScreen from '../screens/HomeScreen';
import ItemHistoryScreen from '../screens/ItemHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PasswordScreen from '../screens/PasswordScreen';
import BackupRestoreScreen from '../screens/BackupRestore';
import InsightsScreen from '../screens/InsightsScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignOutScreen from '../screens/SignOutScreen';
import SetupSecurityScreen from '../screens/SetupSecurityScreen';
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
                name='SetupSecurity'
                component={SetupSecurityScreen}
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
            <SettingsStack.Screen
                name='BackupRestore'
                component={BackupRestoreScreen}
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
    );
}

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView style={styles.menuBackground} {...props}>
            <View style={[styles.flex, styles.rowContainer, { marginBottom: 20 }]}>
                <Image source={require('../assets/images/logo_small.png')} style={[styles.logoImage, { marginRight: 15 }]} />
                <Text style={styles.heading}>{text.app.title}</Text>
            </View>
            <DrawerItemList itemStyle={[styles.drawerItem]}
                labelStyle={[styles.drawerLabel]}
                activeTintColor={styles.bodyTextBright.color}
                inactiveTintColor={styles.bodyText.color}
                activeBackgroundColor={styles.toolbarContainer.backgroundColor}
                {...props} />
        </DrawerContentScrollView>
    );
}

function getPasswordSigninScreens() {
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

function getSetupSecurityScreens() {
    return (
        <React.Fragment>
            <Drawer.Screen name="SetupSecurityScreen" component={SetupSecurityScreen} />
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
                        { color: (focused ? styles.bodyTextBright.color : styles.bodyText.color) }]} />
                }}
            />
            <Drawer.Screen name="Insights" component={InsightsNavigator}
                options={{
                    drawerLabel: text.insightsScreen.title,
                    drawerIcon: ({ focused }) => <IconForButton name='history' type='font-awesome'
                        iconStyle={[styles.iconPrimarySmall,
                        { color: (focused ? styles.bodyTextBright.color : styles.bodyText.color) }]} />
                }}
            />
            <Drawer.Screen name="Settings" component={SettingsNavigator}
                options={{
                    drawerLabel: text.settingsScreen.title,
                    drawerIcon: ({ focused }) => <IconForButton name='sliders' type='font-awesome'
                        iconStyle={[styles.iconPrimarySmall,
                        { color: (focused ? styles.bodyTextBright.color : styles.bodyText.color) }]} />
                }}
            />
            <Drawer.Screen name="SignOut" component={SignOutNavigator}
                options={{
                    drawerLabel: text.signOutScreen.title,
                    drawerIcon: ({ focused }) => <IconForButton name='sign-out' type='font-awesome'
                        iconStyle={[styles.iconPrimarySmall,
                        { color: (focused ? styles.bodyTextBright.color : styles.bodyText.color) }]} />
                }}
            />
        </React.Fragment>
    )
}



const Drawer = createDrawerNavigator();
export function MainDrawerNavigator(props) {
    let drawerContent;
    let initialRouteName = "Home";

    //return testScreens(props);

    console.log('MainDrawerNavigator ' + JSON.stringify(props.auth));

    if (props.auth.isInitialized !== true) {
        drawerContent = getFirstTimeUserScreens(); /* first time user (TODO: or maybe new phone? Think about restore flow maybe) */
    }
    else if (props.auth.isDataEncrypted === true && props.auth.isSignedIn !== true) {
        drawerContent = getPasswordSigninScreens();
    }
    else if (props.auth.isSignedIn !== true && props.auth.isSkippedSecuritySetup !== true) {
        drawerContent = getSetupSecurityScreens();
    }
    else
        drawerContent = getAuthenticatedUserScreens();

    return (
        <Drawer.Navigator initialRouteName={initialRouteName} drawerContent={(config) =>
            <CustomDrawerContent {...config} userToken={props.userToken} signOut={props.signOut} />
        }>
            {drawerContent}
        </ Drawer.Navigator>
    );
}

//TODO: below funcitons for testing
function testScreens(props) {
    let drawerContent;
    let initialRouteName = "SetupSecurity";
    drawerContent = getAllScreensForTesting();

    return (
        <Drawer.Navigator initialRouteName={initialRouteName} drawerContent={(config) =>
            <CustomDrawerContent {...config} userToken={props.userToken} signOut={props.signOut} />
        }>
            {drawerContent}
        </ Drawer.Navigator>
    );
}

function getAllScreensForTesting() {
    return (
        <React.Fragment>
            <Drawer.Screen name="Welcome" component={WelcomeNavigator}
                options={{
                    drawerLabel: text.welcomeScreen.menuLabel,
                    drawerIcon: ({ focused }) => <IconForButton name='lock-open'
                        iconStyle={[styles.iconPrimarySmall,
                        { color: (focused ? styles.bodyTextBright.color : styles.bodyText.color) }]} />
                }}
            />
            <Drawer.Screen name="SetupSecurity" component={SetupSecurityScreen}
                options={{
                    drawerLabel: text.setupSecurityScreen.menuLabel,
                    drawerIcon: ({ focused }) => <IconForButton name='lock-open'
                        iconStyle={[styles.iconPrimarySmall,
                        { color: (focused ? styles.bodyTextBright.color : styles.bodyText.color) }]} />
                }}
            />
            <Drawer.Screen name="SetupPIN" component={SetupPINScreen}
                options={{
                    drawerLabel: text.setupPINScreen.menuLabel,
                    drawerIcon: ({ focused }) => <IconForButton name='lock-open'
                        iconStyle={[styles.iconPrimarySmall,
                        { color: (focused ? styles.bodyTextBright.color : styles.bodyText.color) }]} />
                }}
            />
            <Drawer.Screen name="Home" component={HomeNavigator}
                options={{
                    drawerLabel: text.homeScreen.menuLabel,
                    drawerIcon: ({ focused }) => <IconForButton name='home'
                        iconStyle={[styles.iconPrimarySmall,
                        { color: (focused ? styles.bodyTextBright.color : styles.bodyText.color) }]} />
                }}
            />
            <Drawer.Screen name="Insights" component={InsightsNavigator}
                options={{
                    drawerLabel: text.insightsScreen.title,
                    drawerIcon: ({ focused }) => <IconForButton name='history' type='font-awesome'
                        iconStyle={[styles.iconPrimarySmall,
                        { color: (focused ? styles.bodyTextBright.color : styles.bodyText.color) }]} />
                }}
            />
            <Drawer.Screen name="Settings" component={SettingsNavigator}
                options={{
                    drawerLabel: text.settingsScreen.title,
                    drawerIcon: ({ focused }) => <IconForButton name='sliders' type='font-awesome'
                        iconStyle={[styles.iconPrimarySmall,
                        { color: (focused ? styles.bodyTextBright.color : styles.bodyText.color) }]} />
                }}
            />
            <Drawer.Screen name="SignOut" component={SignOutNavigator}
                options={{
                    drawerLabel: text.signOutScreen.title,
                    drawerIcon: ({ focused }) => <IconForButton name='sign-out' type='font-awesome'
                        iconStyle={[styles.iconPrimarySmall,
                        { color: (focused ? styles.bodyTextBright.color : styles.bodyText.color) }]} />
                }}
            />
        </React.Fragment>
    )
}
