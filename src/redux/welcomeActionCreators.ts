import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as operationActions from './operationActionCreators';
import { loadAuthData } from './authActionCreators';
import { ErrorMessage, ErrorCode } from '../modules/Constants';
import { AppThunkActionType } from './configureStore';
import { AppError } from '../modules/AppError';

export const initialize = (): AppThunkActionType => (dispatch) => {
    /* this should be called once on intitial app launch */
    dispatch(operationActions.start());
    SecurityHelpers.initialize()
        .then(() => {
            dispatch(loadAuthData());
        })
        .catch(error => {
            console.log(error);
            dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Security8) : error));
            dispatch(operationActions.clear());
        });
};




