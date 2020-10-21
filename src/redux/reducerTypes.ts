import { AppContextInterface } from '../modules/appContext';
import { AppError } from '../modules/appError';
import { LoginInfo } from '../modules/securityHelpers';
import { ItemBase, ItemBaseAssociativeArray, ItemBaseMultiArray, SettingType } from '../modules/types';
import * as ActionTypes from './actionTypes';

/* OPERATION */

export interface OperationState {
  isLoading: boolean,
  error?: AppError,
  successMessage?: string
}

interface OperationStart { type: typeof ActionTypes.OPERATION_START }
interface OperationFail { type: typeof ActionTypes.OPERATION_FAIL; payload: { error: AppError } }
interface OperationSucceed { type: typeof ActionTypes.OPERATION_SUCCEED; payload: { successMessage: string } }
interface OperationClear { type: typeof ActionTypes.OPERATION_CLEAR }

export type OperationAction = OperationStart | OperationFail | OperationSucceed | OperationClear;

/* AUTH */

export interface AuthState extends LoginInfo {
  isLoading: boolean;
}

interface LoadedAuthData {
  type: typeof ActionTypes.LOADED_AUTH_DATA
  payload: { authData: LoginInfo }
}

export type AuthAction = LoadedAuthData;


/* STORE */

export interface StoreState {
  items: ItemBaseAssociativeArray;
}
interface ReplaceItemsInReduxStore {
  type: typeof ActionTypes.REPLACE_ITEMS_IN_REDUX_STORE;
  payload: {
    items: ItemBaseMultiArray
  }
}

interface ClearReduxStore { type: typeof ActionTypes.CLEAR_REDUX_STORE }

export type StoreAction = ReplaceItemsInReduxStore | ClearReduxStore;


/* BACKUPRESTORE */

export interface BackupRestoreState {
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

export type BackupRestoreAction = RestoreStarted | RestoreFailed | RestorePasswordVerified |
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

export type PinSetupAction = PinSetupStarted | PinSetupFailed | PinSetupPasswordVerified
  | PinSetupPasswordFailed | PinSetupComplete;


/* CHANGEPASSWORD */

export interface ChangePasswordState {
  isPasswordVerified: boolean;
  isComplete: boolean;
}

interface ChangePasswordStarted { type: typeof ActionTypes.CHANGEPASSWORD_STARTED }
interface ChangePasswordCredentialsFailed { type: typeof ActionTypes.CHANGEPASSWORD_CREDENTIALS_FAILED }
interface ChangePasswordCredentialsVerified { type: typeof ActionTypes.CHANGEPASSWORD_CREDENTIALS_VERIFIED }
interface ChangePasswordComplete { type: typeof ActionTypes.CHANGEPASSWORD_COMPLETE }

export type ChangePasswordAction = ChangePasswordStarted | ChangePasswordCredentialsFailed
  | ChangePasswordCredentialsVerified | ChangePasswordComplete;

/* APPCONTEXT */

export interface AppContextState {
  context: AppContextInterface
}
interface SettingsChanged {
  type: typeof ActionTypes.SETTINGS_CHANGED
  payload: { settings: SettingType[] }
}

export type AppContextAction = SettingsChanged;
