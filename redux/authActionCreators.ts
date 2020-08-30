import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as StorageHelpers from '../modules/StorageHelpers';
import * as GenericActions from './operationActionCreators';
import * as ActionTypes from './ActionTypes';
import { isNullOrEmpty } from '../modules/helpers';
import { Errors, ErrorCodes } from '../modules/Constants';
import { AppThunkActionType } from './configureStore';

export const loadAuthData = (): AppThunkActionType => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    loadAuthDataAsync()
        .then((authData) => {
            dispatch({ type: ActionTypes.LOADED_AUTH_DATA, payload: { authData } });
            dispatch(GenericActions.operationCleared());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message ? [Errors.General, ErrorCodes.Auth3] : error));
            dispatch(GenericActions.operationCleared());
        })
}

const loadAuthDataAsync = async () => {
    //await signInPasswordAsync('testpassword'); //TODO: remove after testing
    //await signInPINAsync('1234'); //TODO: remove after testing 
    const authData = await SecurityHelpers.getLoginInfo();
    const dataEncryptionStoreKey = await StorageHelpers.getDataEncryptionStoreKey();
    authData.isEncrypted = isNullOrEmpty(dataEncryptionStoreKey) ? false : true;
    return authData;
};

export const signInPassword = (password: string): AppThunkActionType => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    signInPasswordAsync(password)
        .then(() => {
            dispatch(loadAuthData());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message ? [Errors.General, ErrorCodes.Auth7] : error));
            dispatch(GenericActions.operationCleared());
        })
}

export const signInPIN = (pin: string): AppThunkActionType => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    signInPINAsync(pin)
        .then(() => {
            dispatch(loadAuthData());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message ? [Errors.General, ErrorCodes.Auth8] : error));
            dispatch(GenericActions.operationCleared());
        })
}


const signInPasswordAsync = async (password: string) => {
    const dataEncryptionStoreKey = await StorageHelpers.getDataEncryptionStoreKey();
    if (!dataEncryptionStoreKey)
        throw [Errors.InvalidParameter, ErrorCodes.Auth10];
    await SecurityHelpers.createEncryptDecryptDataFunctions(dataEncryptionStoreKey, password);
}

const signInPINAsync = async (pin: string) => {
    const dataEncryptionStoreKey = await StorageHelpers.getDataEncryptionStoreKey();
    if (!dataEncryptionStoreKey)
        throw [Errors.InvalidParameter, ErrorCodes.Auth11];
    await SecurityHelpers.createEncryptDecryptDataFunctionsPIN(dataEncryptionStoreKey, pin);
}

export const signOut = (): AppThunkActionType => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    SecurityHelpers.signOut()
        .then(() => {
            dispatch({ type: ActionTypes.CLEAR_REDUX_STORE });
            dispatch(loadAuthData());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message ? [Errors.General, ErrorCodes.Auth9] : error));
            dispatch(GenericActions.operationCleared());
        })
};




