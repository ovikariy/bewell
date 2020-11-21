import * as securityService from '../modules/securityService';
import * as storage from '../modules/storage';
import * as operationActions from './operationActionCreators';
import { validatePasswordAsync } from './passwordActionCreators';
import * as ActionTypes from './actionTypes';
import { ErrorMessage, ErrorCode } from '../modules/constants';
import { consoleLogWithColor, isNullOrEmpty } from '../modules/utils';
import { loadAuthData } from './authActionCreators';
import { AppThunkActionType } from './store';
import { AppError } from '../modules/types';

export function startPINsetup(): AppThunkActionType {
    return (dispatch) => {
        dispatch(operationActions.clear());
        if (securityService.isSignedIn() !== true) {
            dispatch(operationActions.fail(new AppError(ErrorMessage.Unauthorized)));
            return;
        }
        dispatch({ type: ActionTypes.PIN_SETUP_STARTED });
    };
}

export function verifyPassword(password: string): AppThunkActionType {
    return (dispatch) => {
        if (securityService.isSignedIn() !== true) {
            dispatch(operationActions.fail(new AppError(ErrorMessage.Unauthorized)));
            return;
        }
        dispatch(operationActions.start());
        validatePasswordAsync(password)
            .then(() => {
                dispatch({ type: ActionTypes.PIN_SETUP_PASSWORD_VERIFIED });
                dispatch(operationActions.clear());
            })
            .catch(error => {
                consoleLogWithColor(error);
                dispatch({ type: ActionTypes.PIN_SETUP_PASSWORD_FAILED });
                dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.InvalidPassword) : error));
                dispatch(operationActions.clear());
            });
    };
}

export function submitPIN(password: string, pin: string): AppThunkActionType {
    return (dispatch) => {
        if (securityService.isSignedIn() !== true) {
            dispatch(operationActions.fail(new AppError(ErrorMessage.Unauthorized)));
            return;
        }
        if (isNullOrEmpty(pin)) {
            dispatch(operationActions.fail(new AppError(ErrorMessage.InvalidParameter)));
            return;
        }
        dispatch(operationActions.start());
        submitPINAsync(password, pin)
            .then(() => {
                dispatch({ type: ActionTypes.PIN_SETUP_COMPLETE });
                dispatch(loadAuthData());
                dispatch(operationActions.complete(ErrorMessage.PinSet));
                dispatch(operationActions.clear());
            })
            .catch(error => {
                dispatch({ type: ActionTypes.PIN_SETUP_FAILED });
                dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Security4) : error));
                dispatch(operationActions.clear());
            });
    };
}

async function submitPINAsync(password: string, pin: string) {
    /* verify password one more time */
    await validatePasswordAsync(password);
    const dataEncryptionKey = await storage.getDataEncryptionStoreKeyAsync(); /** from AsyncStorage */
    if (!dataEncryptionKey)
        throw new AppError(ErrorMessage.InvalidParameter, ErrorCode.Security9);
    await securityService.setupNewPINAsync(password, pin, dataEncryptionKey);
}



