import * as React from 'react';
import { View, Image, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, DrawerContentComponentProps, DrawerContentOptions } from '@react-navigation/drawer';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { IconForButton } from './MiscComponents';
import { AppContext } from '../modules/appContext';
import HomeScreen from '../screens/HomeScreen';
import ItemHistoryScreen from '../screens/ItemHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SystemSettingsScreen from '../screens/SystemSettingsScreen';
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
import { AuthState } from '../redux/reducerTypes';

const MenuHeaderButton = (props: { navigation: any }) => {
    const context = React.useContext(AppContext);
    const styles = context.styles;

    return <Icon name='menu' size={30} containerStyle={{ margin: 16 }}
        color={styles.bodyText.color} onPress={() => props.navigation.toggleDrawer()} />;
};

const LogoImage = () => {
    const context = React.useContext(AppContext);
    const styles = context.styles;

    return <Image source={require('../assets/images/logo_small.png')} tintColor={styles.toolbarContainer.backgroundColor} style={[styles.logoImageSmall, { marginRight: 10 }]} />;
};

const ScreenNavOptions = (styles: any): StackNavigationOptions => {
    return {
        headerStyle: { borderWidth: 0 },
        headerTitleStyle: styles.heading,
        headerTitleAlign: 'center',
        headerTransparent: true,
        headerTintColor: styles.heading.color
    };
};

