import * as ActionTypes from './ActionTypes';

export const OPERATION = (state = {
    isLoading: true,
    errMess: null,
    successMess: null,
    items: {}
}, action) => {
    switch (action.type) {
        case ActionTypes.OPERATION_PROCESSING: {
            const result = { ...state, isLoading: true, errMess: null, successMess: null };
            if (action.payload && action.payload.itemTypeName)
                result.items = { ...state.items, [action.payload.itemTypeName]: action.payload.items }
            return result;
        }
        case ActionTypes.OPERATION_COMPLETED: {
            const result = { ...state, isLoading: false, errMess: null, successMess: null };
            if (action.payload && action.payload.itemTypeName)
                result.items = { ...state.items, [action.payload.itemTypeName]: action.payload.items }
            return result;
        }
        case ActionTypes.OPERATION_FAILED: {
            const result = { ...state, isLoading: false, errMess: action.payload.errMess, successMess: null };
            if (action.payload && action.payload.itemTypeName)
                result.items = { ...state.items, [action.payload.itemTypeName]: action.payload.items }
            return result;
        }
        case ActionTypes.OPERATION_SUCCEEDED: {
            const result = { ...state, isLoading: false, errMess: null, successMess: action.payload.successMess };
            if (action.payload && action.payload.itemTypeName)
                result.items = { ...state.items, [action.payload.itemTypeName]: action.payload.items }
            return result;
        }
        case ActionTypes.OPERATION_CLEARED:
            return { ...state, isLoading: false, errMess: null, successMess: null }
        default:
            return state;
    }
}