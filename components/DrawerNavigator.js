import * as React from 'react';
import { View, Image, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { styles } from '../assets/styles/style';
import { text } from '../modules/Constants';
import { IconForButton } from './MiscComponents';

import HomeScreen from '../screens/HomeScreen';
import ItemHistoryScreen from '../screens/ItemHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PasswordScreen from '../screens/PasswordScreen';
import BackupRestoreScreen from '../screens/BackupRestore';
import InsightsScreen from '../screens/InsightsScreen';

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
                    headerRight: () => <Image source={require('../assets/images/logo_small.png')} style={[styles.logoImageSmall, {marginRight: 10}]}
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

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView style={styles.menuBackground} {...props}>
            <View style={[styles.flex, styles.rowContainer, { marginBottom: 20 }]}>
                <Image source={require('../assets/images/logo_small.png')} style={[styles.logoImage, { marginRight: 15 }]} />
                <Text style={styles.heading}>{text.homeScreen.title}</Text>
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

const Drawer = createDrawerNavigator();
export function MainDrawerNavigator() {
    return (
        <Drawer.Navigator initialRouteName="Home" drawerContent={props => <CustomDrawerContent {...props} />} >
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
        </ Drawer.Navigator>
    );
}