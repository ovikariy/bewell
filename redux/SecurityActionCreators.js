import * as ActionTypes from './ActionTypes';
import * as Constants from '../constants/Constants';
import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as StorageHelpers from '../modules/StorageHelpers';

export const passwordProcessing = () => ({
    type: ActionTypes.PASSWORD_PROCESSING
})

export const messagesCleared = () => ({
    type: ActionTypes.MESSAGES_CLEARED
})

export const passwordFailed = (errMess) => ({
    type: ActionTypes.PASSWORD_FAILED,
    payload: errMess
})

export const passwordSucceeded = (successMess) => ({
    type: ActionTypes.PASSWORD_SUCCEEDED,
    payload: successMess
})

export const clearMessages = () => (dispatch) => {
    /* need to clear errMess and successMess in reducer if e.g. there was an error during setUserPassword
    because state persists between re-renders and error or success message will keep showing */
    StorageHelpers.logStorageDataAsync();
    dispatch(messagesCleared());
}

export const setUserPassword = (oldPassword, newPassword) => (dispatch) => {
    dispatch(passwordProcessing());
    setUserPasswordAsync(oldPassword, newPassword).then(() => {
        dispatch(passwordSucceeded('Saved!'));
        dispatch(clearMessages());
    }).catch(err => {
        dispatch(passwordFailed(err.message));
        dispatch(clearMessages());
    });
}

setUserPasswordAsync = async (oldPassword, newPassword) => {
    await SecurityHelpers.setPasswordAsync(oldPassword, newPassword);
    await configEncryptionAsync(oldPassword, newPassword);
}

const configEncryptionAsync = async (oldPassword, newPassword) => {
    /* try to get Data Encryption Key and if one exists try to decrypt with the old password
    otherwise generate a new one */
    const encryptionKey = await StorageHelpers.getItemsAsync(Constants.DataEncryptionStoreKey);
    if (!encryptionKey)
        await setupNewEncryptionAsync(newPassword);
    else
        await updateExistingEncryptionAsync(encryptionKey, oldPassword, newPassword);
}

const setupNewEncryptionAsync = async (newPassword) => {
    // 1. encrypt any existing data (user may have been using the app but without setting the password) */
    const existingItems = await StorageHelpers.getMultiItemsAsync(Constants.StoreKeys);
    const existingItemsEncrypted = await SecurityHelpers.encryptAndHashMultiItemsAsync(existingItems, newPassword);

    // 2. store everything in Async Storage in one call
    await StorageHelpers.setMultiItemsAsync(existingItemsEncrypted);

    // 3. delete non encrypted items from storage
    await StorageHelpers.removeMultiItemsAsync(Constants.StoreKeys);
}

const updateExistingEncryptionAsync = async (encryptionKey, oldPassword, newPassword) => {
    // decrypt Data Encryption Key with the old password, encrypt with the new password and store in Async Storage
    const encryptionKeyEncrypted = await SecurityHelpers.reEncryptAsync(encryptionKey, oldPassword, newPassword);
    await StorageHelpers.setItemsAsync(Constants.DataEncryptionStoreKey, encryptionKeyEncrypted);
}
