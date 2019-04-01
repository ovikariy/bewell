import * as ActionTypes from './ActionTypes';

export const note = (state = {
    isLoading: true,
    errMess: null,
    notes: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_NOTE:
            return { ...state, isLoading: false, errMess: null, notes: state.notes.concat(action.payload) }
        case ActionTypes.NOTE_LOADING:
            return { ...state, isLoading: true, errMess: null, notes: [] }
        case ActionTypes.NOTE_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, notes: [] }
        case ActionTypes.NOTE_LOADED:
            return { ...state, isLoading: false, errMess: null, notes: action.payload }
        case ActionTypes.NOTE_DELETEFAILED:
            return { ...state, isLoading: false, errMess: action.payload }
        case ActionTypes.NOTE_DELETESUCCEEDED:
            return { ...state, isLoading: false, errMess: null }
        default:
            return state;
    }
}