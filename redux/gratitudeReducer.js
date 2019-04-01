import * as ActionTypes from './ActionTypes';

export const gratitude = (state = {
    isLoading: true,
    errMess: null,
    gratitudes: []
}, action) => {
    switch(action.type) {
        case ActionTypes.ADD_GRATITUDE:
            return { ...state, isLoading: false, errMess: null, gratitudes: state.gratitudes.concat(action.payload) }
        case ActionTypes.GRATITUDE_LOADING:
            return { ...state, isLoading: true, errMess: null, gratitudes: [] }
        case ActionTypes.GRATITUDE_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, gratitudes: [] }
        case ActionTypes.GRATITUDE_LOADED:
            return { ...state, isLoading: false, errMess: null, gratitudes: action.payload }     
        case ActionTypes.GRATITUDE_DELETEFAILED:
            return { ...state, isLoading: false, errMess: action.payload }
        case ActionTypes.GRATITUDE_DELETESUCCEEDED:
            return { ...state, isLoading: false, errMess: null }        
        default: 
            return state;
    } 
}