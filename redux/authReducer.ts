import * as ActionTypes from './ActionTypes';
import { AuthReducerActions, AuthReducerState } from './ReducerTypes';

export const AUTH = (state: AuthReducerState = {
  isLoading: true,
  isInitialized: false,
  isEncrypted: false,
  isPinLocked: false,
  loginAttempts: 0,
  isSignedIn: false
}, action: AuthReducerActions) => {
  switch (action.type) {
    case ActionTypes.LOADED_AUTH_DATA:
      return {
        ...state,
        isLoading: false,
        isSignedIn: action.payload.authData.isSignedIn,
        isInitialized: action.payload.authData.isInitialized,
        isEncrypted: action.payload.authData.isEncrypted,
        loginAttempts: action.payload.authData.loginAttempts,
        isPinLocked: action.payload.authData.isPinLocked
      };
    default:
      return state;
  }
}