import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { mood } from './moodReducer';
import { gratitude } from './gratitudeReducer';
import { note } from './noteReducer';
import { dream } from './dreamReducer';
import { sleep } from './sleepReducer';
import { security } from './securityReducer';
import { componentState } from './componentStateReducer';
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
            mood,
            gratitude,
            note,
            dream,
            sleep,
            security,
            componentState
        }),
        applyMiddleware(thunk)
        //applyMiddleware(thunk, logger)
    );

    const persistor = persistStore(store);

    return { persistor, store };
}
