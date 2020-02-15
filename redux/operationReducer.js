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
            //console.log('operationReducer update redux ' + action.payload.key + ' new staTE ' + JSON.stringify(newState));
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
            //TODO: pass which keys have been updated and only remove those in case another async operation updated dirtyKeys but they were not persisted yet
            return { ...state, isLoading: false, errMess: null, successMess: null, dirtyKeys: {} };
        }
        case ActionTypes.REPLACE_ITEMS_IN_REDUX: {
            const result = { ...state, isLoading: false, errMess: null, successMess: null };
            if (!action.payload || !action.payload.items)
                return result;

            const keyValuesAssociativeArray = {};
            action.payload.items.forEach(item => {
                if (item && item.length == 2) {
                    keyValuesAssociativeArray[item[0]] = item[1];
                }
            });

            if (Object.keys(keyValuesAssociativeArray).length > 0)
                result.store = { ...state.store, ...keyValuesAssociativeArray };

            return result;
        }
        case ActionTypes.CLEAR_REDUX: {
            return { ...state, isLoading: false, errMess: null, successMess: null, dirtyKeys: {}, store: {} };
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