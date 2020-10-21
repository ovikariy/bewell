import { ErrorCode, ErrorMessage, StoreConstants } from './constants';
import * as SecurityHelpers from './securityHelpers';
import * as AsyncStorageService from './asyncStorageService';
import { consoleLogWithColor, consoleColors } from './helpers';
import { ItemBase, ItemBaseMultiArray } from './types';
import { AppError } from './appError';

export const getItemAsync = async (key: string) => {
    if (!key)
        throw new AppError(ErrorMessage.General, ErrorCode.MissingKey1);
    try {
        return await AsyncStorageService.getItem(key);
    }
    catch (error) {
        console.log(error);
        throw new AppError(ErrorMessage.General, ErrorCode.Storage1);
    }
};

export const getItemsAsync = async (keys: string[]) => {
    if (keys.length <= 0)
        throw new AppError(ErrorMessage.General, ErrorCode.MissingKey2);
    try {
        return await AsyncStorageService.multiGet(keys);
    }
    catch (error) {
        console.log(error);
        throw new AppError(ErrorMessage.General, ErrorCode.Storage1);
    }
};

export const setItemsAsync = async (key: string, value: string) => {
    if (!key)
        throw new AppError(ErrorMessage.UnableToSave, ErrorCode.MissingKey3);
    await setMultiItemsAsync([[key, value]]);
};

export const setMultiItemsAsync = async (items: [string, string][]) => {
    /* multiSet([['k1', 'val1'], ['k2', 'val2']]) */
    if (!items || !Array.isArray(items) || items.length <= 0)
        throw new AppError(ErrorMessage.UnableToSave, ErrorCode.MissingKey4);
    /* check items format and that each key is a type of string */
    items.forEach(item => {
        if (item.length < 2)
            throw new AppError(ErrorMessage.InvalidData, ErrorCode.Storage10);
    });
    try {
        await AsyncStorageService.multiSet(items);
    }
    catch (error) {
        console.log(error);
        throw new AppError(ErrorMessage.UnableToSave, ErrorCode.Storage3);
    }
};

export const finishSetupNewEncryptionAsync = async (keys: string[]) => {
    /* this is a one time run function that removes all unencrypted storage
    key/values (e.g. NOTES, MOODS) after they were copied into the newly encrypted key/values */
    if (!keys || !Array.isArray(keys) || keys.length <= 0)
        throw new AppError(ErrorMessage.General, ErrorCode.MissingKey5);
    try {
        await AsyncStorageService.multiRemove(keys);
    }
    catch (error) {
        console.log(error);
        throw new AppError(ErrorMessage.General, ErrorCode.Storage4);
    }
};

export const mergeByIdAsync = async (itemTypeName: string, newItems: ItemBase[]) => {
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
};

export const getAllStorageData = async () => {
    const hashedKeys = await SecurityHelpers.getAllHashedStoreKeys();
    hashedKeys.push(StoreConstants.DataEncryptionStoreKey); /* add DataEncryptionStoreKey separately because it's not hashed */
    hashedKeys.push(StoreConstants.SETTINGS); /* add SETTINGS separately because it's not hashed */
    return getItemsAsync(hashedKeys);
};

export const getMultiItemsAndDecryptAsync = async (keys: string[]): Promise<ItemBaseMultiArray> => {
    const hashedKeys = await SecurityHelpers.getMultipleHashedKeys(keys);
    const items = await getItemsAsync(hashedKeys);

    const decryptedItems = await SecurityHelpers.decryptAllItems(items);
    if (!decryptedItems || decryptedItems.length < 0)
        return [];

    /* now need to parse the values becase items is  [[stringKey1, stringValue1], [stringKey2, stringValue2], ....] */
    decryptedItems.forEach((item) => {
        if (item.length > 1 && item[1])
            item[1] = JSON.parse(item[1]);

    });

    return decryptedItems as ItemBaseMultiArray;
};

export const logStorageDataAsync = async () => {
    const items = await AsyncStorageService.multiGet(await AsyncStorageService.getAllKeys());
    consoleLogWithColor(consoleColors.green, '\r\nAll AsyncStorage Items:\r\n' + JSON.stringify(items));
};

export const getItemsAndDecryptAsync = async (key: string) => {
    if (!isValidStoreKey(key))
        throw new AppError(ErrorMessage.InvalidKey, ErrorCode.MissingKey9);
    const storeKey = await getStoreKeyHashAsync(key);
    const items = await getItemAsync(storeKey);
    const decryptedItems = await SecurityHelpers.decryptDataAsync(items);

    return decryptedItems ? JSON.parse(decryptedItems) : [];
};

export const setItemsAndEncryptAsync = async (key: string, items: any) => {
    if (!isValidStoreKey(key))
        throw new AppError(ErrorMessage.InvalidKey, ErrorCode.MissingKey8);
    const encrypted = await encryptAsync(JSON.stringify(items));
    const storeKey = await getStoreKeyHashAsync(key);
    await setItemsAsync(storeKey, encrypted);
};

export const getStoreKeyHashAsync = async (key: string) => {
    if (!isValidStoreKey(key))
        throw new AppError(ErrorMessage.InvalidKey, ErrorCode.MissingKey11);
    const storeKey = key.indexOf(StoreConstants.keyPrefix) < 0 ? StoreConstants.keyPrefix + key : key;
    /* the itemTypeName in storage is hashed with dataEncryptionKey */
    const itemTypeNameHash = await SecurityHelpers.getItemKeyHashAsync(storeKey);
    return itemTypeNameHash;
};

export const encryptAsync = (value: string) => {
    return SecurityHelpers.encryptDataAsync(value);
};

/**
 * @description Store key starts with "`@Morning:`" prefix followed by either a month/year in MMYYYY format or a wellknown key such as SETTINGS
 * e.g. "`@Morning:012019`" or "`@Morning:SETTINGS`"
 * @param key
 */
export const isValidStoreKey = (key: string) => {
    if (StoreConstants.keyPrefix + key === StoreConstants.SETTINGS || key === StoreConstants.SETTINGS)
        return true;
    return (StoreConstants.AllEncryptedStoreKeys.indexOf(StoreConstants.keyPrefix + key) >= 0 || StoreConstants.AllEncryptedStoreKeys.indexOf(key) >= 0);
};

export const getDataEncryptionStoreKey = async (): Promise<string | null> => {
    const dataEncryptionStoreKey = await getItemAsync(StoreConstants.DataEncryptionStoreKey);
    if (dataEncryptionStoreKey)
        return dataEncryptionStoreKey as string;
    return null;
};