import { AppError } from '../modules/appError';
import * as ActionTypes from './actionTypes';

export function start() {
    return ({
        type: ActionTypes.OPERATION_START
    });
}

export function complete(successMessage: string) {
    return ({
        type: ActionTypes.OPERATION_SUCCEED,
        payload: { successMessage }
    });
}

export function fail(error: AppError) {
    return ({
        type: ActionTypes.OPERATION_FAIL,
        payload: { error }
    });
}

export function clear() {
    return ({
        type: ActionTypes.OPERATION_CLEAR
    });
}