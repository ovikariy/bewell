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