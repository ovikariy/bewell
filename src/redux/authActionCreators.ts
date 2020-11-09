import * as securityService from '../modules/securityService';
import * as storage from '../modules/storage';
import * as operationActions from './operationActionCreators';
import * as ActionTypes from './actionTypes';
import { consoleLogWithColor, isNullOrEmpty } from '../modules/utils';
import { ErrorMessage, ErrorCode } from '../modules/constants';
import { AppThunkActionType } from './store';
import { AppError } from '../modules/types';

export function loadAuthData(): AppThunkActionType {
    return (dispatch) => {
        dispatch(operationActions.start());
        loadAuthDataAsync()
            .then((authData) => {
                dispatch({ type: ActionTypes.LOADED_AUTH_DATA, payload: { authData } });
                dispatch(operationActions.clear());
            })
            .catch(error => {
                consoleLogWithColor(error);
                dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Auth3) : error));
                dispatch(operationActions.clear());
            });
    };
}

async function loadAuthDataAsync() {
    const authData = await securityService.getLoginInfoAsync();
    const dataEncryptionStoreKey = await storage.getDataEncryptionStoreKeyAsync();
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
                consoleLogWithColor(error);
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
                consoleLogWithColor(error);
                dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Auth8) : error));
                dispatch(operationActions.clear());
                dispatch(signOut());
            });
    };
}


async function signInPasswordAsync(password: string) {
    const dataEncryptionStoreKey = await storage.getDataEncryptionStoreKeyAsync();
    if (!dataEncryptionStoreKey)
        throw new AppError(ErrorMessage.InvalidParameter, ErrorCode.Auth10);
    securityService.createEncryptDecryptDataFunctions(dataEncryptionStoreKey, password);
}

async function signInPINAsync(pin: string) {
    const dataEncryptionStoreKey = await storage.getDataEncryptionStoreKeyAsync();
    if (!dataEncryptionStoreKey)
        throw new AppError(ErrorMessage.InvalidParameter, ErrorCode.Auth11);
    await securityService.createEncryptDecryptDataFunctionsPINAsync(dataEncryptionStoreKey, pin);
}

export function signOut(): AppThunkActionType {
    return (dispatch) => {
        dispatch(operationActions.start());
        try {
            securityService.signOut();
            dispatch({ type: ActionTypes.CLEAR_REDUX_STORE });
            dispatch(loadAuthData());
        }
        catch (error) {
            consoleLogWithColor(error);
            dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Auth9) : error));
            dispatch(operationActions.clear());
        }
    };
}




