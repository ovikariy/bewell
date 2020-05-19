import { storeConstants, text, Errors, ErrorCodes } from '../modules/Constants';
import * as GenericActions from './operationActionCreators';
import * as StorageHelpers from '../modules/StorageHelpers';
import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as ActionTypes from './ActionTypes';
import { isNullOrEmpty } from '../modules/helpers';
import { signInPassword, loadAuthData } from './authActionCreators';

export const startChangePassword = () => (dispatch) => {
    dispatch({ type: ActionTypes.CHANGEPASSWORD_STARTED });
}

export const finishChangePassword = () => (dispatch) => {
    dispatch({ type: ActionTypes.CHANGEPASSWORD_COMPLETE });
}

export const verifyCredentials = (password, pin) => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    verifyCredentialsAsync(password, pin)
        .then(() => {
            dispatch({ type: ActionTypes.CHANGEPASSWORD_CREDENTIALS_VERIFIED });
            dispatch(GenericActions.operationCleared());
        })
        .catch(err => {
            console.log(err);
            dispatch({ type: ActionTypes.CHANGEPASSWORD_CREDENTIALS_FAILED });
            dispatch(GenericActions.operationFailed(err.message));
            dispatch(GenericActions.operationCleared());
        })
}

const verifyCredentialsAsync = async (password, pin) => {
    if (isNullOrEmpty(password) && isNullOrEmpty(pin))
        throw new Error(Errors.InvalidCredentials);
    if (password)
        await validatePasswordAsync(password);
    if (pin)
        await SecurityHelpers.validatePIN(pin);
}

export const updatePassword = (oldPassword, newPassword, pin) => (dispatch) => {
    if (SecurityHelpers.isSignedIn() !== true) {
        dispatch(GenericActions.operationFailed(Errors.Unauthorized));
        return;
    }
    dispatch(GenericActions.operationProcessing());
    updatePasswordAsync(oldPassword, newPassword, pin).then(() => {
        dispatch({ type: ActionTypes.CHANGEPASSWORD_COMPLETE });
        dispatch(signInPassword(newPassword));
    }).catch(err => {
        dispatch(GenericActions.operationFailed(err.message));
        dispatch(GenericActions.operationCleared());
    });
}

const updatePasswordAsync = async (oldPassword, newPassword, pin) => {
    /* 1. verify credentials */
    await verifyCredentialsAsync(oldPassword, pin);

    const dataEncryptionStoreKey = await StorageHelpers.getDataEncryptionStoreKey();
    if (isNullOrEmpty(dataEncryptionStoreKey))
        throw new Error(Errors.InvalidKey + ErrorCodes.Security2);

    /* 2. re-encrypt Data Encryption Key with the new password */
    const encryptionKeyEncrypted = await SecurityHelpers.reEncryptAsync(dataEncryptionStoreKey, oldPassword, newPassword);
    if (isNullOrEmpty(encryptionKeyEncrypted))
        throw new Error(Errors.InvalidKey + ErrorCodes.Security3);

    /* 3. persist Data Encryption Key */
    await StorageHelpers.setItemsAsync(storeConstants.DataEncryptionStoreKey, encryptionKeyEncrypted);

    /* 4. encrypt new password with old PIN and persist that to keychain */
    if (isNullOrEmpty(pin) === false)
        await SecurityHelpers.setupNewPINAsync(newPassword, pin);
}

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
    const dataEncryptionStoreKey = await StorageHelpers.getDataEncryptionStoreKey();
    if (!isNullOrEmpty(dataEncryptionStoreKey)) /* cannot create new encryption, data is already encrypted */
        throw new Error(Errors.PasswordAlreadySet + ErrorCodes.Security1);

    // 1. encrypt any existing data (user may have been using the app but without setting the password) */
    const existingItems = await StorageHelpers.getItemsAsync(storeConstants.AllStoreKeys);
    const existingItemsEncrypted = await SecurityHelpers.firstTimeEncryptAllAsync(existingItems, newPassword);

    // 2. store everything in Async Storage in one call
    await StorageHelpers.setMultiItemsAsync(existingItemsEncrypted);

    // 3. delete non encrypted items from storage
    await StorageHelpers.finishSetupNewEncryptionAsync(storeConstants.AllStoreKeys);
}

export const validatePasswordAsync = async (password) => {
    /* get data encryption key which has been encypted with user's password and 
    try to decrypt, if successful then the password is correct */
    const dataEncryptionStoreKeyEncrypted = await StorageHelpers.getDataEncryptionStoreKey();
    const validPassword = await SecurityHelpers.tryDecryptDataAsync(dataEncryptionStoreKeyEncrypted, password);
    if (validPassword !== true)
        throw new Error(Errors.InvalidPassword);
}