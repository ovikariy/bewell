import * as ActionTypes from './ActionTypes';

export const allItems = (state = {
    isLoading: true,
    errMess: null,
    allItems: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ALLITEMS_LOADING:
            return { ...state, isLoading: true, errMess: null, allItems: [] }
        case ActionTypes.ALLITEMS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, allItems: [] }
        case ActionTypes.ALLITEMS_LOADED:
            return { ...state, isLoading: false, errMess: null, allItems: action.payload }
        default:
            return state;
    }
}