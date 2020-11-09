import { isEmptyWidgetItem, consoleColors, consoleLogWithColor, mergeArraysImmutable } from '../modules/utils';
import * as storage from '../modules/storage';
import * as operationActions from './operationActionCreators';
import { AppError, ItemBase, ItemBaseAssociativeArray, ItemBaseMultiArray, ItemBaseMultiArrayElement, SettingType } from '../modules/types';
import { StoreConstants, ErrorMessage, ErrorCode } from '../modules/constants';
import * as ActionTypes from './actionTypes';
import { AppThunkActionType } from './store';

/**
 * @description Load item's data from storage
 * @param key e.g. "bewellapp_SETTINGS" or "bewellapp_012019"
 */
export function load(key: string): AppThunkActionType {
    return (dispatch) => {
        dispatch(operationActions.start());
        loadAsync(key)
            .then((items) => {
                dispatch(replaceItemsInRedux([[key, items]]));
                dispatch(operationActions.clear());
                if (key === StoreConstants.SETTINGS)
                    dispatch(settingsChanged(items));
            })
            .catch(error => {
                console.log(error);
                dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Storage9) : error));
                dispatch(operationActions.clear());
            });
    };
}

export function loadAppContextFromSettings(): AppThunkActionType {
    return (dispatch) => {
        dispatch(load(StoreConstants.SETTINGS));
    };
}

const settingsChanged = (settings: SettingType[]) => ({
    type: ActionTypes.SETTINGS_CHANGED,
    payload: { settings }
});

/* load widget data for all months e.g. on historical views or total counts */
export function loadAllWidgetData(): AppThunkActionType {
    return (dispatch) => {
        dispatch(operationActions.start());
        loadAllWidgetDataAsync()
            .then((items) => {
                dispatch(replaceItemsInRedux(items));
                dispatch(operationActions.clear());
            })
            .catch(error => {
                console.log(error);
                dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Storage8) : error));
                dispatch(operationActions.clear());
            });
    };
}

async function loadAllWidgetDataAsync() {
    return storage.getMultiItemsAndDecryptAsync(StoreConstants.monthsFromEpochDate);
}

/**
 * @description Load all storage data e.g. all widget data plus settings and anything else;
 * useful during the import/restore process
 */
export function loadAllData(): AppThunkActionType {
    return (dispatch) => {
        dispatch(operationActions.start());
        loadAllDataAsync()
            .then((items) => {
                dispatch(replaceItemsInRedux(items));
                dispatch(operationActions.clear());
            })
            .catch(error => {
                console.log(error);
                dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Storage11) : error));
                dispatch(operationActions.clear());
            });
    };
}

async function loadAllDataAsync() {
    return storage.getMultiItemsAndDecryptAsync(StoreConstants.AllEncryptedStoreKeys);
}

async function loadAsync(key: string) {
    if (key === StoreConstants.SETTINGS) { /* settings are stored unencrypted because need theme, language etc before user logs in */
        const items = await storage.getItemAsync(key);
        if (!items)
            return null;
        return JSON.parse(items as string);
    }
    else {
        const items = await storage.getItemsAndDecryptAsync(key);
        return items.sort((a: ItemBase, b: ItemBase) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
    }
}

async function persistReduxAsync(key: string, items: ItemBase[]) {

    if (!key && storage.isValidStoreKey(key) === true)
        return;
    const nonEmptyItems = items.filter(item => !isEmptyWidgetItem(item));
    if (nonEmptyItems.length > 0) {
        if (key === StoreConstants.SETTINGS) /* settings are stored unencrypted because need theme, language etc before user logs in */
            await storage.setItemAsync(key, JSON.stringify(nonEmptyItems));

        else
            await storage.setItemsAndEncryptAsync(key, nonEmptyItems);
    }
}

/**
 * @description Update redux store and persist items to Async Storage
 * @param key
 * @param allStoreItems
 * @param updatedItems
 */
export function updateReduxAndPersist(key: string, allStoreItems: Readonly<ItemBaseAssociativeArray>, updatedItems: ItemBase[]): AppThunkActionType {
    return (dispatch) => {
        const mergedItems = mergeArraysImmutable(allStoreItems[key], updatedItems);
        dispatch(updateReduxAndPersistInternal(key, mergedItems));
    };
}

/**
 * @param key Store key of the group containing item to be removed e.g. bewellapp_SETTINGS or bewellapp_092020
 * @param allStoreItems All items from redux store i.e. StoreReducerState.items
 * @param id id of the ItemBase type item to be removed
 */
export function removeFromReduxAndPersist(key: string, allStoreItems: Readonly<ItemBaseAssociativeArray>, id: string): AppThunkActionType {
    return (dispatch) => {
        const items = allStoreItems[key];
        if (!items || !(items.length > 0))
            return;

        const itemsWithoutRemoved = items.filter(item => item.id !== id);
        dispatch(updateReduxAndPersistInternal(key, itemsWithoutRemoved));
    };
}

function updateReduxAndPersistInternal(key: string, updatedItems: ItemBase[]): AppThunkActionType {
    return (dispatch) => {

        dispatch(replaceItemsInRedux([[key, updatedItems]]));

        if (key === StoreConstants.SETTINGS)
            dispatch(settingsChanged(updatedItems as ItemBase[]));

        persistReduxAsync(key, updatedItems)
            .then(() => { })
            .catch(error => {
                console.log(error);
                dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.Storage2) : error));
                dispatch(operationActions.clear());
            });
    };
}

function replaceItemsInRedux(items: ItemBaseMultiArray) {
    return ({
        type: ActionTypes.REPLACE_ITEMS_IN_REDUX_STORE,
        payload: { items }
    });
}

export function logStorageData(): AppThunkActionType {
    return (dispatch) => {
        storage.logStorageDataAsync().then();
    };
}