const WelcomeStack = createStackNavigator();
function WelcomeNavigator() {
    const context = React.useContext(AppContext);
    const styles = context.styles;

    return (
        <WelcomeStack.Navigator initialRouteName='Welcome' screenOptions={ScreenNavOptions(styles)} >
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
    const context = React.useContext(AppContext);
    const language = context.language;
    const styles = context.styles;

    return (
        <HomeStack.Navigator initialRouteName='Home' screenOptions={ScreenNavOptions(styles)} >
            <HomeStack.Screen
                name='Home'
                component={HomeScreen}
                options={({ route, navigation }) => ({
                    title: language.yourWellbeing,
                    headerLeft: () => <MenuHeaderButton navigation={navigation} />,
                    headerRight: () => <LogoImage />
                })}
            />
            <HomeStack.Screen
                name='ItemHistory'
                component={ItemHistoryScreen}
                options={ItemHistoryScreen.getNavigationOptions}
            /* dynamic nav options in the component */
            />
        </HomeStack.Navigator>
    );
}

const InsightsStack = createStackNavigator();
function InsightsNavigator() {
    const context = React.useContext(AppContext);
    const language = context.language;
    const styles = context.styles;

    return (
        <InsightsStack.Navigator initialRouteName='Insights' screenOptions={ScreenNavOptions(styles)} >
            <InsightsStack.Screen
                name='Insights'
                component={InsightsScreen}
                options={({ route, navigation }) => ({
                    title: language.history,
                    headerLeft: () => <MenuHeaderButton navigation={navigation} />,
                    headerRight: () => <LogoImage />
                })}
            />
            <InsightsStack.Screen
                name='ItemHistory'
                component={ItemHistoryScreen}
                options={ItemHistoryScreen.getNavigationOptions} /* dynamic nav options in the component */
            />
        </InsightsStack.Navigator>
    );
}

const SettingsStack = createStackNavigator();
function SettingsNavigator() {
    const context = React.useContext(AppContext);
    const language = context.language;
    const styles = context.styles;

    return (
        <SettingsStack.Navigator initialRouteName='Settings' screenOptions={ScreenNavOptions(styles)} >
            <SettingsStack.Screen
                name='Settings'
                component={SettingsScreen}
                options={({ route, navigation }) => ({
                    title: language.settings,
                    headerLeft: () => <MenuHeaderButton navigation={navigation} />,
                    headerRight: () => <LogoImage />
                })}
            />
            <SettingsStack.Screen
                name='SystemSettings'
                component={SystemSettingsScreen}
                options={{ title: language.system, }}
            />
            <SettingsStack.Screen
                name='Password'
                component={PasswordScreen}
                options={{ title: language.password }}
            />
            <SettingsStack.Screen
                name='SetupPINScreen'
                component={SetupPINScreen}
                options={{ title: language.pinLock }}
            />
            <SettingsStack.Screen
                name='BackupRestore'
                component={BackupRestoreScreen}
                options={{ title: language.importExport }}
            />
            <SettingsStack.Screen
                name='Restore'
                component={RestoreScreen}
                options={{ title: language.import }}
            />
            <SettingsStack.Screen
                name='Backup'
                component={BackupScreen}
                options={{ title: language.export }}
            />
        </SettingsStack.Navigator>
    );
}

const SignOutStack = createStackNavigator();
function SignOutNavigator() {
    const context = React.useContext(AppContext);
    const language = context.language;
    const styles = context.styles;

    return (
        <SignOutStack.Navigator initialRouteName='SignOut' screenOptions={ScreenNavOptions(styles)} >
            <SignOutStack.Screen
                name='SignOut'
                component={SignOutScreen}
                options={({ route, navigation }) => ({
                    title: language.signOut,
                    headerLeft: () => <MenuHeaderButton navigation={navigation} />,
                    headerRight: () => <LogoImage />
                })}
            />
        </SignOutStack.Navigator>
    );
}

function CustomDrawerContent(props: DrawerContentComponentProps<DrawerContentOptions>) {
    const context = React.useContext(AppContext);
    const language = context.language;
    const styles = context.styles;

    return (
        <DrawerContentScrollView style={styles.drawerBackground} {...props}>
            <View style={[styles.flex, styles.rowContainer, { marginBottom: 20 }]}>
                <LogoImage />
                <Text style={styles.heading}>{language.appName}</Text>
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

function getSigninScreens() {
    return (
        <React.Fragment>
            <Drawer.Screen name='SignIn'
                component={SignInScreen}
                options={({ route, navigation }) => ({
                    title: ''
                })}
            />
        </React.Fragment>
    );
}

function getFirstTimeUserScreens() {
    return (
        <React.Fragment>
            <Drawer.Screen name="Welcome" component={WelcomeNavigator} />
        </React.Fragment>
    );
}

function getAuthenticatedUserScreens() {
    const context = React.useContext(AppContext);
    const language = context.language;
    const styles = context.styles;

    return (
        <React.Fragment>
            <Drawer.Screen name="Home" component={HomeNavigator}
                options={{
                    drawerLabel: language.home,
                    drawerIcon: ({ focused }) => <IconForButton name='home'
                        iconStyle={{
                            ...styles.iconPrimarySmall,
                            ...{ color: (focused ? styles.brightColor.color : styles.bodyText.color) }
                        }}
                    />
                }}
            />
            <Drawer.Screen name="Insights" component={InsightsNavigator}
                options={{
                    drawerLabel: language.history,
                    drawerIcon: ({ focused }) => <IconForButton name='history' type='font-awesome'
                        iconStyle={{
                            ...styles.iconPrimarySmall,
                            ...{ color: (focused ? styles.brightColor.color : styles.bodyText.color) }
                        }}
                    />
                }}
            />
            <Drawer.Screen name="Settings" component={SettingsNavigator}
                options={{
                    drawerLabel: language.settings,
                    drawerIcon: ({ focused }) => <IconForButton name='sliders' type='font-awesome'
                        iconStyle={{
                            ...styles.iconPrimarySmall,
                            ...{ color: (focused ? styles.brightColor.color : styles.bodyText.color) }
                        }}
                    />
                }}
            />
            <Drawer.Screen name="SignOut" component={SignOutNavigator}
                options={{
                    drawerLabel: language.signOut,
                    drawerIcon: ({ focused }) => <IconForButton name='sign-out' type='font-awesome'
                        iconStyle={{
                            ...styles.iconPrimarySmall,
                            ...{ color: (focused ? styles.brightColor.color : styles.bodyText.color) }
                        }}
                    />
                }}
            />
        </React.Fragment>
    );
}

interface MainDrawerNavigatorProps {
    auth: AuthState
}

const Drawer = createDrawerNavigator();
export function MainDrawerNavigator(props: MainDrawerNavigatorProps) {
    let drawerContent;
    const initialRouteName = "SignIn";

    if (props.auth.isInitialized !== true)
        drawerContent = getFirstTimeUserScreens();

    else if (props.auth.isSignedIn === true)
        drawerContent = getAuthenticatedUserScreens();

    else
        drawerContent = getSigninScreens();


    return (
        <Drawer.Navigator initialRouteName={initialRouteName} drawerContent={(config) =>
            <CustomDrawerContent {...config} />
        }>
            {drawerContent}
        </ Drawer.Navigator>
    );
}
