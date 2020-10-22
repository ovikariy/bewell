import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export interface ItemBase {
    id: string;
    date: string;
}

/**
 * @example:
 *  ```
 * {"Morning:SETTINGS":[{"id":"language","date":"2020-09-03T08:43:22.617Z","value":"en"},{"id":"theme","date":"2020-09-15T07:05:39.937Z","value":"light"}]}
 *  ```
 */
export type ItemBaseAssociativeArray = { [key: string]: ItemBase[] };

/**
 * @example
 * ```
 * ["Morning:SETTINGS",[{"id":"language","date":"2020-09-03T08:43:22.617Z","value":"en"},{"id":"theme","date":"2020-09-15T07:05:39.937Z","value":"light"}]]
 * ```
 */
export type ItemBaseMultiArrayElement = [string, ItemBase[]];

/**
 * @example
 * ```
 * [["Morning:SETTINGS",[{"id":"language","date":"2020-09-03T08:43:22.617Z","value":"en"},{"id":"theme","date":"2020-09-15T07:05:39.937Z","value":"light"}]]]
 * ```
 * */
export type ItemBaseMultiArray = ItemBaseMultiArrayElement[];

export interface SettingType extends ItemBase {
    value?: string
}

/**
 * Stack navigation parameter list
 */
export type RootStackParamList = {
    Backup: undefined
    BackupRestore: undefined
    Home: undefined
    Insights: undefined
    ItemHistory: { itemType: string, title: string }
    Password: undefined
    Profile: { userId: string }
    Restore: undefined
    Settings: undefined
    SetupPassword: undefined
    SetupPIN: undefined
    SignIn: undefined
    SignOut: undefined
    SystemSettings: undefined
    Welcome: undefined
};

/**
 * Base type for a Screen 'navigation' property
 */
export type AppNavigationProp<RouteName extends keyof RootStackParamList> = StackNavigationProp<RootStackParamList, RouteName>;
export type AppRouteProp<RouteName extends keyof RootStackParamList> = RouteProp<RootStackParamList, RouteName>;