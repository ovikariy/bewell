import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as GenericActions from './operationActionCreators';
import { validatePasswordAsync } from './passwordActionCreators';
import * as ActionTypes from './ActionTypes';
import { Errors, ErrorCodes } from '../modules/Constants';
import { isNullOrEmpty } from '../modules/helpers';
import { loadAuthData } from './authActionCreators';
import { AppThunkActionType } from './configureStore';

export const startPINsetup = (): AppThunkActionType => (dispatch) => {
    dispatch(GenericActions.operationCleared());
    if (SecurityHelpers.isSignedIn() !== true) {
        dispatch(GenericActions.operationFailed(Errors.Unauthorized));
        return;
    }
    dispatch({ type: ActionTypes.PIN_SETUP_STARTED });
}

export const verifyPassword = (password: string): AppThunkActionType => (dispatch) => {
    if (SecurityHelpers.isSignedIn() !== true) {
        dispatch(GenericActions.operationFailed(Errors.Unauthorized));
        return;
    }
    dispatch(GenericActions.operationProcessing());
    validatePasswordAsync(password)
        .then(() => {
            dispatch({ type: ActionTypes.PIN_SETUP_PASSWORD_VERIFIED });
            dispatch(GenericActions.operationCleared());
        })
        .catch(error => {
            console.log(error);
            dispatch({ type: ActionTypes.PIN_SETUP_PASSWORD_FAILED });
            dispatch(GenericActions.operationFailed(error.message ? Errors.InvalidPassword : error));
            dispatch(GenericActions.operationCleared());
        })
}

export const submitPIN = (password: string, pin: string): AppThunkActionType => (dispatch) => {
    if (SecurityHelpers.isSignedIn() !== true) {
        dispatch(GenericActions.operationFailed(Errors.Unauthorized));
        return;
    }
    if (isNullOrEmpty(pin)) {
        dispatch(GenericActions.operationFailed(Errors.InvalidParameter));
        return;
    }
    dispatch(GenericActions.operationProcessing());
    submitPINAsync(password, pin)
        .then(() => {
            dispatch({ type: ActionTypes.PIN_SETUP_COMPLETE });
            dispatch(loadAuthData());
            dispatch(GenericActions.operationSucceeded(Errors.PinSet));
            dispatch(GenericActions.operationCleared());
        })
        .catch(error => {
            dispatch({ type: ActionTypes.PIN_SETUP_FAILED });
            dispatch(GenericActions.operationFailed(error.message ? [Errors.General, ErrorCodes.Security8] : error));
            dispatch(GenericActions.operationCleared());
        });
}

const submitPINAsync = async (password: string, pin: string) => {
    /* verify password one more time */
    await validatePasswordAsync(password);
    await SecurityHelpers.setupNewPINAsync(password, pin);
}



