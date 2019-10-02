import { ErrorCodes, Errors, ItemTypes, storeConstants } from './Constants';
import * as SecurityHelpers from './SecurityHelpers';
import * as AsyncStorageService from './AsyncStorageService';

export const getItemsAsync = async (key) => {
    if (!key)
        throw new Error(Errors.General + ErrorCodes.MissingKey1);
    try {
        return await AsyncStorageService.getItem(key);
    } catch (err) {
        console.log(err);
        throw new Error(Errors.General + ErrorCodes.Storage1);
    }
}

export const getMultiItemsAsync = async (keys) => {
    if (!keys || !Array.isArray(keys) || keys.length <= 0)
        throw new Error(Errors.General + ErrorCodes.MissingKey2);
    try {
        const items = await AsyncStorageService.multiGet(keys);
        return items;
    } catch (err) {
        console.log(err);
        throw new Error(Errors.General + ErrorCodes.Storage2);
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

export const removeMultiItemsAsync = async (keys) => {
    /* WARNING: this function removes NOT multiple records of item type but the whole item type (e.g. NOTES, MOODS) */
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

export const removeByIdAsync = async (itemTypeName, id) => {
    if (!itemTypeName)
        throw new Error(Errors.General + ErrorCodes.MissingItemType1);

    const oldItems = await getItemsAndDecryptAsync(itemTypeName);
    const itemsWithoutDeleted = oldItems.filter(item => item.id !== id);

    await setItemsAndEncryptAsync(itemTypeName, itemsWithoutDeleted);
    return itemsWithoutDeleted;
}

export const removeByIdMultipleAsync = async (itemTypeName, ids) => {
    if (!itemTypeName)
        throw new Error(Errors.General + ErrorCodes.MissingItemType3);

    if (!ids || ids.length <= 0)
        throw new Error(Errors.General + ErrorCodes.Storage9);
    const oldItems = await getItemsAndDecryptAsync(itemTypeName);
    const itemsWithoutDeleted = oldItems.filter(oldItem => ids.indexOf(oldItem.id) < 0);

    await setItemsAndEncryptAsync(itemTypeName, itemsWithoutDeleted);
    return itemsWithoutDeleted;
}

export const getStorageDataForExportAsync = async () => {
    const encryptionKey = await getItemsAsync(storeConstants.DataEncryptionStoreKey);
    if (!encryptionKey)
        return await getMultiItemsAsync(storeConstants.StoreKeys);
    else {
        const hashedKeys = await SecurityHelpers.getAllHashedStoreKeys(encryptionKey);
        hashedKeys.push(storeConstants.DataEncryptionStoreKey); /* add DataEncryptionStoreKey separately because it's not hashed */
        return await getMultiItemsAsync(hashedKeys);
    }
}

export const logStorageDataAsync = async () => {
    const items = await AsyncStorageService.multiGet(await AsyncStorageService.getAllKeys());
    console.log('\r\nAll AsyncStorage Items:\r\n' + JSON.stringify(items));
}

export const getItemsAndDecryptAsync = async (itemTypeName) => {
    if (!isValidStoreKey(itemTypeName))
        throw new Error(Errors.InvalidTypeName);
    const storageItemTypeName = await getItemTypeNameHashAsync(itemTypeName);
    let items = await getItemsAsync(storageItemTypeName);
    /* try to get Data Encryption Key and if one exists, need to decrypt with the user's password
    and then decrypt the data with Data Encryption Key */
    const dataEncryptionKey = await getItemsAsync(storeConstants.DataEncryptionStoreKey);
    if (dataEncryptionKey)
        items = await SecurityHelpers.decryptDataAsync(items, dataEncryptionKey);

    return items ? JSON.parse(items) : [];
}

export const setItemsAndEncryptAsync = async (itemTypeName, items) => {
    if (!isValidStoreKey(itemTypeName))
        throw new Error(Errors.InvalidTypeName);
    const encrypted = await encryptAsync(JSON.stringify(items));
    const storageItemTypeName = await getItemTypeNameHashAsync(itemTypeName);
    await setItemsAsync(storageItemTypeName, encrypted);
}

export const getItemTypeNameHashAsync = async (itemTypeName) => {
    if (!isValidStoreKey(itemTypeName))
        throw new Error(Errors.InvalidTypeName);
    const storageItemTypeName = storeConstants.keyPrefix + itemTypeName;
    const dataEncryptionKey = await getItemsAsync(storeConstants.DataEncryptionStoreKey);
    if (dataEncryptionKey) {
        /* the itemTypeName in storage is hashed with dataEncryptionKey */
        const itemTypeNameHash = await SecurityHelpers.getItemTypeNameHashAsync(storageItemTypeName, dataEncryptionKey);
        return itemTypeNameHash;
    }
    return storageItemTypeName;
}

export const encryptAsync = async (items) => {
    /* try to get Data Encryption Key and if one exists, need to decrypt with the user's password
    and then encrypt the data with Data Encryption Key */
    const dataEncryptionKey = await getItemsAsync(storeConstants.DataEncryptionStoreKey);
    if (dataEncryptionKey) {
        return await SecurityHelpers.encryptDataAsync(items, dataEncryptionKey)
    }
    else {
        return items;
    }
}

export const isValidStoreKey = (itemTypeName) => {
    return (storeConstants.StoreKeys.indexOf(storeConstants.keyPrefix + itemTypeName) >= 0);
}