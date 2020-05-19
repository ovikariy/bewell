import * as ActionTypes from './ActionTypes';
import { consoleLogWithColor, consoleColors } from '../modules/helpers';

export const CHANGEPASSWORD = (state = {
  isPasswordVerified: null,
  isComplete: null
}, action) => {
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