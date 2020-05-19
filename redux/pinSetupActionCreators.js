import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as GenericActions from './operationActionCreators';
import { validatePasswordAsync } from './passwordActionCreators';
import * as ActionTypes from './ActionTypes';
import { Errors, text } from '../modules/Constants';
import { isNullOrEmpty } from '../modules/helpers';
import { loadAuthData } from './authActionCreators';

export const startPINsetup = () => (dispatch) => {
    dispatch(GenericActions.operationCleared());
    if (SecurityHelpers.isSignedIn() !== true) {
        dispatch(GenericActions.operationFailed(Errors.Unauthorized));
        return;
    }
    dispatch({ type: ActionTypes.PIN_SETUP_STARTED });
}

export const verifyPassword = (password) => (dispatch) => {
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
            dispatch(GenericActions.operationFailed(Errors.InvalidPassword));
            dispatch(GenericActions.operationCleared());
        })
}

export const submitPIN = (password, pin) => (dispatch) => {
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
            dispatch(GenericActions.operationSucceeded(text.successMessages.PINSet));
            dispatch(GenericActions.operationCleared());
        })
        .catch(err => {
            dispatch({ type: ActionTypes.PIN_SETUP_FAILED });
            dispatch(GenericActions.operationFailed(err.message));
            dispatch(GenericActions.operationCleared());
        });
}

const submitPINAsync = async (password, pin) => {
    /* verify password one more time */
    const isValidPassword = await validatePasswordAsync(password);
    if (!isValidPassword) {
        throw new Error(Errors.InvalidPassword);
    }
    await SecurityHelpers.setupNewPINAsync(password, pin);
}



