import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { MOOD } from './moodReducer';
import { GRATITUDE } from './gratitudeReducer';
import { NOTE } from './noteReducer';
import { SLEEP } from './sleepReducer';
import { operation } from './genericOperationReducer';
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
            MOOD,
            GRATITUDE,
            NOTE,
            SLEEP,
            operation
        }),
        applyMiddleware(thunk)
        //applyMiddleware(thunk, logger)
    );

    const persistor = persistStore(store);

    return { persistor, store };
}
