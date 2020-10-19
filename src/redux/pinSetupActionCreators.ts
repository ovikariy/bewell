import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as operationActions from './operationActionCreators';
import { validatePasswordAsync } from './passwordActionCreators';
import * as ActionTypes from './ActionTypes';
import { Errors, ErrorCodes } from '../modules/Constants';
import { isNullOrEmpty } from '../modules/helpers';
import { loadAuthData } from './authActionCreators';
import { AppThunkActionType } from './configureStore';

export const startPINsetup = (): AppThunkActionType => (dispatch) => {
    dispatch(operationActions.clear());
    if (SecurityHelpers.isSignedIn() !== true) {
        dispatch(operationActions.fail(Errors.Unauthorized));
        return;
    }
    dispatch({ type: ActionTypes.PIN_SETUP_STARTED });
};

export const verifyPassword = (password: string): AppThunkActionType => (dispatch) => {
    if (SecurityHelpers.isSignedIn() !== true) {
        dispatch(operationActions.fail(Errors.Unauthorized));
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
            dispatch(operationActions.fail(error.message ? Errors.InvalidPassword : error));
            dispatch(operationActions.clear());
        });
};

export const submitPIN = (password: string, pin: string): AppThunkActionType => (dispatch) => {
    if (SecurityHelpers.isSignedIn() !== true) {
        dispatch(operationActions.fail(Errors.Unauthorized));
        return;
    }
    if (isNullOrEmpty(pin)) {
        dispatch(operationActions.fail(Errors.InvalidParameter));
        return;
    }
    dispatch(operationActions.start());
    submitPINAsync(password, pin)
        .then(() => {
            dispatch({ type: ActionTypes.PIN_SETUP_COMPLETE });
            dispatch(loadAuthData());
            dispatch(operationActions.complete(Errors.PinSet));
            dispatch(operationActions.clear());
        })
        .catch(error => {
            dispatch({ type: ActionTypes.PIN_SETUP_FAILED });
            dispatch(operationActions.fail(error.message ? [Errors.General, ErrorCodes.Security4] : error));
            dispatch(operationActions.clear());
        });
};

const submitPINAsync = async (password: string, pin: string) => {
    /* verify password one more time */
    await validatePasswordAsync(password);
    await SecurityHelpers.setupNewPINAsync(password, pin);
};



