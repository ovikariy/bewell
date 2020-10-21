import { AppError } from '../modules/appError';
import * as ActionTypes from './actionTypes';

export const start = () => ({
    type: ActionTypes.OPERATION_START
});

export const complete = (successMessage: string) => ({
    type: ActionTypes.OPERATION_SUCCEED,
    payload: { successMessage }
});

export const fail = (error: AppError) => ({
    type: ActionTypes.OPERATION_FAIL,
    payload: { error }
});

export const clear = () => ({
    type: ActionTypes.OPERATION_CLEAR
});