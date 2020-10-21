import * as ActionTypes from './actionTypes';
import { PinSetupState, PinSetupAction } from './reducerTypes';

export const PINSETUP = (state: PinSetupState = {
  isPasswordVerified: false,
  isPinSetupComplete: false
}, action: PinSetupAction) => {
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
};