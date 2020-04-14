import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as StorageHelpers from '../modules/StorageHelpers';
import * as GenericActions from './operationActionCreators';
import * as ActionTypes from './ActionTypes';
import { Errors, text, storeConstants, ErrorCodes } from '../modules/Constants';

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

export const signIn = (password) => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    signInAsync(password)
        .then(() => {
            dispatch(loadAuthData());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        })
}

const signInAsync = async (password) => {
    const dataEncryptionStoreKey = await StorageHelpers.getDataEncryptionStoreKey();
    await SecurityHelpers.createEncryptDecryptDataFunctions(dataEncryptionStoreKey, password);
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

export const initialize = () => (dispatch) => {
    /* this should be called once on intitial app launch */
    dispatch(GenericActions.operationProcessing());
    StorageHelpers.setItemsAsync(storeConstants.isInitialized, 'true')
        .then(() => {
            dispatch(loadAuthData());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        })
}

export const skipSecuritySetup = () => (dispatch) => {
    /* this updates a flag in redux to prevent showing the setup security screen again in current session */
    dispatch({ type: ActionTypes.SKIP_SECURITY_SETUP });
}




