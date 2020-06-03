import * as ActionTypes from './ActionTypes';

export const operationProcessing = () => ({
    type: ActionTypes.OPERATION_PROCESSING
})

export const operationSucceeded = (message) => ({
    type: ActionTypes.OPERATION_SUCCEEDED,
    payload: { successMess: message }
})

export const operationFailed = (message) => ({
    type: ActionTypes.OPERATION_FAILED,
    payload: { errMess: message }
})

export const operationCleared = () => ({
    type: ActionTypes.OPERATION_CLEARED
})