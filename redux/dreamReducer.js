import * as ActionTypes from './ActionTypes';

export const DREAM = (state = {
    isLoading: true,
    errMess: null,
    successMess: null,
    items: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_DREAM:
            return { ...state, isLoading: false, errMess: null, successMess: null, items: state.items.concat(action.payload) }
        case ActionTypes.DREAM_LOADING:
            return { ...state, isLoading: true, errMess: null, successMess: null, items: [] }
        case ActionTypes.DREAM_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, successMess: null, items: [] }
        case ActionTypes.DREAM_LOADED:
            return { ...state, isLoading: false, errMess: null, successMess: null, items: action.payload }
        case ActionTypes.DREAM_DELETEFAILED:
            return { ...state, isLoading: false, errMess: action.payload, successMess: null }
        case ActionTypes.DREAM_DELETESUCCEEDED:
            return { ...state, isLoading: false, errMess: null, successMess: action.payload }
        default:
            return state;
    }
}