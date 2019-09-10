import { AsyncStorage } from "react-native";
import { ErrorCodes, Errors, DataEncryptionStoreKey, strings, ItemTypes, StoreKeys } from '../constants/Constants';
import * as SecurityHelpers from './SecurityHelpers';

export const getItemsAsync = async (key) => {
    if (!key)
        throw new Error(Errors.General + ErrorCodes.MissingKey1);
    try {
        return await AsyncStorage.getItem(key);
    } catch (err) {
        console.log(err);
        throw new Error(Errors.General + ErrorCodes.Storage1);
    }
}

export const getMultiItemsAsync = async (keys) => {
    if (!keys || !(keys.length > 0))
        throw new Error(Errors.General + ErrorCodes.MissingKey2);
    try {
        const items = await AsyncStorage.multiGet(keys);
        return items;
    } catch (err) {
        console.log(err);
        throw new Error(Errors.General + ErrorCodes.Storage2);
    }
}

export const setItemsAsync = async (key, value) => {
    if (!key)
        throw new Error(Errors.General + ErrorCodes.MissingKey3);
    await setMultiItemsAsync([[key, value]]);
}

export const setMultiItemsAsync = async (items) => {
    /* multiSet([['k1', 'val1'], ['k2', 'val2']]) */
    if (!items)
        throw new Error(Errors.General + ErrorCodes.MissingKey4);
    try {
        await AsyncStorage.multiSet(items);
    } catch (err) {
        console.log(err);
        throw new Error(Errors.General + ErrorCodes.Storage3);
    }
}

export const removeMultiItemsAsync = async (keys) => {
    if (!keys)
        throw new Error(Errors.General + ErrorCodes.MissingKey5);
    try {
        return await AsyncStorage.multiRemove(keys);
    } catch (err) {
        console.log(err);
        throw new Error(Errors.General + ErrorCodes.Storage4);
    }
}

export const mergeByIdAsync = async (itemTypeName, newItems) => {
    if (!newItems || newItems.length <= 0)
        throw new Error(Errors.General + ErrorCodes.Storage5);

    const oldItems = await getItemsAndDecryptAsync(itemTypeName);

    /* if item has ID then overwrite, otherwise add */
    (newItems).forEach(newItem => {
        const oldItemIndex = oldItems.findIndex(oldItem => oldItem.id === newItem.id);
        if (oldItemIndex > -1)
            oldItems[oldItemIndex] = newItem;
        else
            oldItems.push(newItem);
    });

    await setItemsAndEncryptAsync(itemTypeName, oldItems);
}

export const removeByIdAsync = async (itemTypeName, id) => {
    if (!itemTypeName)
        throw new Error(Errors.General + ErrorCodes.MissingItemType1);

    const oldItems = await getItemsAndDecryptAsync(itemTypeName);
    const itemsWithoutDeleted = oldItems.filter(item => item.id !== id);

    await setItemsAndEncryptAsync(itemTypeName, itemsWithoutDeleted);
}

export const getStorageDataForExportAsync = async () => {
    //TODO: test before setting the password and after
    const encryptionKey = await getItemsAsync(DataEncryptionStoreKey);
    if (!encryptionKey)
        return await getMultiItemsAsync(StoreKeys);
    else {
        const hashedKeys = await SecurityHelpers.getAllHashedStoreKeys(encryptionKey);
        hashedKeys.push(DataEncryptionStoreKey); /* add DataEncryptionStoreKey separately because it's not hashed */
        return await getMultiItemsAsync(hashedKeys);
    }
}

export const logStorageDataAsync = async () => {
    const items = await AsyncStorage.multiGet(await AsyncStorage.getAllKeys());
    console.log('\r\nAll AsyncStorage Items:\r\n' + items);
}

export const getItemsAndDecryptAsync = async (itemTypeName) => {
    if (!isValidItemTypeName(itemTypeName))
        throw new Error(Errors.InvalidTypeName);
    const storageItemTypeName = await getItemTypeNameHashAsync(itemTypeName);
    let items = await getItemsAsync(storageItemTypeName);
    /* try to get Data Encryption Key and if one exists, need to decrypt with the user's password
    and then decrypt the data with Data Encryption Key */
    const dataEncryptionKey = await getItemsAsync(DataEncryptionStoreKey);
    if (dataEncryptionKey)
        items = await SecurityHelpers.decryptDataAsync(items, dataEncryptionKey);

    return items ? JSON.parse(items) : [];
}

export const setItemsAndEncryptAsync = async (itemTypeName, items) => {
    if (!isValidItemTypeName(itemTypeName))
        throw new Error(Errors.InvalidTypeName);
    const encrypted = await encryptAsync(JSON.stringify(items));
    const storageItemTypeName = await getItemTypeNameHashAsync(itemTypeName);
    await setItemsAsync(storageItemTypeName, encrypted);
}

export const getItemTypeNameHashAsync = async (itemTypeName) => {
    if (!isValidItemTypeName(itemTypeName))
        throw new Error(Errors.InvalidTypeName);
    const storageItemTypeName = strings.keyPrefix + itemTypeName;
    const dataEncryptionKey = await getItemsAsync(DataEncryptionStoreKey);
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
    const dataEncryptionKey = await getItemsAsync(DataEncryptionStoreKey);
    if (dataEncryptionKey) {
        return await SecurityHelpers.encryptDataAsync(items, dataEncryptionKey)
    }
    else {
        return items;
    }
}

export const isValidItemTypeName = (itemTypeName) => {
    return (ItemTypes[itemTypeName] != null);
}