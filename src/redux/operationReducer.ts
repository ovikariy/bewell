import * as ActionTypes from './ActionTypes';
import { OperationActions, OperationReducerState } from './reducerTypes';

/*
    errCodes and successCodes are used for looking up translation of messages
    the codes without a matching translation will be shown as is
    errCodes and successCodes can be an array or a string if just one code
    e.g. ['InvalidCredentials', 'A1001']  will be shown as 'Invalid credentials, please try again A1001'
    e.g. ['InvalidCredentials'] or just a string 'InvalidCredentials' will be shown as 'Invalid credentials, please try again '
*/

export const OPERATION = (state: OperationReducerState = {
    isLoading: true,
    errCodes: undefined,
    successCodes: undefined
}, action: OperationActions) => {
    switch (action.type) {
        case ActionTypes.OPERATION_PROCESSING: {
            return { ...state, isLoading: true, errCodes: undefined, successCodes: undefined };
        }
        case ActionTypes.OPERATION_FAILED: {
            return { ...state, isLoading: false, errCodes: action.payload.errCodes, successCodes: undefined };
        }
        case ActionTypes.OPERATION_SUCCEEDED: {
            return { ...state, isLoading: false, errCodes: undefined, successCodes: action.payload.successCodes };
        }
        case ActionTypes.OPERATION_CLEARED:
            return { ...state, isLoading: false, errCodes: undefined, successCodes: undefined }
        default:
            return state;
    }
}