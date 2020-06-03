import * as ActionTypes from './ActionTypes';
import { mergeArraysImmutable, updateArrayImmutable } from '../modules/helpers';

export const OPERATION = (state = {
    isLoading: true,
    errMess: null,
    successMess: null
}, action) => {
    switch (action.type) {
        case ActionTypes.OPERATION_PROCESSING: {
            return { ...state, isLoading: true, errMess: null, successMess: null };
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