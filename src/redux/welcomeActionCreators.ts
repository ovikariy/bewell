import * as securityService from '../modules/securityService';
import * as operationActions from './operationActionCreators';
import { loadAuthData } from './authActionCreators';
import { ErrorMessage, ErrorCode } from '../modules/constants';
import { AppThunkActionType } from './store';
import { AppError } from '../modules/types';
import { consoleLogWithColor } from '../modules/utils';

export function initialize(): AppThunkActionType {
    return (dispatch) => {
        /* this should be called once on intitial app launch */
        dispatch(operationActions.start());
        securityService.initializeAsync()
            .then(() => {
                dispatch(loadAuthData());
            })
            .catch(error => {
                consoleLogWithColor(error);
                dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Security8) : error));
                dispatch(operationActions.clear());
            });
    };
}




