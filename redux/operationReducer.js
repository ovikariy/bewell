import * as ActionTypes from './ActionTypes';

/*
    errCodes and successCodes are used for looking up translation of messages
    the codes without a matching translation will be shown as is
    errCodes and successCodes can be an array or a string if just one code
    e.g. ['InvalidCredentials', 'A1001']  will be shown as 'Invalid credentials, please try again A1001'
    e.g. ['InvalidCredentials'] or just a string 'InvalidCredentials' will be shown as 'Invalid credentials, please try again '
*/

export const OPERATION = (state = {
    isLoading: true,
    errCodes: null, /* can be one error code string or an array of multiple codes */
    successCodes: null  /* can be one success code string or an array of multiple codes */
}, action) => {
    switch (action.type) {
        case ActionTypes.OPERATION_PROCESSING: {
            return { ...state, isLoading: true, errCodes: null, successCodes: null };
        }
        case ActionTypes.OPERATION_FAILED: {
            return { ...state, isLoading: false, errCodes: action.payload.errCodes, successCodes: null };
        }
        case ActionTypes.OPERATION_SUCCEEDED: {
            return { ...state, isLoading: false, errCodes: null, successCodes: action.payload.successCodes };
        }
        case ActionTypes.OPERATION_CLEARED:
            return { ...state, isLoading: false, errCodes: null, successCodes: null }
        default:
            return state;
    }
}