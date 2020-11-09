import { ErrorCode, ErrorMessage, StoreConstants } from './constants';
import * as securityService from './securityService';
import { consoleLogWithColor, consoleColors } from './utils';
import { AppError, ItemBase, ItemBaseMultiArray } from './types';
import { AsyncStorage } from 'react-native';

export async function getItemAsync(key: string) {
    if (!key)
        throw new AppError(ErrorMessage.General, ErrorCode.MissingKey1);
    try {
        return await asyncStorageService.getItem(key);
    }
    catch (error) {
        consoleLogWithColor(error);
        throw new AppError(ErrorMessage.General, ErrorCode.Storage1);
    }
}

export async function getItemsAsync(keys: string[]) {
    if (keys.length <= 0)
        throw new AppError(ErrorMessage.General, ErrorCode.MissingKey2);
    try {
        return await asyncStorageService.multiGet(keys);
    }
    catch (error) {
        consoleLogWithColor(error);
        throw new AppError(ErrorMessage.General, ErrorCode.Storage1);
    }
}

// TODO: rename to setItem
export async function setItemAsync(key: string, value: string) {
    if (!key)
        throw new AppError(ErrorMessage.UnableToSave, ErrorCode.MissingKey3);
    await setMultiItemsAsync([[key, value]]);
}

export async function setMultiItemsAsync(items: [string, string][]) {
    /* multiSet([['k1', 'val1'], ['k2', 'val2']]) */
    if (!items || !Array.isArray(items) || items.length <= 0)
        throw new AppError(ErrorMessage.UnableToSave, ErrorCode.MissingKey4);
    /* check items format and that each key is a type of string */
    items.forEach(item => {
        if (item.length < 2)
            throw new AppError(ErrorMessage.InvalidData, ErrorCode.Storage10);
        if (typeof (item[0]) !== 'string')
            throw new AppError(ErrorMessage.InvalidKey, ErrorCode.Storage12);
    });
    try {
        await asyncStorageService.multiSet(items);
    }
    catch (error) {
        consoleLogWithColor(error);
        throw new AppError(ErrorMessage.UnableToSave, ErrorCode.Storage3);
    }
}

export async function finishSetupNewEncryptionAsync(keys: string[]) {
    /* this is a one time run function that removes all unencrypted storage
    key/values (e.g. NOTES, MOODS) after they were copied into the newly encrypted key/values */
    if (!keys || !Array.isArray(keys) || keys.length <= 0)
        throw new AppError(ErrorMessage.General, ErrorCode.MissingKey5);
    try {
        await asyncStorageService.multiRemove(keys);
    }
    catch (error) {
        consoleLogWithColor(error);
        throw new AppError(ErrorMessage.General, ErrorCode.Storage4);
    }
}

export async function mergeByIdAsync(itemTypeName: string, newItems: ItemBase[]) {
    if (!newItems || !Array.isArray(newItems) || newItems.length <= 0)
        throw new AppError(ErrorMessage.UnableToSave, ErrorCode.Storage5);

    const oldItems = await getItemsAndDecryptAsync(itemTypeName);

    /* if item has ID then overwrite, otherwise add */
    (newItems).forEach(newItem => {
        if (!newItem.id)
            throw new AppError(ErrorMessage.UnableToSave, ErrorCode.Storage6);
        const oldItemIndex = oldItems.findIndex((oldItem: any) => oldItem.id === newItem.id);
        if (oldItemIndex > -1)
            oldItems[oldItemIndex] = newItem;

        else
            oldItems.push(newItem);
    });

    await setItemsAndEncryptAsync(itemTypeName, oldItems);
    return oldItems;
}

export async function getAllStorageDataAsync() {
    const hashedKeys = await securityService.getAllHashedStoreKeysAsync();
    hashedKeys.push(StoreConstants.DataEncryptionStoreKey); /* add DataEncryptionStoreKey separately because it's not hashed */
    hashedKeys.push(StoreConstants.SETTINGS); /* add SETTINGS separately because it's not hashed */
    return getItemsAsync(hashedKeys);
}

