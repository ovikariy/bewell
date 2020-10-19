import * as ActionTypes from './ActionTypes';

export const operationProcessing = () => ({
    type: ActionTypes.OPERATION_PROCESSING
});

export const operationSucceeded = (successCodes: string | string[]) => ({
    type: ActionTypes.OPERATION_SUCCEEDED,
    payload: { successCodes }
});

export const operationFailed = (errCodes: string | string[]) => ({
    type: ActionTypes.OPERATION_FAILED,
    payload: { errCodes }
});

export const operationCleared = () => ({
    type: ActionTypes.OPERATION_CLEARED
});