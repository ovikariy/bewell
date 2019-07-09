import * as ActionTypes from './ActionTypes';

export const security = (state = {
    isLoading: true,
    errMess: null,
    successMess: null
}, action) => {
    switch (action.type) {
        case ActionTypes.PASSWORD_LOADING:
            return { ...state, isLoading: true, errMess: null, successMess: null }
        case ActionTypes.PASSWORD_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, successMess: null }
        case ActionTypes.PASSWORD_SUCCEEDED:
            return { ...state, isLoading: false, errMess: null, successMess: action.payload }
        case ActionTypes.MESSAGES_CLEARED:
            return { ...state, isLoading: false, errMess: null, successMess: null }
        default:
            return state;
    }
}