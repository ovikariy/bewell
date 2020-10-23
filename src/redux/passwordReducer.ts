import * as ActionTypes from './actionTypes';
import { consoleLogWithColor, consoleColors } from '../modules/utils';
import { ChangePasswordAction, ChangePasswordState } from './reducerTypes';

export const CHANGEPASSWORD = (state: ChangePasswordState = {
  isPasswordVerified: false,
  isComplete: false
}, action: ChangePasswordAction) => {
  switch (action.type) {
    case ActionTypes.CHANGEPASSWORD_STARTED:
      return {
        ...state,
        isPasswordVerified: false,
        isComplete: false
      };
    case ActionTypes.CHANGEPASSWORD_CREDENTIALS_FAILED:
      return {
        ...state,
        isPasswordVerified: false
      };
    case ActionTypes.CHANGEPASSWORD_CREDENTIALS_VERIFIED:
      return {
        ...state,
        isPasswordVerified: true
      };
    case ActionTypes.CHANGEPASSWORD_COMPLETE:
      return {
        ...state,
        isComplete: true
      };
    default:
      return state;
  }
};