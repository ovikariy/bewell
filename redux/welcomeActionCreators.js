import * as StorageHelpers from '../modules/StorageHelpers';
import * as GenericActions from './operationActionCreators';
import * as ActionTypes from './ActionTypes';
import { storeConstants } from '../modules/Constants';
import { loadAuthData } from './authActionCreators';

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
    dispatch(initialize());
    /* this updates a flag in redux to prevent showing the setup security screen again in current session */
    dispatch({ type: ActionTypes.SKIP_SECURITY_SETUP });
}




