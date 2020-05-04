import { storeConstants, text, Errors, ErrorCodes } from '../modules/Constants';
import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as StorageHelpers from '../modules/StorageHelpers';
import * as GenericActions from './operationActionCreators';
import * as ActionTypes from './ActionTypes';
import { loadAuthData } from './authActionCreators';
import { isNullOrEmpty } from '../modules/helpers';

// export const setUserPassword = (oldPassword, newPassword) => (dispatch) => {
//     dispatch(GenericActions.operationProcessing());
//     setUserPasswordAsync(oldPassword, newPassword).then(() => {
//         dispatch(GenericActions.operationSucceeded(text.successMessages.PasswordSaved));
//         dispatch(GenericActions.operationCleared());
//     }).catch(err => {
//         dispatch(GenericActions.operationFailed(err.message));
//         dispatch(GenericActions.operationCleared());
//     });
// }

// export const setUserPasswordAsync = async (oldPassword, newPassword) => {
//     await SecurityHelpers.setPasswordAsync(oldPassword, newPassword);
//     await configEncryptionAsync(oldPassword, newPassword);
// }

// const configEncryptionAsync = async (oldPassword, newPassword) => {
//     /* try to get Data Encryption Key and if one exists try to decrypt with the old password
//     otherwise generate a new one */
//     const encryptionKey = await StorageHelpers.getItemsAsync(storeConstants.DataEncryptionStoreKey);
//     if (!encryptionKey)
//         await setupNewEncryptionAsync(newPassword);
//     else
//         await updateExistingEncryptionAsync(encryptionKey, oldPassword, newPassword);
// }



export const setupNewEncryption = (newPassword) => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    setupNewEncryptionAsync(newPassword)
        .then(() => {
            dispatch(GenericActions.operationSucceeded(text.successMessages.PasswordSaved));
            dispatch(loadAuthData());
        })
        .catch(err => {
            dispatch(GenericActions.operationFailed(err.message));
            dispatch(GenericActions.operationCleared());
        });

}
const setupNewEncryptionAsync = async (newPassword) => {
    const userDataInfo = await StorageHelpers.getUserDataInfo();
    if (userDataInfo.isDataEncrypted) /* cannot create new encryption, data is already encrypted */
        throw new Error(Errors.PasswordAlreadySet + ErrorCodes.Security1);

    // 1. encrypt any existing data (user may have been using the app but without setting the password) */
    const existingItems = await StorageHelpers.getItemsAsync(storeConstants.AllStoreKeys);
    const existingItemsEncrypted = await SecurityHelpers.firstTimeEncryptAllAsync(existingItems, newPassword);

    // 2. store everything in Async Storage in one call
    await StorageHelpers.setMultiItemsAsync(existingItemsEncrypted);

    // 3. delete non encrypted items from storage
    await StorageHelpers.finishSetupNewEncryptionAsync(storeConstants.AllStoreKeys);
}

export const isValidPasswordAsync = async (password) => {
    /* get data encryption key which has been encypted with user's password and 
    try to decrypt, if successful then the password is correct */
    const dataEncryptionStoreKeyEncrypted = await StorageHelpers.getDataEncryptionStoreKey();
    const passwordWorks = await SecurityHelpers.tryDecryptDataAsync(dataEncryptionStoreKeyEncrypted, password);
    if (passwordWorks === true)
        return true;
    return false;
}

// const updateExistingEncryptionAsync = async (encryptionKey, oldPassword, newPassword) => {
//     // decrypt Data Encryption Key with the old password, encrypt with the new password and store in Async Storage
//     const encryptionKeyEncrypted = await SecurityHelpers.reEncryptAsync(encryptionKey, oldPassword, newPassword);
//     await StorageHelpers.setItemsAsync(storeConstants.DataEncryptionStoreKey, encryptionKeyEncrypted);
// }
