import * as ActionTypes from './actionTypes';
import { ItemBaseAssociativeArray } from '../modules/types';
import { StoreAction, StoreState } from './reducerTypes';

export const STORE = (state: StoreState = {
    items: {}
}, action: StoreAction) => {
    switch (action.type) {
        case ActionTypes.REPLACE_ITEMS_IN_REDUX_STORE: {

            if (!action.payload || !action.payload.items)
                return state;

            /*  payload.items comes in as an array, we need to convert it to associative array

                from  [["bewellapp_SETTINGS",[{"id":"language","date":"2020-09-03T08:43:22.617Z","value":"en"},{"id":"theme","date":"2020-09-15T07:05:39.937Z","value":"light"}]]]
                to     {"bewellapp_SETTINGS":[{"id":"language","date":"2020-09-03T08:43:22.617Z","value":"en"},{"id":"theme","date":"2020-09-15T07:05:39.937Z","value":"light"}]}
            */

            const newState = { ...state };
            const keyValuesAssociativeArray: ItemBaseAssociativeArray = {};
            action.payload.items.forEach(item => {
                if (item && item.length === 2)
                    keyValuesAssociativeArray[item[0]] = item[1];

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
};