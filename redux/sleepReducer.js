import * as ActionTypes from './ActionTypes';

export const SLEEP = (state = {
    isLoading: true,
    errMess: null,
    successMess: null,
    items: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_SLEEP:
            return { ...state, isLoading: false, errMess: null, successMess: null, items: state.items.concat(action.payload) }
        case ActionTypes.SLEEP_LOADING:
            return { ...state, isLoading: true, errMess: null, successMess: null, items: [] }
        case ActionTypes.SLEEP_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, successMess: null, items: [] }
        case ActionTypes.SLEEP_LOADED:
            return { ...state, isLoading: false, errMess: null, successMess: null, items: action.payload }
        case ActionTypes.SLEEP_DELETEFAILED:
            return { ...state, isLoading: false, errMess: action.payload, successMess: null }
        case ActionTypes.SLEEP_DELETESUCCEEDED:
            return { ...state, isLoading: false, errMess: null, successMess: action.payload }
        default:
            return state;
    }
}