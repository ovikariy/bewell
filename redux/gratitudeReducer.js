import * as ActionTypes from './ActionTypes';

export const GRATITUDE = (state = {
    isLoading: true,
    errMess: null,
    successMess: null,
    items: []
}, action) => {
    switch(action.type) {
        case ActionTypes.ADD_GRATITUDE:
            return { ...state, isLoading: false, errMess: null, successMess: null, items: state.items.concat(action.payload) }
        case ActionTypes.GRATITUDE_LOADING:
            return { ...state, isLoading: true, errMess: null, successMess: null, items: [] }
        case ActionTypes.GRATITUDE_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, successMess: null, items: [] }
        case ActionTypes.GRATITUDE_LOADED:
            return { ...state, isLoading: false, errMess: null, successMess: null, items: action.payload }     
        case ActionTypes.GRATITUDE_DELETEFAILED:
            return { ...state, isLoading: false, errMess: action.payload, successMess: null }
        case ActionTypes.GRATITUDE_DELETESUCCEEDED:
            return { ...state, isLoading: false, errMess: null, successMess: action.payload }        
        default: 
            return state;
    } 
}