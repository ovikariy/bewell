import * as ActionTypes from './ActionTypes';

export const AUTH = (state = {
  isLoading: true,
  isInitialized: null,
  isEncrypted: null,
  isPinLocked: null,
  loginAttempts: null,
  isSignedIn: null
}, action) => {
  switch (action.type) {
    case ActionTypes.LOADED_AUTH_DATA:
      return {
        ...state,
        isLoading: false,
        isSignedIn: action.authData.isSignedIn,
        isInitialized: action.authData.isInitialized,
        isEncrypted: action.authData.isEncrypted,
        loginAttempts: action.authData.loginAttempts,
        isPinLocked: action.authData.isPinLocked
      };
    default:
      return state;
  }
}