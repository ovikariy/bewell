import { createStore, applyMiddleware, combineReducers, Action } from 'redux';
import thunk, { ThunkAction } from 'redux-thunk';
//import logger from 'redux-logger';
import { STORE } from './reduxStoreReducer';
import { OPERATION } from './operationReducer';
import { AUTH } from './authReducer';
import { PINSETUP } from './pinSetupReducer';
import { BACKUPRESTORE } from './backupRestoreReducer';
import { CHANGEPASSWORD } from './passwordReducer';
import { APPCONTEXT } from './appContextReducer';
import { AuthReducerState, BackupRestoreReducerState, OperationReducerState,
        PinSetupState, StoreReducerState, ChangePasswordReducerState, AppContextReducerState
    } from './reducerTypes';

export interface RootState {
    STORE: StoreReducerState,
    OPERATION: OperationReducerState;
    AUTH: AuthReducerState;
    PINSETUP: PinSetupState;
    BACKUPRESTORE: BackupRestoreReducerState;
    CHANGEPASSWORD: ChangePasswordReducerState;
    APPCONTEXT: AppContextReducerState
 }

/* AppThunkActionType is used to simplify TypeScript typing in action creators  */
export type AppThunkActionType<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const configureStore = () => {

    const store = createStore(
        combineReducers({
            STORE,
            OPERATION,
            AUTH,
            PINSETUP,
            BACKUPRESTORE,
            CHANGEPASSWORD,
            APPCONTEXT
        }),
        applyMiddleware(thunk)
        //applyMiddleware(thunk, logger)
    );

    return store;
};
