import * as ActionTypes from './ActionTypes';

export const operation = (state = {
    isLoading: true,
    errMess: null,
    successMess: null
}, action) => {
    switch (action.type) {
        case ActionTypes.OPERATION_PROCESSING:
            return { ...state, isLoading: true, errMess: null, successMess: null }
        case ActionTypes.OPERATION_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, successMess: null }
        case ActionTypes.OPERATION_SUCCEEDED:
            return { ...state, isLoading: false, errMess: null, successMess: action.payload }
        case ActionTypes.OPERATION_CLEARED:
            return { ...state, isLoading: false, errMess: null, successMess: null }
        default:
            return state;
    }
}