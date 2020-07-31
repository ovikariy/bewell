import { isEmptyWidgetItem, consoleColors, consoleLogWithColor } from '../modules/helpers';
import * as StorageHelpers from '../modules/StorageHelpers';
import * as GenericActions from './operationActionCreators';
import { storeConstants, Errors, ErrorCodes } from '../modules/Constants';
import * as ActionTypes from './ActionTypes';

export const load = (key) => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    //dispatch(logStorageData());
    loadAsync(key)
        .then((items) => {
            dispatch(replaceRedux([[key, items]]));
            dispatch(GenericActions.operationCleared());
            if (key === storeConstants.SETTINGS)
                dispatch(settingsChanged(items));
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message ? [Errors.General, ErrorCodes.Storage12] : error));
            dispatch(GenericActions.operationCleared());
        })
}

export const loadAppContextFromSettings = () => (dispatch) => {
    dispatch(load(storeConstants.SETTINGS));
}

const settingsChanged = (settings) => ({
    type: ActionTypes.SETTINGS_CHANGED,
    payload: { settings }
})

/* load widget data for all months e.g. on historical views or total counts */
export const loadAllWidgetData = () => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    loadAllWidgetDataAsync()
        .then((items) => {
            dispatch(replaceRedux(items));
            dispatch(GenericActions.operationCleared());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message ? [Errors.General, ErrorCodes.Storage13] : error));
            dispatch(GenericActions.operationCleared());
        })
}

const loadAllWidgetDataAsync = async () => {
    return await StorageHelpers.getMultiItemsAndDecryptAsync(storeConstants.monthsFromEpochDate);
}

/* load all storage data e.g. all widget data plus settings and anything else;
useful during the import/restore process  */
export const loadAllData = () => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    loadAllDataAsync()
        .then((items) => {
            dispatch(replaceRedux(items));
            dispatch(GenericActions.operationCleared());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message ? [Errors.General, ErrorCodes.Storage14] : error));
            dispatch(GenericActions.operationCleared());
        })
}

const loadAllDataAsync = async () => {
    return await StorageHelpers.getMultiItemsAndDecryptAsync(storeConstants.AllEncryptedStoreKeys);
}

const loadAsync = async (key) => {
    if (key === storeConstants.SETTINGS) { /* settings are stored unencrypted because need theme, language etc before user logs in */
        const items = await StorageHelpers.getItemsAsync(key);
        if (!items)
            return null;
        return JSON.parse(items);
    }
    else {
        const items = await StorageHelpers.getItemsAndDecryptAsync(key);
        return items.sort((a, b) => a.date < b.date);
    }
}

export const updateRedux = (key, newItems) => (dispatch) => {
    dispatch({
        type: ActionTypes.UPDATE_ITEM_IN_REDUX_STORE,
        payload: { key: key, items: newItems }
    });
    if (key === storeConstants.SETTINGS)
        dispatch(settingsChanged(newItems));
}

export const persistRedux = (items, dirtyKeys) => (dispatch) => {
    persistReduxAsync(items, dirtyKeys)
        .then(() => {
            dispatch({ type: ActionTypes.RESET_DIRTY_KEYS_REDUX_STORE });
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message ? [Errors.General, ErrorCodes.Storage15] : error));
            dispatch(GenericActions.operationCleared());
        });
}

const persistReduxAsync = async (items, dirtyKeys) => {
    if (!dirtyKeys || !(Object.keys(dirtyKeys).length > 0) || !items)
        return;

    for (const dirtyKey in dirtyKeys) {
        if (!items[dirtyKey])
            return;
        const nonEmptyItems = items[dirtyKey].filter(item => !isEmptyWidgetItem(item));
        if (nonEmptyItems.length > 0) {
            if (dirtyKey == storeConstants.SETTINGS) /* settings are stored unencrypted because need theme, language etc before user logs in */
                await StorageHelpers.setItemsAsync(dirtyKey, JSON.stringify(nonEmptyItems));
            else
                await StorageHelpers.setItemsAndEncryptAsync(dirtyKey, nonEmptyItems);
        }
    };
}

export const removeFromRedux = (key, id, options) => (dispatch) => {
    dispatch({
        type: ActionTypes.REMOVE_ITEM_FROM_REDUX_STORE,
        payload: { key, id }
    });
}

const replaceRedux = (items) => ({
    type: ActionTypes.REPLACE_ITEMS_IN_REDUX_STORE,
    payload: { items }
})

export const logStorageData = () => (dispatch) => {
    StorageHelpers.logStorageDataAsync().then();
}





