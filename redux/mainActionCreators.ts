import { isEmptyWidgetItem, consoleColors, consoleLogWithColor } from '../modules/helpers';
import * as StorageHelpers from '../modules/StorageHelpers';
import * as GenericActions from './operationActionCreators';
import { ItemBase, ItemBaseAssociativeArray, ItemBaseMultiArray, ItemBaseMultiArrayElement, SettingType } from '../modules/types';
import { storeConstants, Errors, ErrorCodes } from '../modules/Constants';
import * as ActionTypes from './ActionTypes';
import { AppThunkActionType } from './configureStore';

export const load = (key: string): AppThunkActionType => (dispatch) => {
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

export const loadAppContextFromSettings = (): AppThunkActionType => (dispatch) => {
    dispatch(load(storeConstants.SETTINGS));
}

const settingsChanged = (settings: SettingType[]) => ({
    type: ActionTypes.SETTINGS_CHANGED,
    payload: { settings }
})

/* load widget data for all months e.g. on historical views or total counts */
export const loadAllWidgetData = (): AppThunkActionType => (dispatch) => {
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

const loadAllWidgetDataAsync = async (): Promise<ItemBaseMultiArray> => {
    return await StorageHelpers.getMultiItemsAndDecryptAsync(storeConstants.monthsFromEpochDate);
}

/* load all storage data e.g. all widget data plus settings and anything else;
useful during the import/restore process  */
export const loadAllData = (): AppThunkActionType => (dispatch) => {
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

const loadAsync = async (key: string) => {
    if (key === storeConstants.SETTINGS) { /* settings are stored unencrypted because need theme, language etc before user logs in */
        const items = await StorageHelpers.getItemAsync(key);
        if (!items)
            return null;
        return JSON.parse(items as string);
    }
    else {
        const items = await StorageHelpers.getItemsAndDecryptAsync(key);
        return items.sort((a: ItemBase, b: ItemBase) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0); 
    }
}

export const updateRedux = (key: string, newItems: ItemBase[]): AppThunkActionType => (dispatch) => {
    dispatch({
        type: ActionTypes.UPDATE_ITEM_IN_REDUX_STORE,
        payload: { key: key, items: newItems }
    });
    if (key === storeConstants.SETTINGS)
        dispatch(settingsChanged(newItems as ItemBase[]));
}

export const persistRedux = (items: ItemBaseAssociativeArray, dirtyKeys: { [key: string]: string }): AppThunkActionType => (dispatch) => {
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

const persistReduxAsync = async (items: ItemBaseAssociativeArray, dirtyKeys: { [key: string]: string }) => {
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

export const removeFromRedux = (key: string, id: string): AppThunkActionType => (dispatch) => {
    dispatch({
        type: ActionTypes.REMOVE_ITEM_FROM_REDUX_STORE,
        payload: { key, id }
    });
}

const replaceRedux = (items: ItemBaseMultiArray) => ({
    type: ActionTypes.REPLACE_ITEMS_IN_REDUX_STORE,
    payload: { items }
})

export const logStorageData = (): AppThunkActionType => (dispatch) => {
    StorageHelpers.logStorageDataAsync().then();
}





