import { storeConstants, text } from '../modules/Constants';
import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as StorageHelpers from '../modules/StorageHelpers';
import * as GenericActions from './operationActionCreators';

export const setUserPassword = (oldPassword, newPassword) => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    setUserPasswordAsync(oldPassword, newPassword).then(() => {
        dispatch(GenericActions.operationSucceeded(text.general.Saved));  
        dispatch(GenericActions.operationCleared());
    }).catch(err => {
        dispatch(GenericActions.operationFailed(err.message));
        dispatch(GenericActions.operationCleared());
    });
}

setUserPasswordAsync = async (oldPassword, newPassword) => {
    await SecurityHelpers.setPasswordAsync(oldPassword, newPassword);
    await configEncryptionAsync(oldPassword, newPassword);
}

const configEncryptionAsync = async (oldPassword, newPassword) => {
    /* try to get Data Encryption Key and if one exists try to decrypt with the old password
    otherwise generate a new one */
    const encryptionKey = await StorageHelpers.getItemsAsync(storeConstants.DataEncryptionStoreKey);
    if (!encryptionKey)
        await setupNewEncryptionAsync(newPassword);
    else
        await updateExistingEncryptionAsync(encryptionKey, oldPassword, newPassword);
}

const setupNewEncryptionAsync = async (newPassword) => {
    // 1. encrypt any existing data (user may have been using the app but without setting the password) */
    const existingItems = await StorageHelpers.getMultiItemsAsync(storeConstants.StoreKeys);
    const existingItemsEncrypted = await SecurityHelpers.firstTimeEncryptAllAsync(existingItems, newPassword);

    // 2. store everything in Async Storage in one call
    await StorageHelpers.setMultiItemsAsync(existingItemsEncrypted);

    // 3. delete non encrypted items from storage
    await StorageHelpers.removeMultiItemsAsync(storeConstants.StoreKeys);
}

const updateExistingEncryptionAsync = async (encryptionKey, oldPassword, newPassword) => {
    // decrypt Data Encryption Key with the old password, encrypt with the new password and store in Async Storage
    const encryptionKeyEncrypted = await SecurityHelpers.reEncryptAsync(encryptionKey, oldPassword, newPassword);
    await StorageHelpers.setItemsAsync(storeConstants.DataEncryptionStoreKey, encryptionKeyEncrypted);
}
