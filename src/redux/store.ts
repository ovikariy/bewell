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
import { AuthState, BackupRestoreState, OperationState,
        PinSetupState, StoreState, ChangePasswordState, AppContextState
    } from './reducerTypes';

export interface RootState {
    STORE: StoreState,
    OPERATION: OperationState;
    AUTH: AuthState;
    PINSETUP: PinSetupState;
    BACKUPRESTORE: BackupRestoreState;
    CHANGEPASSWORD: ChangePasswordState;
    APPCONTEXT: AppContextState
 }

/* AppThunkActionType is used to simplify TypeScript typing in action creators  */
export type AppThunkActionType<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

 function configureStore() {

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
}

export const store = configureStore();