import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { OPERATION } from './operationReducer';
import { AUTH } from './authReducer';
import { PINSETUP } from './pinSetupReducer';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

export const ConfigureStore = () => {
    const config = {
        key: 'root',
        storage,
        //debug: true
    }; 

    const store = createStore(
        persistCombineReducers(config, {
            OPERATION,
            AUTH,
            PINSETUP
        }),
        applyMiddleware(thunk)
        //applyMiddleware(thunk, logger)
    );

    const persistor = persistStore(store);

    return { persistor, store };
}
