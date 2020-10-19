import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as operationActions from './operationActionCreators';
import { loadAuthData } from './authActionCreators';
import { Errors, ErrorCodes } from '../modules/Constants';
import { AppThunkActionType } from './configureStore';

export const initialize = (): AppThunkActionType => (dispatch) => {
    /* this should be called once on intitial app launch */
    dispatch(operationActions.start());
    SecurityHelpers.initialize()
        .then(() => {
            dispatch(loadAuthData());
        })
        .catch(error => {
            console.log(error);
            dispatch(operationActions.fail(error.message ? [Errors.General, ErrorCodes.Security4] : error));
            dispatch(operationActions.clear());
        });
};




