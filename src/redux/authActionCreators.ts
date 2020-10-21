import * as SecurityHelpers from '../modules/securityHelpers';
import * as StorageHelpers from '../modules/storageHelpers';
import * as operationActions from './operationActionCreators';
import * as ActionTypes from './actionTypes';
import { isNullOrEmpty } from '../modules/helpers';
import { ErrorMessage, ErrorCode } from '../modules/constants';
import { AppThunkActionType } from './configureStore';
import { AppError } from '../modules/appError';

export const loadAuthData = (): AppThunkActionType => (dispatch) => {
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

const loadAuthDataAsync = async () => {
    const authData = await SecurityHelpers.getLoginInfo();
    const dataEncryptionStoreKey = await StorageHelpers.getDataEncryptionStoreKey();
    authData.isEncrypted = isNullOrEmpty(dataEncryptionStoreKey) ? false : true;
    return authData;
};

export const signInPassword = (password: string): AppThunkActionType => (dispatch) => {
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

export const signInPIN = (pin: string): AppThunkActionType => (dispatch) => {
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


const signInPasswordAsync = async (password: string) => {
    const dataEncryptionStoreKey = await StorageHelpers.getDataEncryptionStoreKey();
    if (!dataEncryptionStoreKey)
        throw new AppError(ErrorMessage.InvalidParameter, ErrorCode.Auth10);
    await SecurityHelpers.createEncryptDecryptDataFunctions(dataEncryptionStoreKey, password);
};

const signInPINAsync = async (pin: string) => {
    const dataEncryptionStoreKey = await StorageHelpers.getDataEncryptionStoreKey();
    if (!dataEncryptionStoreKey)
        throw new AppError(ErrorMessage.InvalidParameter, ErrorCode.Auth11);
    await SecurityHelpers.createEncryptDecryptDataFunctionsPIN(dataEncryptionStoreKey, pin);
};

export const signOut = (): AppThunkActionType => (dispatch) => {
    dispatch(operationActions.start());
    SecurityHelpers.signOut()
        .then(() => {
            dispatch({ type: ActionTypes.CLEAR_REDUX_STORE });
            dispatch(loadAuthData());
        })
        .catch(error => {
            console.log(error);
            dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Auth9) : error));
            dispatch(operationActions.clear());
        });
};




