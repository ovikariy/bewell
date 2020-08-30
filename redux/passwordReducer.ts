import * as ActionTypes from './ActionTypes';
import { consoleLogWithColor, consoleColors } from '../modules/helpers';
import { ChangePasswordActions, ChangePasswordReducerState } from './ReducerTypes';

export const CHANGEPASSWORD = (state: ChangePasswordReducerState = {
  isPasswordVerified: false,
  isComplete: false
}, action: ChangePasswordActions) => {
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
}