export async function getMultiItemsAndDecryptAsync(keys: string[]): Promise<ItemBaseMultiArray> {
    const hashedKeys = await securityService.getMultipleHashedKeysAsync(keys);
    const items = await getItemsAsync(hashedKeys);

    const decryptedItems = await securityService.decryptAllItemsAsync(items);
    if (!decryptedItems || decryptedItems.length < 0)
        return [];

    /* now need to parse the values becase items is  [[stringKey1, stringValue1], [stringKey2, stringValue2], ....] */
    decryptedItems.forEach((item) => {
        if (item.length > 1 && item[1])
            item[1] = JSON.parse(item[1]);

    });

    return decryptedItems as ItemBaseMultiArray;
}

export async function logStorageDataAsync() {
    const items = await asyncStorageService.multiGet(await asyncStorageService.getAllKeys());
    consoleLogWithColor('\r\nAll AsyncStorage Items:\r\n' + JSON.stringify(items), consoleColors.green);
}

export async function getItemsAndDecryptAsync(key: string) {
    if (!isValidStoreKey(key))
        throw new AppError(ErrorMessage.InvalidKey, ErrorCode.MissingKey9);
    const storeKey = await getStoreKeyHashAsync(key);
    const items = await getItemAsync(storeKey);
    const decryptedItems = securityService.decryptData(items);

    return decryptedItems ? JSON.parse(decryptedItems) : [];
}

export async function setItemsAndEncryptAsync(key: string, items: any) {
    if (!isValidStoreKey(key))
        throw new AppError(ErrorMessage.InvalidKey, ErrorCode.MissingKey8);
    const encrypted = encrypt(JSON.stringify(items));
    const storeKey = await getStoreKeyHashAsync(key);
    await setItemAsync(storeKey, encrypted);
}

export async function getStoreKeyHashAsync(key: string) {
    if (!isValidStoreKey(key))
        throw new AppError(ErrorMessage.InvalidKey, ErrorCode.MissingKey11);
    const storeKey = key.indexOf(StoreConstants.keyPrefix) < 0 ? StoreConstants.keyPrefix + key : key;
    /* the itemTypeName in storage is hashed with dataEncryptionKey */
    const itemTypeNameHash = securityService.getItemKeyHash(storeKey);
    return itemTypeNameHash;
}

export function encrypt(value: string) {
    return securityService.encryptData(value);
}

/**
 * @description Store key starts with "bewellapp_" prefix followed by either a month/year in MMYYYY format or a wellknown key such as SETTINGS
 * e.g. "bewellapp_012019" or "bewellapp_SETTINGS"
 * @param key
 */
export function isValidStoreKey(key: string) {
    if (StoreConstants.keyPrefix + key === StoreConstants.SETTINGS || key === StoreConstants.SETTINGS)
        return true;
    return (StoreConstants.AllEncryptedStoreKeys.indexOf(StoreConstants.keyPrefix + key) >= 0 || StoreConstants.AllEncryptedStoreKeys.indexOf(key) >= 0);
}

export async function getDataEncryptionStoreKeyAsync(): Promise<string | null> {
    const dataEncryptionStoreKey = await getItemAsync(StoreConstants.DataEncryptionStoreKey);
    if (dataEncryptionStoreKey)
        return dataEncryptionStoreKey as string;
    return null;
}

export const asyncStorageService = {
    getItem(key: string) {
        return AsyncStorage.getItem(key);
    },
    multiGet(keys: string[]) {
        return AsyncStorage.multiGet(keys);
    },
    multiSet(items: string[][]) {
        return AsyncStorage.multiSet(items);
    },
    multiRemove(keys: string[]) {
        return AsyncStorage.multiRemove(keys);
    },
    getAllKeys() {
        return AsyncStorage.getAllKeys();
    }
};