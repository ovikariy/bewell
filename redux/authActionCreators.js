import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as StorageHelpers from '../modules/StorageHelpers';
import * as GenericActions from './operationActionCreators';
import * as ActionTypes from './ActionTypes';

export const loadAuthData = () => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    loadAuthDataAsync()
        .then((authData) => {
            dispatch({ type: ActionTypes.LOAD_AUTH_DATA, authData: authData });
            dispatch(GenericActions.operationCleared());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        })
}

const loadAuthDataAsync = async () => {
    const userDataInfo = await StorageHelpers.getUserDataInfo();
    const loginInfo = await SecurityHelpers.getLoginInfo();

    const authData = {};
    authData.isInitialized = userDataInfo.isInitialized;
    authData.isDataEncrypted = userDataInfo.isDataEncrypted;
    authData.hasPasswordInStore = loginInfo.hasPasswordInStore;
    authData.loginAttempts = loginInfo.loginAttempts;
    authData.isSignedIn = loginInfo.isSignedIn;

    console.log('authData ' + JSON.stringify(authData));

    return authData;
};

export const signInPassword = (password) => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    signInPasswordAsync(password)
        .then(() => {
            dispatch(loadAuthData());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        })
}

export const signInPIN = (pin) => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    signInPINAsync(pin)
        .then(() => {
            dispatch(loadAuthData());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        })
}


const signInPasswordAsync = async (password) => {
    const dataEncryptionStoreKey = await StorageHelpers.getDataEncryptionStoreKey();
    await SecurityHelpers.createEncryptDecryptDataFunctions(dataEncryptionStoreKey, password);
}

const signInPINAsync = async (pin) => {
    const dataEncryptionStoreKey = await StorageHelpers.getDataEncryptionStoreKey();
    await SecurityHelpers.createEncryptDecryptDataFunctionsPIN(dataEncryptionStoreKey, pin);
}

export const signOut = () => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    SecurityHelpers.signOut()
        .then(() => {
            //TODO: clear data redux?
            dispatch({ type: ActionTypes.SIGN_OUT });
            dispatch(loadAuthData());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        })
};




