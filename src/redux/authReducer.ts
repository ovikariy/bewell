import * as ActionTypes from './actionTypes';
import { AuthAction, AuthState } from './reducerTypes';

export const AUTH = (state: AuthState = {
  isLoading: true,
  isInitialized: false,
  isEncrypted: false,
  isPinLocked: false,
  loginAttempts: 0,
  isSignedIn: false
}, action: AuthAction) => {
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
};