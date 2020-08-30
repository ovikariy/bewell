
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
export type ItemBaseAssociativeArray = { [key: string]: ItemBase[] }

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