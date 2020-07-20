import * as ActionTypes from './ActionTypes';

export const PINSETUP = (state = {
  isPasswordVerified: null,
  isPinSetupComplete: null
}, action) => {
  switch (action.type) {
    case ActionTypes.PIN_SETUP_STARTED:
      return {
        ...state,
        isPasswordVerified: false,
        isPinSetupComplete: false
      };
    case ActionTypes.PIN_SETUP_FAILED:
      return {
        ...state,
        isPasswordVerified: false,
        isPinSetupComplete: false
      };
    case ActionTypes.PIN_SETUP_PASSWORD_VERIFIED:
      return {
        ...state,
        isPasswordVerified: true
      };
    case ActionTypes.PIN_SETUP_PASSWORD_FAILED:
      return {
        ...state,
        isPasswordVerified: false
      };
    case ActionTypes.PIN_SETUP_COMPLETE:
      return {
        ...state,
        isPasswordVerified: false,
        isPinSetupComplete: true
      };
    default:
      return state;
  }
}