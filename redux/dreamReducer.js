import * as ActionTypes from './ActionTypes';

export const dream = (state = {
    isLoading: true,
    errMess: null,
    dreams: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_DREAM:
            return { ...state, isLoading: false, errMess: null, dreams: state.dreams.concat(action.payload) }
        case ActionTypes.DREAM_LOADING:
            return { ...state, isLoading: true, errMess: null, dreams: [] }
        case ActionTypes.DREAM_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, dreams: [] }
        case ActionTypes.DREAM_LOADED:
            return { ...state, isLoading: false, errMess: null, dreams: action.payload }
        case ActionTypes.DREAM_DELETEFAILED:
            return { ...state, isLoading: false, errMess: action.payload }
        case ActionTypes.DREAM_DELETESUCCEEDED:
            return { ...state, isLoading: false, errMess: null }
        default:
            return state;
    }
}