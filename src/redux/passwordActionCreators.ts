import { StoreConstants, Errors, ErrorCodes } from '../modules/Constants';
import * as operationActions from './operationActionCreators';
import * as StorageHelpers from '../modules/StorageHelpers';
import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as ActionTypes from './ActionTypes';
import { isNullOrEmpty } from '../modules/helpers';
import { signInPassword, loadAuthData } from './authActionCreators';
import { AppThunkActionType } from './configureStore';

export const startChangePassword = (): AppThunkActionType => (dispatch) => {
    dispatch({ type: ActionTypes.CHANGEPASSWORD_STARTED });
};

export const finishChangePassword = (): AppThunkActionType => (dispatch) => {
    dispatch({ type: ActionTypes.CHANGEPASSWORD_COMPLETE });
};

export const verifyCredentials = (password?: string, pin?: string): AppThunkActionType => (dispatch) => {
    dispatch(operationActions.start());
    verifyCredentialsAsync(password, pin)
        .then(() => {
            dispatch({ type: ActionTypes.CHANGEPASSWORD_CREDENTIALS_VERIFIED });
            dispatch(operationActions.clear());
        })
        .catch(error => {
            console.log(error);
            dispatch({ type: ActionTypes.CHANGEPASSWORD_CREDENTIALS_FAILED });
            dispatch(operationActions.fail(error.message ? [Errors.General, ErrorCodes.Security5] : error));
            dispatch(operationActions.clear());
        });
};

const verifyCredentialsAsync = async (password?: string, pin?: string) => {
    if (isNullOrEmpty(password) && isNullOrEmpty(pin))
        throw Errors.InvalidCredentials;
    if (password)
        await validatePasswordAsync(password);
    if (pin)
        await SecurityHelpers.validatePIN(pin);
};

export const updatePassword = (oldPassword: string, newPassword: string, pin?: string): AppThunkActionType => (dispatch) => {
    if (SecurityHelpers.isSignedIn() !== true) {
        dispatch(operationActions.fail(Errors.Unauthorized));
        return;
    }
    dispatch(operationActions.start());
    updatePasswordAsync(oldPassword, newPassword, pin).then(() => {
        dispatch({ type: ActionTypes.CHANGEPASSWORD_COMPLETE });
        dispatch(signInPassword(newPassword));
    })
        .catch(error => {
            dispatch(operationActions.fail(error.message ? [Errors.General, ErrorCodes.Security6] : error));
            dispatch(operationActions.clear());
        });
};

const updatePasswordAsync = async (oldPassword: string, newPassword: string, pin?: string) => {
    /* 1. verify credentials */
    await verifyCredentialsAsync(oldPassword, pin);

    const dataEncryptionStoreKey = await StorageHelpers.getDataEncryptionStoreKey();
    if (!dataEncryptionStoreKey || isNullOrEmpty(dataEncryptionStoreKey))
        throw [Errors.InvalidKey, ErrorCodes.Security2];

    /* 2. re-encrypt Data Encryption Key with the new password */
    const encryptionKeyEncrypted = await SecurityHelpers.reEncryptAsync(dataEncryptionStoreKey, oldPassword, newPassword);
    if (isNullOrEmpty(encryptionKeyEncrypted))
        throw [Errors.InvalidKey, ErrorCodes.Security3];

    /* 3. persist Data Encryption Key */
    await StorageHelpers.setItemsAsync(StoreConstants.DataEncryptionStoreKey, encryptionKeyEncrypted);

    /* 4. encrypt new password with old PIN and persist that to keychain */
    if (pin && isNullOrEmpty(pin) === false)
        await SecurityHelpers.setupNewPINAsync(newPassword, pin);
};

export const setupNewEncryption = (newPassword: string): AppThunkActionType => (dispatch) => {
    dispatch(operationActions.start());
    setupNewEncryptionAsync(newPassword)
        .then(() => {
            dispatch(operationActions.complete(Errors.PasswordSet));
            dispatch(loadAuthData());
        })
        .catch(error => {
            dispatch(operationActions.fail(error.message ? [Errors.General, ErrorCodes.Security7] : error));
            dispatch(operationActions.clear());
        });
};

const setupNewEncryptionAsync = async (newPassword: string) => {
    const dataEncryptionStoreKey = await StorageHelpers.getDataEncryptionStoreKey();
    if (!isNullOrEmpty(dataEncryptionStoreKey)) /* cannot create new encryption, data is already encrypted */
        throw [Errors.PasswordAlreadySet, ErrorCodes.Security1];

    // 1. encrypt any existing data (user may have been using the app but without setting the password) */
    const existingItems = await StorageHelpers.getItemsAsync(StoreConstants.AllEncryptedStoreKeys);
    const existingItemsEncrypted = await SecurityHelpers.firstTimeEncryptAllAsync(existingItems, newPassword);

    // 2. store everything in Async Storage in one call
    await StorageHelpers.setMultiItemsAsync(existingItemsEncrypted);

    // 3. delete non encrypted items from storage
    await StorageHelpers.finishSetupNewEncryptionAsync(StoreConstants.AllEncryptedStoreKeys);
};

export const validatePasswordAsync = async (password: string) => {
    /* get data encryption key which has been encypted with user's password and
    try to decrypt, if successful then the password is correct */
    const dataEncryptionStoreKeyEncrypted = await StorageHelpers.getDataEncryptionStoreKey();
    const validPassword = await SecurityHelpers.tryDecryptDataAsync(dataEncryptionStoreKeyEncrypted, password);
    if (validPassword !== true)
        throw Errors.InvalidPassword;
};