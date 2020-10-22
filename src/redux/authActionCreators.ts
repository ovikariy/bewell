import * as SecurityHelpers from '../modules/securityHelpers';
import * as StorageHelpers from '../modules/storageHelpers';
import * as operationActions from './operationActionCreators';
import * as ActionTypes from './actionTypes';
import { isNullOrEmpty } from '../modules/helpers';
import { ErrorMessage, ErrorCode } from '../modules/constants';
import { AppThunkActionType } from './configureStore';
import { AppError } from '../modules/appError';

export function loadAuthData(): AppThunkActionType {
    return (dispatch) => {
        dispatch(operationActions.start());
        loadAuthDataAsync()
            .then((authData) => {
                dispatch({ type: ActionTypes.LOADED_AUTH_DATA, payload: { authData } });
                dispatch(operationActions.clear());
            })
            .catch(error => {
                console.log(error);
                dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Auth3) : error));
                dispatch(operationActions.clear());
            });
    };
}

async function loadAuthDataAsync() {
    const authData = await SecurityHelpers.getLoginInfoAsync();
    const dataEncryptionStoreKey = await StorageHelpers.getDataEncryptionStoreKeyAsync();
    authData.isEncrypted = isNullOrEmpty(dataEncryptionStoreKey) ? false : true;
    return authData;
}

export function signInPassword(password: string): AppThunkActionType {
    return (dispatch) => {
        dispatch(operationActions.start());
        signInPasswordAsync(password)
            .then(() => {
                dispatch(loadAuthData());
            })
            .catch(error => {
                console.log(error);
                dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Auth7) : error));
                dispatch(operationActions.clear());
                dispatch(signOut());
            });
    };
}

export function signInPIN(pin: string): AppThunkActionType {
    return (dispatch) => {
        dispatch(operationActions.start());
        signInPINAsync(pin)
            .then(() => {
                dispatch(loadAuthData());
            })
            .catch(error => {
                console.log(error);
                dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Auth8) : error));
                dispatch(operationActions.clear());
                dispatch(signOut());
            });
    };
}


async function signInPasswordAsync(password: string) {
    const dataEncryptionStoreKey = await StorageHelpers.getDataEncryptionStoreKeyAsync();
    if (!dataEncryptionStoreKey)
        throw new AppError(ErrorMessage.InvalidParameter, ErrorCode.Auth10);
    SecurityHelpers.createEncryptDecryptDataFunctions(dataEncryptionStoreKey, password);
}

async function signInPINAsync(pin: string) {
    const dataEncryptionStoreKey = await StorageHelpers.getDataEncryptionStoreKeyAsync();
    if (!dataEncryptionStoreKey)
        throw new AppError(ErrorMessage.InvalidParameter, ErrorCode.Auth11);
    await SecurityHelpers.createEncryptDecryptDataFunctionsPINAsync(dataEncryptionStoreKey, pin);
}

export function signOut(): AppThunkActionType {
    return (dispatch) => {
        dispatch(operationActions.start());
        try {
            SecurityHelpers.signOut();
            dispatch({ type: ActionTypes.CLEAR_REDUX_STORE });
            dispatch(loadAuthData());
        }
        catch (error) {
            console.log(error);
            dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Auth9) : error));
            dispatch(operationActions.clear());
        }
    };
}




