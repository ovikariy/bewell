import * as ActionTypes from './ActionTypes';

export const AUTH = (state = {
  isSignout: false,
  isSkippedSecuritySetup: null,
  isInitialized: null,
  hasPasswordInStore: null,
  isDataEncrypted: null,
  loginAttempts: null,
  isSignedIn: null
}, action) => {
  switch (action.type) {
    case ActionTypes.LOAD_AUTH_DATA:
      return {
        ...state,
        isSignout: false,
        isSignedIn: action.authData.isSignedIn,
        isInitialized: action.authData.isInitialized,
        loginAttempts: action.authData.loginAttempts,
        hasPasswordInStore: action.authData.hasPasswordInStore,
        isDataEncrypted: action.authData.isDataEncrypted
      };
    case ActionTypes.SKIP_SECURITY_SETUP:
      return {
        ...state,
        isSkippedSecuritySetup: true
      };
    case ActionTypes.SIGN_OUT:
      return {
        ...state,
        isSignout: true,
        isSkippedSecuritySetup: null
      };
    default:
      return state;
  }
}