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

interface OPERATION_PROCESSING { type: typeof ActionTypes.OPERATION_PROCESSING }
interface OPERATION_FAILED { type: typeof ActionTypes.OPERATION_FAILED; payload: { errCodes: string | string[] } }
interface OPERATION_SUCCEEDED { type: typeof ActionTypes.OPERATION_SUCCEEDED; payload: { successCodes: string | string[] } }
interface OPERATION_CLEARED { type: typeof ActionTypes.OPERATION_CLEARED }

export type OperationActions = OPERATION_PROCESSING | OPERATION_FAILED | OPERATION_SUCCEEDED | OPERATION_CLEARED;

/* AUTH */

export interface AuthReducerState extends LoginInfo {
  isLoading: boolean;
}

interface LOADED_AUTH_DATA {
  type: typeof ActionTypes.LOADED_AUTH_DATA
  payload: { authData: LoginInfo }
}

export type AuthReducerActions = LOADED_AUTH_DATA;


/* STORE */

export interface StoreReducerState {
  items: ItemBaseAssociativeArray;
}
interface REPLACE_ITEMS_IN_REDUX_STORE {
  type: typeof ActionTypes.REPLACE_ITEMS_IN_REDUX_STORE;
  payload: {
    items: ItemBaseMultiArray
  }
}
interface CLEAR_REDUX_STORE { type: typeof ActionTypes.CLEAR_REDUX_STORE }

export type StoreReducerAction = REPLACE_ITEMS_IN_REDUX_STORE | CLEAR_REDUX_STORE;


/* BACKUPRESTORE */

export interface BackupRestoreReducerState {
  isPasswordVerified: boolean;
  isFilePasswordNeeded: boolean;
  isFilePasswordVerified: boolean;
  backupData: [string, string][] | null;
  backupDataReady: boolean;
  isComplete: boolean;
}

interface RESTORE_STARTED { type: typeof ActionTypes.RESTORE_STARTED }
interface RESTORE_FAILED { type: typeof ActionTypes.RESTORE_FAILED }
interface RESTORE_PASSWORD_VERIFIED { type: typeof ActionTypes.RESTORE_PASSWORD_VERIFIED }
interface RESTORE_PASSWORD_FAILED { type: typeof ActionTypes.RESTORE_PASSWORD_FAILED }
interface RESTORE_FILE_PASSWORD_VERIFIED { type: typeof ActionTypes.RESTORE_FILE_PASSWORD_VERIFIED }
interface RESTORE_FILE_PASSWORD_FAILED { type: typeof ActionTypes.RESTORE_FILE_PASSWORD_FAILED }
interface RESTORE_COMPLETE { type: typeof ActionTypes.RESTORE_COMPLETE }
interface BACKUP_STARTED { type: typeof ActionTypes.BACKUP_STARTED }
interface BACKUP_DATA_READY { type: typeof ActionTypes.BACKUP_DATA_READY; payload: { backupData: any /*  //TODO:  */ } }
interface BACKUP_DATA_FAILED { type: typeof ActionTypes.BACKUP_DATA_FAILED }
interface BACKUP_COMPLETE { type: typeof ActionTypes.BACKUP_COMPLETE }

export type BackupRestoreActions = RESTORE_STARTED | RESTORE_FAILED | RESTORE_PASSWORD_VERIFIED |
  RESTORE_PASSWORD_FAILED | RESTORE_FILE_PASSWORD_VERIFIED | RESTORE_FILE_PASSWORD_FAILED |
  RESTORE_COMPLETE | BACKUP_STARTED | BACKUP_DATA_READY | BACKUP_DATA_FAILED | BACKUP_COMPLETE;

/* PINSETUP */

export interface PinSetipState {
  isPasswordVerified: boolean;
  isPinSetupComplete: boolean;
}

interface PIN_SETUP_STARTED { type: typeof ActionTypes.PIN_SETUP_STARTED }
interface PIN_SETUP_FAILED { type: typeof ActionTypes.PIN_SETUP_FAILED }
interface PIN_SETUP_PASSWORD_VERIFIED { type: typeof ActionTypes.PIN_SETUP_PASSWORD_VERIFIED }
interface PIN_SETUP_PASSWORD_FAILED { type: typeof ActionTypes.PIN_SETUP_PASSWORD_FAILED }
interface PIN_SETUP_COMPLETE { type: typeof ActionTypes.PIN_SETUP_COMPLETE }

export type PinSetupActions = PIN_SETUP_STARTED | PIN_SETUP_FAILED | PIN_SETUP_PASSWORD_VERIFIED
  | PIN_SETUP_PASSWORD_FAILED | PIN_SETUP_COMPLETE;


/* CHANGEPASSWORD */

export interface ChangePasswordReducerState {
  isPasswordVerified: boolean;
  isComplete: boolean;
}

interface CHANGEPASSWORD_STARTED { type: typeof ActionTypes.CHANGEPASSWORD_STARTED }
interface CHANGEPASSWORD_CREDENTIALS_FAILED { type: typeof ActionTypes.CHANGEPASSWORD_CREDENTIALS_FAILED }
interface CHANGEPASSWORD_CREDENTIALS_VERIFIED { type: typeof ActionTypes.CHANGEPASSWORD_CREDENTIALS_VERIFIED }
interface CHANGEPASSWORD_COMPLETE { type: typeof ActionTypes.CHANGEPASSWORD_COMPLETE }

export type ChangePasswordActions = CHANGEPASSWORD_STARTED | CHANGEPASSWORD_CREDENTIALS_FAILED
  | CHANGEPASSWORD_CREDENTIALS_VERIFIED | CHANGEPASSWORD_COMPLETE;

/* APPCONTEXT */

export interface AppContextReducerState {
  context: AppContextInterface
}
interface SETTINGS_CHANGED {
  type: typeof ActionTypes.SETTINGS_CHANGED
  payload: { settings: SettingType[] }
}

export type AppContextReducerActions = SETTINGS_CHANGED;
