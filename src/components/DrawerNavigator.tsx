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
import { dimensions, platform, sizes } from '../assets/styles/style';
import { images } from '../modules/constants';
import DayViewScreen from '../screens/DayViewScreen';
import CustomizeScreen from '../screens/Customize';
import CustomizeSettingScreen from '../screens/CustomizeSettingScreen';
import CustomizeWidgetsScreen from '../screens/CustomizeWidgetsScreen';

const MenuHeaderButton = (props: { navigation: any }) => {
    const context = React.useContext(AppContext);
    const styles = context.styles;

    return <Icon name='menu' iconStyle={styles.iconPrimary} underlayColor={'transparent'} containerStyle={{ marginLeft: sizes[16] }}
        color={styles.bodyText.color} onPress={() => props.navigation.toggleDrawer()} />;
};

const LogoImage = () => {
    const context = React.useContext(AppContext);
    const theme = context.theme;
    const styles = context.styles;

    return <Image source={images['logo_small_' + theme.id]} style={[styles.logoImageSmall, { marginRight: sizes[10] }]} />;
};

const ScreenNavOptions = (styles: any): StackNavigationOptions => {
    return {
        headerStyle: { borderWidth: 0 },
        headerTitleStyle: styles.heading,
        headerTitleAlign: 'center',
        headerStatusBarHeight: platform.OS === 'ios' ? 0 : dimensions.safeAreaAndroidPadding,
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
            <HomeStack.Screen
                name='DayView'
                component={DayViewScreen}
                options={({ route, navigation }) => ({
                    title: language.yourWellbeing
                })}
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
            <InsightsStack.Screen
                name='DayView'
                component={DayViewScreen}
                options={({ route, navigation }) => ({
                    title: language.yourWellbeing
                })}
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
                name='Password'
                component={PasswordScreen}
                options={{ title: language.password }}
            />
            <SettingsStack.Screen
                name='SetupPIN'
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
            <SettingsStack.Screen
                name='Customize'
                component={CustomizeScreen}
                options={{ title: language.customize }}
            />
            <SettingsStack.Screen
                name='CustomizeSetting'
                component={CustomizeSettingScreen}
                options={CustomizeSettingScreen.getNavigationOptions} /* dynamic nav options in the component */
            />
            <SettingsStack.Screen
                name='CustomizeWidgets'
                component={CustomizeWidgetsScreen}
                options={{ title: language.widgetOrder }}
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
    const theme = context.theme;

    return (
        <DrawerContentScrollView style={styles.drawerBackground} {...props}>
            <View style={[styles.drawerHeaderContainer, platform.OS === 'ios' ? { marginTop: 0 } : { marginTop: sizes[20] }]}>
                <Image source={images['logo_' + theme.id]} style={[styles.logoImage, { marginLeft: sizes[10] }]} />
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
