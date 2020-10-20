import * as ActionTypes from './ActionTypes';
import { OperationAction, OperationState } from './reducerTypes';

export const OPERATION = (state: OperationState = {
    isLoading: true,
    error: undefined,
    successMessage: undefined
}, action: OperationAction) => {
    switch (action.type) {
        case ActionTypes.OPERATION_START: {
            return { ...state, isLoading: true, error: undefined, successMessage: undefined };
        }
        case ActionTypes.OPERATION_FAIL: {
            return { ...state, isLoading: false, error: action.payload.error, successMessage: undefined };
        }
        case ActionTypes.OPERATION_SUCCEED: {
            return { ...state, isLoading: false, error: undefined, successMessage: action.payload.successMessage };
        }
        case ActionTypes.OPERATION_CLEAR:
            return { ...state, isLoading: false, error: undefined, successMessage: undefined };
        default:
            return state;
    }
};