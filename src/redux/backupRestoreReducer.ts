import * as ActionTypes from './actionTypes';
import { BackupRestoreAction, BackupRestoreState } from './reducerTypes';

export const BACKUPRESTORE = (state: BackupRestoreState = {
  isPasswordVerified: false,
  isFilePasswordNeeded: false,
  isFilePasswordVerified: false,
  backupData: null,
  backupDataReady: false,
  isComplete: false
}, action: BackupRestoreAction) => {
  switch (action.type) {
    case ActionTypes.RESTORE_STARTED:
      return {
        ...state,
        isPasswordVerified: false,
        isFilePasswordNeeded: false,
        isFilePasswordVerified: false,
        isComplete: false
      };
    case ActionTypes.RESTORE_FAILED:
      return {
        ...state,
        isPasswordVerified: false,
        isFilePasswordVerified: false,
        isComplete: false
      };
    case ActionTypes.RESTORE_PASSWORD_VERIFIED:
      return {
        ...state,
        isPasswordVerified: true
      };
    case ActionTypes.RESTORE_PASSWORD_FAILED:
      return {
        ...state,
        isPasswordVerified: false
      };
    case ActionTypes.RESTORE_FILE_PASSWORD_VERIFIED:
      return {
        ...state,
        isFilePasswordVerified: true
      };
    case ActionTypes.RESTORE_FILE_PASSWORD_FAILED:
      return {
        ...state,
        isFilePasswordVerified: false
      };
    case ActionTypes.RESTORE_COMPLETE:
      return {
        ...state,
        isPasswordVerified: false,
        isFilePasswordNeeded: false,
        isFilePasswordVerified: false,
        isComplete: true
      };
    case ActionTypes.BACKUP_STARTED:
      return {
        ...state,
        backupDataReady: false,
        backupData: null,
        isComplete: false
      };
    case ActionTypes.BACKUP_DATA_READY:
      return {
        ...state,
        backupDataReady: true,
        backupData: action.payload.backupData
      };
    case ActionTypes.BACKUP_DATA_FAILED:
      return {
        ...state,
        backupDataReady: false,
        backupData: null
      };
    case ActionTypes.BACKUP_COMPLETE:
      return {
        ...state,
        backupDataReady: false,
        backupData: null,
        isComplete: true
      };
    default:
      return state;
  }
};