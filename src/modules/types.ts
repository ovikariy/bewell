import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export class AppError extends Error {
    readonly code?: string;

    constructor(message: string, code?: string) {
        super(message);
        this.code = code;
    }
}

/** WidgetBaseFields are basic fields, if no other fields are filled on an object then it's empty */
export enum WidgetBaseFields { id = 'id', date = 'date', dateCreated = 'dateCreated', type = 'type' };
export interface ItemBase {
    [WidgetBaseFields.id]: string;
    [WidgetBaseFields.date]: string;
    [WidgetBaseFields.dateCreated]: string;  /** putting this field here, might be useful for sorting in the future but early pre-production records might not have dateCreated */
}

/**
 * @example
 * {"bewellapp_SETTINGS":[{"id":"language","date":"2020-09-03T08:43:22.617Z","value":"en"},{"id":"theme","date":"2020-09-15T07:05:39.937Z","value":"light"}]}
 */
export type ItemBaseAssociativeArray = { [key: string]: ItemBase[] };

/**
 * @example
 * ["bewellapp_SETTINGS",[{"id":"language","date":"2020-09-03T08:43:22.617Z","value":"en"},{"id":"theme","date":"2020-09-15T07:05:39.937Z","value":"light"}]]
 */
export type ItemBaseMultiArrayElement = [string, ItemBase[]];

/**
 * @example
 * [["bewellapp_SETTINGS",[{"id":"language","date":"2020-09-03T08:43:22.617Z","value":"en"},{"id":"theme","date":"2020-09-15T07:05:39.937Z","value":"light"}]]]
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
    DayView: { date: string }
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
    Welcome: undefined
};

/**
 * Base type for a Screen 'navigation' property
 */
export type AppNavigationProp<RouteName extends keyof RootStackParamList> = StackNavigationProp<RootStackParamList, RouteName>;
export type AppRouteProp<RouteName extends keyof RootStackParamList> = RouteProp<RootStackParamList, RouteName>;

/**
 * Useful when importing user data
 */
export interface ImportInfo {
    data: [string, string][] | string;
    images: ImageInfoAssocArray
}

/**
 * Useful when importing/exporting user images
 */
export interface ImageInfoAssocArray {
    [key: string]: string  /** { path-to-image-or-filename: base64-content } */
}