import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { STORE } from './reduxStoreReducer';
import { OPERATION } from './operationReducer';
import { AUTH } from './authReducer';
import { PINSETUP } from './pinSetupReducer';
import { BACKUPRESTORE } from './backupRestoreReducer';
import { CHANGEPASSWORD } from './passwordReducer';
import { APPCONTEXT } from './appContextReducer';

export const ConfigureStore = () => {

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

    return { store };
}
