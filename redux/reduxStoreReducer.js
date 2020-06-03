import * as ActionTypes from './ActionTypes';
import { mergeArraysImmutable, updateArrayImmutable, consoleColors, consoleLogWithColor } from '../modules/helpers';

export const STORE = (state = {
    items: {},
    dirtyKeys: {}
}, action) => {
    switch (action.type) {
        case ActionTypes.UPDATE_ITEM_IN_REDUX_STORE: {
            if (!action.payload || !action.payload.key)
                return state;
            const updatedItems = mergeArraysImmutable(state.items[action.payload.key], action.payload.items);
            const newState = { ...state };
            newState.dirtyKeys = { ...state.dirtyKeys, [action.payload.key]: action.payload.key }
            newState.items = { ...state.items, [action.payload.key]: updatedItems };
            return newState;
        }
        case ActionTypes.REMOVE_ITEM_FROM_REDUX_STORE: {
            if (!action.payload || !action.payload.key || !action.payload.id)
                return state;

            const items = state.items[action.payload.key];
            if (!items || !(items.length > 0))
                return state;

            const updatedItems = items.filter(item => item.id !== action.payload.id);
            const newState = { ...state };
            newState.dirtyKeys = { ...state.dirtyKeys, [action.payload.key]: action.payload.key }
            newState.items = { ...state.items, [action.payload.key]: updatedItems };
            return newState;
        }
        case ActionTypes.RESET_DIRTY_KEYS_REDUX_STORE: {
            //TODO: pass which keys have been updated and only remove those in case another async operation updated dirtyKeys but they were not persisted yet
            if (!state.dirtyKeys || state.dirtyKeys == {})
                return state;
            return { ...state, dirtyKeys: {} };
        }
        case ActionTypes.REPLACE_ITEMS_IN_REDUX_STORE: {

            if (!action.payload || !action.payload.items)
                return state;

            const newState = { ...state };
            const keyValuesAssociativeArray = {};
            action.payload.items.forEach(item => {
                if (item && item.length == 2) {
                    keyValuesAssociativeArray[item[0]] = item[1];
                }
            });

            if (Object.keys(keyValuesAssociativeArray).length > 0)
                newState.items = { ...state.items, ...keyValuesAssociativeArray };

            return newState;
        }
        case ActionTypes.CLEAR_REDUX_STORE: {
            return { ...state, dirtyKeys: {}, items: {} };
        }
        default:
            return state;
    }
}