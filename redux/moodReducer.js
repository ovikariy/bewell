import * as ActionTypes from './ActionTypes';

export const mood = (state = {
    isLoading: true,
    errMess: null,
    moods: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_MOOD:
            return { ...state, isLoading: false, errMess: null, moods: state.moods.concat(action.payload) }
        case ActionTypes.MOOD_LOADING:
            return { ...state, isLoading: true, errMess: null, moods: [] }
        case ActionTypes.MOOD_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, moods: [] }
        case ActionTypes.MOOD_LOADED:
            return { ...state, isLoading: false, errMess: null, moods: action.payload }
        case ActionTypes.MOOD_DELETEFAILED:
            return { ...state, isLoading: false, errMess: action.payload }
        case ActionTypes.MOOD_DELETESUCCEEDED:
            return { ...state, isLoading: false, errMess: null }
        default:
            return state;
    }
}