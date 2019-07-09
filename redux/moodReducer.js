import * as ActionTypes from './ActionTypes';

export const mood = (state = {
    isLoading: true,
    errMess: null,
    successMess: null,
    items: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_MOOD:
            return { ...state, isLoading: false, errMess: null, successMess: null, items: state.items.concat(action.payload) }
        case ActionTypes.MOOD_LOADING:
            return { ...state, isLoading: true, errMess: null, successMess: null, items: [] }
        case ActionTypes.MOOD_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, successMess: null, items: [] }
        case ActionTypes.MOOD_LOADED:
            return { ...state, isLoading: false, errMess: null, successMess: null, items: action.payload }
        case ActionTypes.MOOD_DELETEFAILED:
            return { ...state, isLoading: false, errMess: action.payload, successMess: null }
        case ActionTypes.MOOD_DELETESUCCEEDED:
            return { ...state, isLoading: false, errMess: null, successMess: action.payload }
        default:
            return state;
    }
}