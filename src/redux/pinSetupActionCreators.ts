import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as operationActions from './operationActionCreators';
import { validatePasswordAsync } from './passwordActionCreators';
import * as ActionTypes from './ActionTypes';
import { ErrorMessage, ErrorCode } from '../modules/Constants';
import { isNullOrEmpty } from '../modules/helpers';
import { loadAuthData } from './authActionCreators';
import { AppThunkActionType } from './configureStore';
import { AppError } from '../modules/AppError';

export const startPINsetup = (): AppThunkActionType => (dispatch) => {
    dispatch(operationActions.clear());
    if (SecurityHelpers.isSignedIn() !== true) {
        dispatch(operationActions.fail(new AppError(ErrorMessage.Unauthorized)));
        return;
    }
    dispatch({ type: ActionTypes.PIN_SETUP_STARTED });
};

export const verifyPassword = (password: string): AppThunkActionType => (dispatch) => {
    if (SecurityHelpers.isSignedIn() !== true) {
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
            console.log(error);
            dispatch({ type: ActionTypes.PIN_SETUP_PASSWORD_FAILED });
            dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.InvalidPassword) : error));
            dispatch(operationActions.clear());
        });
};

export const submitPIN = (password: string, pin: string): AppThunkActionType => (dispatch) => {
    if (SecurityHelpers.isSignedIn() !== true) {
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

const submitPINAsync = async (password: string, pin: string) => {
    /* verify password one more time */
    await validatePasswordAsync(password);
    await SecurityHelpers.setupNewPINAsync(password, pin);
};



