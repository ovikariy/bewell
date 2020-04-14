import { ErrorCodes, Errors, ItemTypes, storeConstants } from './Constants';
import * as SecurityHelpers from './SecurityHelpers';
import * as AsyncStorageService from './AsyncStorageService';
import { consoleLogWithColor, consoleColors } from './helpers';

export const getItemsAsync = async (keyOrKeys) => {
    if (!keyOrKeys)
        throw new Error(Errors.General + ErrorCodes.MissingKey1);
    if (Array.isArray(keyOrKeys) && keyOrKeys.length <= 0)
        throw new Error(Errors.General + ErrorCodes.MissingKey2);
    try {
        if (Array.isArray(keyOrKeys))
            return await AsyncStorageService.multiGet(keyOrKeys);
        else
            return await AsyncStorageService.getItem(keyOrKeys);
    } catch (err) {
        console.log(err);
        throw new Error(Errors.General + ErrorCodes.Storage1);
    }
}

export const setItemsAsync = async (key, value) => {
    if (!key)
        throw new Error(Errors.UnableToSave + ErrorCodes.MissingKey3);
    await setMultiItemsAsync([[key, value]]);
}

export const setMultiItemsAsync = async (items) => {
    /* multiSet([['k1', 'val1'], ['k2', 'val2']]) */
    if (!items || !Array.isArray(items) || items.length <= 0)
        throw new Error(Errors.UnableToSave + ErrorCodes.MissingKey4);
    /* check items format and that each key is a type of string */
    items.forEach(item => {
        if (item.length < 2 || typeof item[0] != 'string')
            throw new Error(Errors.InvalidData + ErrorCodes.Storage10);
    })
    try {
        await AsyncStorageService.multiSet(items);
    } catch (err) {
        console.log(err);
        throw new Error(Errors.UnableToSave + ErrorCodes.Storage3);
    }
}

export const finishSetupNewEncryptionAsync = async (keys) => {
    /* this is a one time run function that removes all unencrypted storage 
    key/values (e.g. NOTES, MOODS) after they were copied into the newly encrypted key/values */
    if (!keys || !Array.isArray(keys) || keys.length <= 0)
        throw new Error(Errors.General + ErrorCodes.MissingKey5);
    keys.forEach(key => {
        if (typeof key != 'string')
            throw new Error(Errors.InvalidData + ErrorCodes.Storage11);
    })
    try {
        await AsyncStorageService.multiRemove(keys);
    } catch (err) {
        console.log(err);
        throw new Error(Errors.General + ErrorCodes.Storage4);
    }
}

export const mergeByIdAsync = async (itemTypeName, newItems) => {
    if (!newItems || !Array.isArray(newItems) || newItems.length <= 0)
        throw new Error(Errors.UnableToSave + ErrorCodes.Storage5);

    const oldItems = await getItemsAndDecryptAsync(itemTypeName);

    /* if item has ID then overwrite, otherwise add */
    (newItems).forEach(newItem => {
        if (!newItem.id)
            throw new Error(Errors.UnableToSave + ErrorCodes.Storage6);
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
    if (SecurityHelpers.canEncryptDecrypt !== true)
        return await getItemsAsync(storeConstants.AllStoreKeys);
    else {
        const hashedKeys = await SecurityHelpers.getAllHashedStoreKeys();
        hashedKeys.push(storeConstants.DataEncryptionStoreKey); /* add DataEncryptionStoreKey separately because it's not hashed */
        return await getItemsAsync(hashedKeys);
    }
}

export const getMultiItemsAndDecryptAsync = async (keys) => {
    let items = [];
    if (SecurityHelpers.canEncryptDecrypt !== true)
        items = await getItemsAsync(keys);
    else {
        const hashedKeys = await SecurityHelpers.getMultipleHashedKeys(keys);
        items = await getItemsAsync(hashedKeys);

        if (!items || items.length < 0)
            return [];
        items = await SecurityHelpers.decryptAllItems(items);
    }
    if (!items || items.length < 0)
        return [];

    /* now need to parse the values becase items is  [[stringKey1, stringValue1], [stringKey2, stringValue2], ....] */
    items.forEach((item) => {
        if (item.length > 1 && item[1]) {
            item[1] = JSON.parse(item[1]);
        }
    });



    //TODO: test after settings a password




    return items;
}

export const logStorageDataAsync = async () => {
    const items = await AsyncStorageService.multiGet(await AsyncStorageService.getAllKeys());
    consoleLogWithColor(consoleColors.green, '\r\nAll AsyncStorage Items:\r\n' + JSON.stringify(items));
}

export const getItemsAndDecryptAsync = async (key) => {
    if (!isValidStoreKey(key))
        throw new Error(Errors.InvalidKey + key);
    const storeKey = await getStoreKeyHashAsync(key);
    let items = await getItemsAsync(storeKey);

    if (SecurityHelpers.canEncryptDecrypt === true)
        items = await SecurityHelpers.decryptDataAsync(items);

    return items ? JSON.parse(items) : [];
}

export const setItemsAndEncryptAsync = async (key, items) => {
    if (!isValidStoreKey(key))
        throw new Error(Errors.InvalidKey);
    const encrypted = await encryptAsync(JSON.stringify(items));
    const storeKey = await getStoreKeyHashAsync(key);
    await setItemsAsync(storeKey, encrypted);
}

export const getStoreKeyHashAsync = async (key) => {
    if (!isValidStoreKey(key))
        throw new Error(Errors.InvalidKey);
    const storeKey = key.indexOf(storeConstants.keyPrefix) < 0 ? storeConstants.keyPrefix + key : key;
    if (SecurityHelpers.canEncryptDecrypt === true) {
        /* the itemTypeName in storage is hashed with dataEncryptionKey */
        const itemTypeNameHash = await SecurityHelpers.getItemKeyHashAsync(storeKey);
        return itemTypeNameHash;
    }
    return storeKey;
}

export const encryptAsync = async (items) => {
    if (SecurityHelpers.canEncryptDecrypt === true) {
        return await SecurityHelpers.encryptDataAsync(items)
    }
    else {
        return items;
    }
}

export const isValidStoreKey = (key) => {
    return (storeConstants.AllStoreKeys.indexOf(storeConstants.keyPrefix + key) >= 0 || storeConstants.AllStoreKeys.indexOf(key) >= 0);
}

export const getDataEncryptionStoreKey = async() => {
    return await getItemsAsync(storeConstants.DataEncryptionStoreKey);
}

export const getUserDataInfo = async () => {
    /* this is used for authentication purposes */
    const isInitialized = await getItemsAsync(storeConstants.isInitialized) === 'true' ? true : false;
    const isDataEncrypted = await getDataEncryptionStoreKey() ? true : false;
    return { isInitialized, isDataEncrypted };
}