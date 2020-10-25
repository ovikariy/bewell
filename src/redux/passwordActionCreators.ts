import { StoreConstants, ErrorMessage, ErrorCode } from '../modules/constants';
import * as operationActions from './operationActionCreators';
import * as storage from '../modules/storage';
import * as securityService from '../modules/securityService';
import * as ActionTypes from './actionTypes';
import { isNullOrEmpty } from '../modules/utils';
import { signInPassword, loadAuthData } from './authActionCreators';
import { AppThunkActionType } from './store';
import { AppError } from '../modules/types';

export function startChangePassword(): AppThunkActionType {
    return (dispatch) => {
        dispatch({ type: ActionTypes.CHANGEPASSWORD_STARTED });
    };
}

export function finishChangePassword(): AppThunkActionType {
    return (dispatch) => {
        dispatch({ type: ActionTypes.CHANGEPASSWORD_COMPLETE });
    };
}

export function verifyCredentials(password?: string, pin?: string): AppThunkActionType {
    return (dispatch) => {
        dispatch(operationActions.start());
        verifyCredentialsAsync(password, pin)
            .then(() => {
                dispatch({ type: ActionTypes.CHANGEPASSWORD_CREDENTIALS_VERIFIED });
                dispatch(operationActions.clear());
            })
            .catch(error => {
                console.log(error);
                dispatch({ type: ActionTypes.CHANGEPASSWORD_CREDENTIALS_FAILED });
                dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Security5) : error));
                dispatch(operationActions.clear());
            });
    };
}

async function verifyCredentialsAsync(password?: string, pin?: string) {
    if (isNullOrEmpty(password) && isNullOrEmpty(pin))
        throw new AppError(ErrorMessage.InvalidCredentials);
    if (password)
        await validatePasswordAsync(password);
    if (pin)
        await securityService.validatePINAsync(pin);
}

export function updatePassword(oldPassword: string, newPassword: string, pin?: string): AppThunkActionType {
    return (dispatch) => {
        if (securityService.isSignedIn() !== true) {
            dispatch(operationActions.fail(new AppError(ErrorMessage.Unauthorized)));
            return;
        }
        dispatch(operationActions.start());
        updatePasswordAsync(oldPassword, newPassword, pin).then(() => {
            dispatch({ type: ActionTypes.CHANGEPASSWORD_COMPLETE });
            dispatch(signInPassword(newPassword));
        })
            .catch(error => {
                dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Security6) : error));
                dispatch(operationActions.clear());
            });
    };
}

async function updatePasswordAsync(oldPassword: string, newPassword: string, pin?: string) {
    /* 1. verify credentials */
    await verifyCredentialsAsync(oldPassword, pin);

    const dataEncryptionStoreKey = await storage.getDataEncryptionStoreKeyAsync();
    if (!dataEncryptionStoreKey || isNullOrEmpty(dataEncryptionStoreKey))
        throw new AppError(ErrorMessage.InvalidKey, ErrorCode.Security2);

    /* 2. re-encrypt Data Encryption Key with the new password */
    const encryptionKeyEncrypted = await securityService.reEncryptAsync(dataEncryptionStoreKey, oldPassword, newPassword);
    if (isNullOrEmpty(encryptionKeyEncrypted))
        throw new AppError(ErrorMessage.InvalidKey, ErrorCode.Security3);

    /* 3. persist Data Encryption Key */
    await storage.setItemAsync(StoreConstants.DataEncryptionStoreKey, encryptionKeyEncrypted);

    /* 4. encrypt new password with old PIN and persist that to keychain */
    if (pin && isNullOrEmpty(pin) === false)
        await securityService.setupNewPINAsync(newPassword, pin);
}

export function setupNewEncryption(newPassword: string): AppThunkActionType {
    return (dispatch) => {
        dispatch(operationActions.start());
        setupNewEncryptionAsync(newPassword)
            .then(() => {
                dispatch(operationActions.complete(ErrorMessage.PasswordSet));
                dispatch(loadAuthData());
            })
            .catch(error => {
                dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Security7) : error));
                dispatch(operationActions.clear());
            });
    };
}

async function setupNewEncryptionAsync(newPassword: string) {
    const dataEncryptionStoreKey = await storage.getDataEncryptionStoreKeyAsync();
    if (!isNullOrEmpty(dataEncryptionStoreKey)) /* cannot create new encryption, data is already encrypted */
        throw new AppError(ErrorMessage.PasswordAlreadySet, ErrorCode.Security1);

    // 1. encrypt any existing data (user may have been using the app but without setting the password) */
    const existingItems = await storage.getItemsAsync(StoreConstants.AllEncryptedStoreKeys);
    const existingItemsEncrypted = await securityService.firstTimeEncryptAllAsync(existingItems, newPassword);

    // 2. store everything in Async Storage in one call
    await storage.setMultiItemsAsync(existingItemsEncrypted);

    // 3. delete non encrypted items from storage
    await storage.finishSetupNewEncryptionAsync(StoreConstants.AllEncryptedStoreKeys);
}

export async function validatePasswordAsync(password: string) {
    /* get data encryption key which has been encypted with user's password and
    try to decrypt, if successful then the password is correct */
    const dataEncryptionStoreKeyEncrypted = await storage.getDataEncryptionStoreKeyAsync();
    const validPassword = await securityService.tryDecryptDataAsync(dataEncryptionStoreKeyEncrypted, password);
    if (validPassword !== true)
        throw new AppError(ErrorMessage.InvalidPassword);
}