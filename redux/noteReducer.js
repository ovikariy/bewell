import * as ActionTypes from './ActionTypes';

export const NOTE = (state = {
    isLoading: true,
    errMess: null,
    successMess: null,
    items: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_NOTE:
            return { ...state, isLoading: false, errMess: null, successMess: null, items: state.items.concat(action.payload) }
        case ActionTypes.NOTE_LOADING:
            return { ...state, isLoading: true, errMess: null, successMess: null, items: [] }
        case ActionTypes.NOTE_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, successMess: null, items: [] }
        case ActionTypes.NOTE_LOADED:
            return { ...state, isLoading: false, errMess: null, successMess: null, items: action.payload }
        case ActionTypes.NOTE_DELETEFAILED:
            return { ...state, isLoading: false, errMess: action.payload, successMess: null }
        case ActionTypes.NOTE_DELETESUCCEEDED:
            return { ...state, isLoading: false, errMess: null, successMess: action.payload }
        default:
            return state;
    }
}