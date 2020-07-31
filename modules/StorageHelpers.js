import { ErrorCodes, Errors, storeConstants } from './Constants';
import * as SecurityHelpers from './SecurityHelpers';
import * as AsyncStorageService from './AsyncStorageService';
import { consoleLogWithColor, consoleColors } from './helpers';

export const getItemsAsync = async (keyOrKeys) => {
    if (!keyOrKeys)
        throw [Errors.General, ErrorCodes.MissingKey1];
    if (Array.isArray(keyOrKeys) && keyOrKeys.length <= 0)
        throw [Errors.General, ErrorCodes.MissingKey2];
    try {
        if (Array.isArray(keyOrKeys))
            return await AsyncStorageService.multiGet(keyOrKeys);
        else
            return await AsyncStorageService.getItem(keyOrKeys);
    } catch (error) {
        console.log(error);
        throw [Errors.General, ErrorCodes.Storage1];
    }
}

export const setItemsAsync = async (key, value) => {
    if (!key)
        throw [Errors.UnableToSave, ErrorCodes.MissingKey3];
    await setMultiItemsAsync([[key, value]]);
}

export const setMultiItemsAsync = async (items) => {
    /* multiSet([['k1', 'val1'], ['k2', 'val2']]) */
    if (!items || !Array.isArray(items) || items.length <= 0)
        throw [Errors.UnableToSave, ErrorCodes.MissingKey4];
    /* check items format and that each key is a type of string */
    items.forEach(item => {
        if (item.length < 2 || typeof item[0] != 'string')
            throw [Errors.InvalidData, ErrorCodes.Storage10];
    })
    try {
        await AsyncStorageService.multiSet(items);
    } catch (error) {
        console.log(error);
        throw [Errors.UnableToSave, ErrorCodes.Storage3];
    }
}

export const finishSetupNewEncryptionAsync = async (keys) => {
    /* this is a one time run function that removes all unencrypted storage 
    key/values (e.g. NOTES, MOODS) after they were copied into the newly encrypted key/values */
    if (!keys || !Array.isArray(keys) || keys.length <= 0)
        throw [Errors.General, ErrorCodes.MissingKey5];
    keys.forEach(key => {
        if (typeof key != 'string')
            throw [Errors.InvalidData, ErrorCodes.Storage11];
    })
    try {
        await AsyncStorageService.multiRemove(keys);
    } catch (error) {
        console.log(error);
        throw [Errors.General, ErrorCodes.Storage4];
    }
}

export const mergeByIdAsync = async (itemTypeName, newItems) => {
    if (!newItems || !Array.isArray(newItems) || newItems.length <= 0)
        throw [Errors.UnableToSave, ErrorCodes.Storage5];

    const oldItems = await getItemsAndDecryptAsync(itemTypeName);

    /* if item has ID then overwrite, otherwise add */
    (newItems).forEach(newItem => {
        if (!newItem.id)
            throw [Errors.UnableToSave, ErrorCodes.Storage6];
        const oldItemIndex = oldItems.findIndex(oldItem => oldItem.id === newItem.id);
        if (oldItemIndex > -1)
            oldItems[oldItemIndex] = newItem;
        else
            oldItems.push(newItem);
    });

    await setItemsAndEncryptAsync(itemTypeName, oldItems);
    return oldItems;
}

export const getAllStorageData = async () => {
    const hashedKeys = await SecurityHelpers.getAllHashedStoreKeys();
    hashedKeys.push(storeConstants.DataEncryptionStoreKey); /* add DataEncryptionStoreKey separately because it's not hashed */
    hashedKeys.push(storeConstants.SETTINGS); /* add SETTINGS separately because it's not hashed */
    return await getItemsAsync(hashedKeys);
}

export const getMultiItemsAndDecryptAsync = async (keys) => {
    const hashedKeys = await SecurityHelpers.getMultipleHashedKeys(keys);
    const items = await getItemsAsync(hashedKeys);

    if (!items || items.length < 0)
        return [];
    const decryptedItems = await SecurityHelpers.decryptAllItems(items);

    if (!decryptedItems || decryptedItems.length < 0)
        return [];

    /* now need to parse the values becase items is  [[stringKey1, stringValue1], [stringKey2, stringValue2], ....] */
    decryptedItems.forEach((item) => {
        if (item.length > 1 && item[1]) {
            item[1] = JSON.parse(item[1]);
        }
    });

    return decryptedItems;
}

export const logStorageDataAsync = async () => {
    const items = await AsyncStorageService.multiGet(await AsyncStorageService.getAllKeys());
    consoleLogWithColor(consoleColors.green, '\r\nAll AsyncStorage Items:\r\n' + JSON.stringify(items));
}

export const getItemsAndDecryptAsync = async (key) => {
    if (!isValidStoreKey(key))
        throw [Errors.InvalidKey, ErrorCodes.MissingKey9];
    const storeKey = await getStoreKeyHashAsync(key);
    const items = await getItemsAsync(storeKey);
    const decryptedItems = await SecurityHelpers.decryptDataAsync(items);

    return decryptedItems ? JSON.parse(decryptedItems) : [];
}

export const setItemsAndEncryptAsync = async (key, items) => {
    if (!isValidStoreKey(key))
        throw [Errors.InvalidKey, ErrorCodes.MissingKey8];
    const encrypted = await encryptAsync(JSON.stringify(items));
    const storeKey = await getStoreKeyHashAsync(key);
    await setItemsAsync(storeKey, encrypted);
}

export const getStoreKeyHashAsync = async (key) => {
    if (!isValidStoreKey(key))
        throw [Errors.InvalidKey, ErrorCodes.MissingKey11];
    const storeKey = key.indexOf(storeConstants.keyPrefix) < 0 ? storeConstants.keyPrefix + key : key;
    /* the itemTypeName in storage is hashed with dataEncryptionKey */
    const itemTypeNameHash = await SecurityHelpers.getItemKeyHashAsync(storeKey);
    return itemTypeNameHash;
}

export const encryptAsync = async (items) => {
    return await SecurityHelpers.encryptDataAsync(items);
}

export const isValidStoreKey = (key) => {
    if (storeConstants.keyPrefix + key == storeConstants.SETTINGS || key ==storeConstants.SETTINGS)
        return true;
    return (storeConstants.AllEncryptedStoreKeys.indexOf(storeConstants.keyPrefix + key) >= 0 || storeConstants.AllEncryptedStoreKeys.indexOf(key) >= 0);
}

export const getDataEncryptionStoreKey = async () => {
    return await getItemsAsync(storeConstants.DataEncryptionStoreKey);
}