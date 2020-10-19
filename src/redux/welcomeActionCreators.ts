import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as GenericActions from './operationActionCreators';
import { loadAuthData } from './authActionCreators';
import { Errors, ErrorCodes } from '../modules/Constants';
import { AppThunkActionType } from './configureStore';

export const initialize = (): AppThunkActionType => (dispatch) => {
    /* this should be called once on intitial app launch */
    dispatch(GenericActions.operationProcessing());
    SecurityHelpers.initialize()
        .then(() => {
            dispatch(loadAuthData());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message ? [Errors.General, ErrorCodes.Security4] : error));
            dispatch(GenericActions.operationCleared());
        });
};




