import * as ActionTypes from './ActionTypes';

export const operationProcessing = () => ({
    type: ActionTypes.OPERATION_PROCESSING
})

export const operationUpdateRedux = (key, items) => ({
    type: ActionTypes.UPDATE_ITEM_IN_REDUX,
    payload: { key: key, items: items }
})

export const operationRemoveFromRedux = (key, id) => ({
    type: ActionTypes.REMOVE_ITEM_FROM_REDUX,
    payload: { key, id }
})

export const operationAfterPersist = (key, items) => ({
    type: ActionTypes.AFTER_PERSIST
})

export const operationReplaceRedux = (items) => ({
    type: ActionTypes.REPLACE_ITEMS_IN_REDUX,
    payload: { items }
})

export const operationClearRedux = () => ({
    type: ActionTypes.CLEAR_REDUX
})

export const operationCompleted = (key, items) => ({
    type: ActionTypes.OPERATION_COMPLETED,
    payload: { key: key, items }
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