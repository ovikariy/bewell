import * as ActionTypes from './ActionTypes';

export const sleep = (state = {
    isLoading: true,
    errMess: null,
    sleeps: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_SLEEP:
            return { ...state, isLoading: false, errMess: null, sleeps: state.sleeps.concat(action.payload) }
        case ActionTypes.SLEEP_LOADING:
            return { ...state, isLoading: true, errMess: null, sleeps: [] }
        case ActionTypes.SLEEP_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, sleeps: [] }
        case ActionTypes.SLEEP_LOADED:
            return { ...state, isLoading: false, errMess: null, sleeps: action.payload }
        case ActionTypes.SLEEP_DELETEFAILED:
            return { ...state, isLoading: false, errMess: action.payload }
        case ActionTypes.SLEEP_DELETESUCCEEDED:
            return { ...state, isLoading: false, errMess: null }
        default:
            return state;
    }
}