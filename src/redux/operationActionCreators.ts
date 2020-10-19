import * as ActionTypes from './ActionTypes';

export const start = () => ({
    type: ActionTypes.OPERATION_START
});

export const complete = (successCodes: string | string[]) => ({
    type: ActionTypes.OPERATION_SUCCEED,
    payload: { successCodes }
});

export const fail = (errCodes: string | string[]) => ({
    type: ActionTypes.OPERATION_FAIL,
    payload: { errCodes }
});

export const clear = () => ({
    type: ActionTypes.OPERATION_CLEAR
});