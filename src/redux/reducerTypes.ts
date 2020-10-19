import { AppContextInterface } from '../modules/AppContext';
import { LoginInfo } from '../modules/SecurityHelpers';
import { ItemBase, ItemBaseAssociativeArray, ItemBaseMultiArray, SettingType } from '../modules/types';
import * as ActionTypes from './ActionTypes';

/* OPERATION */

export interface OperationReducerState {
  isLoading: boolean,
  errCodes?: string | string[], /* can be one error code string or an array of multiple codes */
  successCodes?: string | string[]  /* can be one success code string or an array of multiple codes */
}

interface OperationProcessing { type: typeof ActionTypes.OPERATION_PROCESSING }
interface OperationFailed { type: typeof ActionTypes.OPERATION_FAILED; payload: { errCodes: string | string[] } }
interface OperationSucceeded { type: typeof ActionTypes.OPERATION_SUCCEEDED; payload: { successCodes: string | string[] } }
interface OperationCleared { type: typeof ActionTypes.OPERATION_CLEARED }

export type OperationActions = OperationProcessing | OperationFailed | OperationSucceeded | OperationCleared;

/* AUTH */

export interface AuthReducerState extends LoginInfo {
  isLoading: boolean;
}

interface LoadedAuthData {
  type: typeof ActionTypes.LOADED_AUTH_DATA
  payload: { authData: LoginInfo }
}

export type AuthReducerActions = LoadedAuthData;


/* STORE */

export interface StoreReducerState {
  items: ItemBaseAssociativeArray;
}
interface ReplaceItemsInReduxStore {
  type: typeof ActionTypes.REPLACE_ITEMS_IN_REDUX_STORE;
  payload: {
    items: ItemBaseMultiArray
  }
}
interface ClearReduxStore { type: typeof ActionTypes.CLEAR_REDUX_STORE }

export type StoreReducerAction = ReplaceItemsInReduxStore | ClearReduxStore;


/* BACKUPRESTORE */

export interface BackupRestoreReducerState {
  isPasswordVerified: boolean;
  isFilePasswordNeeded: boolean;
  isFilePasswordVerified: boolean;
  backupData: [string, string][] | null;
  backupDataReady: boolean;
  isComplete: boolean;
}

interface RestoreStarted { type: typeof ActionTypes.RESTORE_STARTED }
interface RestoreFailed { type: typeof ActionTypes.RESTORE_FAILED }
interface RestorePasswordVerified { type: typeof ActionTypes.RESTORE_PASSWORD_VERIFIED }
interface RestorePasswordFailed { type: typeof ActionTypes.RESTORE_PASSWORD_FAILED }
interface RestoreFilePasswordVerified { type: typeof ActionTypes.RESTORE_FILE_PASSWORD_VERIFIED }
interface RestoreFilePasswordFailed { type: typeof ActionTypes.RESTORE_FILE_PASSWORD_FAILED }
interface RestoreComplete { type: typeof ActionTypes.RESTORE_COMPLETE }
interface BackupStarted { type: typeof ActionTypes.BACKUP_STARTED }
interface BackupDataReady { type: typeof ActionTypes.BACKUP_DATA_READY; payload: { backupData: [string, string][] } }
interface BackupDataFailed { type: typeof ActionTypes.BACKUP_DATA_FAILED }
interface BackupComplete { type: typeof ActionTypes.BACKUP_COMPLETE }

export type BackupRestoreActions = RestoreStarted | RestoreFailed | RestorePasswordVerified |
  RestorePasswordFailed | RestoreFilePasswordVerified | RestoreFilePasswordFailed |
  RestoreComplete | BackupStarted | BackupDataReady | BackupDataFailed | BackupComplete;

/* PINSETUP */

export interface PinSetupState {
  isPasswordVerified: boolean;
  isPinSetupComplete: boolean;
}

interface PinSetupStarted { type: typeof ActionTypes.PIN_SETUP_STARTED }
interface PinSetupFailed { type: typeof ActionTypes.PIN_SETUP_FAILED }
interface PinSetupPasswordVerified { type: typeof ActionTypes.PIN_SETUP_PASSWORD_VERIFIED }
interface PinSetupPasswordFailed { type: typeof ActionTypes.PIN_SETUP_PASSWORD_FAILED }
interface PinSetupComplete { type: typeof ActionTypes.PIN_SETUP_COMPLETE }

export type PinSetupActions = PinSetupStarted | PinSetupFailed | PinSetupPasswordVerified
  | PinSetupPasswordFailed | PinSetupComplete;


/* CHANGEPASSWORD */

export interface ChangePasswordReducerState {
  isPasswordVerified: boolean;
  isComplete: boolean;
}

interface ChangePasswordStarted { type: typeof ActionTypes.CHANGEPASSWORD_STARTED }
interface ChangePasswordCredentialsFailed { type: typeof ActionTypes.CHANGEPASSWORD_CREDENTIALS_FAILED }
interface ChangePasswordCredentialsVerified { type: typeof ActionTypes.CHANGEPASSWORD_CREDENTIALS_VERIFIED }
interface ChangePasswordComplete { type: typeof ActionTypes.CHANGEPASSWORD_COMPLETE }

export type ChangePasswordActions = ChangePasswordStarted | ChangePasswordCredentialsFailed
  | ChangePasswordCredentialsVerified | ChangePasswordComplete;

/* APPCONTEXT */

export interface AppContextReducerState {
  context: AppContextInterface
}
interface SettingsChanged {
  type: typeof ActionTypes.SETTINGS_CHANGED
  payload: { settings: SettingType[] }
}

export type AppContextReducerActions = SettingsChanged;
