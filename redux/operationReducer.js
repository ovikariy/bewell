import * as ActionTypes from './ActionTypes';
import { mergeArraysImmutable, updateArrayImmutable } from '../modules/helpers';

export const OPERATION = (state = {
    isLoading: true,
    errMess: null,
    successMess: null,
    store: {},
    dirtyKeys: {}
}, action) => {
    switch (action.type) {
        case ActionTypes.UPDATE_ITEM_IN_REDUX: {
            const newState = { ...state, isLoading: false, errMess: null, successMess: null };
            if (action.payload && action.payload.key) {
                const updatedItems = mergeArraysImmutable(state.store[action.payload.key], action.payload.items);
                newState.dirtyKeys = { ...state.dirtyKeys, [action.payload.key]: action.payload.key }
                newState.store = { ...state.store, [action.payload.key]: updatedItems };
            }
            return newState;
        }
        case ActionTypes.REMOVE_ITEM_FROM_REDUX: { 
            const newState = { ...state, isLoading: false, errMess: null, successMess: null };
            if (action.payload && action.payload.key && action.payload.id) {
                const items = state.store[action.payload.key];
                if (!items || !(items.length > 0))
                    return state; 
                const updatedItems = items.filter(item => item.id !== action.payload.id);
                newState.dirtyKeys = { ...state.dirtyKeys, [action.payload.key]: action.payload.key }
                newState.store = { ...state.store, [action.payload.key]: updatedItems };
            }
            return newState;
        }
        case ActionTypes.AFTER_PERSIST: {
            return { ...state, isLoading: false, errMess: null, successMess: null, dirtyKeys: {} };
        }
        case ActionTypes.REPLACE_ITEM_IN_REDUX: { /* TODO: do we need this? */
            const result = { ...state, isLoading: false, errMess: null, successMess: null };
            if (action.payload && action.payload.key)
                result.store = { ...state.store, [action.payload.key]: action.payload.items }
            return result;
        }
        case ActionTypes.OPERATION_PROCESSING: {
            return { ...state, isLoading: true, errMess: null, successMess: null };
        }
        case ActionTypes.OPERATION_COMPLETED: { /* TODO: do we need this? */
            const result = { ...state, isLoading: false, errMess: null, successMess: null };
            if (action.payload && action.payload.key)
                result.store = { ...state.store, [action.payload.key]: action.payload.items }
            return result;
        }
        case ActionTypes.OPERATION_FAILED: {
            return { ...state, isLoading: false, errMess: action.payload.errMess, successMess: null };
        }
        case ActionTypes.OPERATION_SUCCEEDED: {
            return { ...state, isLoading: false, errMess: null, successMess: action.payload.successMess };
        }
        case ActionTypes.OPERATION_CLEARED:
            return { ...state, isLoading: false, errMess: null, successMess: null }
        default:
            return state;
    }
}