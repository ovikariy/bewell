import { isEmptyWidgetItem, consoleColors, consoleLogWithColor, mergeArraysImmutable } from '../modules/helpers';
import * as StorageHelpers from '../modules/StorageHelpers';
import * as GenericActions from './operationActionCreators';
import { ItemBase, ItemBaseAssociativeArray, ItemBaseMultiArray, ItemBaseMultiArrayElement, SettingType } from '../modules/types';
import { StoreConstants, Errors, ErrorCodes } from '../modules/Constants';
import * as ActionTypes from './ActionTypes';
import { AppThunkActionType } from './configureStore';

/**
 * @description Load item's data from storage
 * @param key e.g. "`@Morning:SETTINGS`" or "`@Morning:012019`"
 */
export const load = (key: string): AppThunkActionType => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    loadAsync(key)
        .then((items) => {
            dispatch(replaceItemsInRedux([[key, items]]));
            dispatch(GenericActions.operationCleared());
            if (key === StoreConstants.SETTINGS)
                dispatch(settingsChanged(items));
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message ? [Errors.General, ErrorCodes.Storage9] : error));
            dispatch(GenericActions.operationCleared());
        });
};

export const loadAppContextFromSettings = (): AppThunkActionType => (dispatch) => {
    dispatch(load(StoreConstants.SETTINGS));
};

const settingsChanged = (settings: SettingType[]) => ({
    type: ActionTypes.SETTINGS_CHANGED,
    payload: { settings }
});

/* load widget data for all months e.g. on historical views or total counts */
export const loadAllWidgetData = (): AppThunkActionType => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    loadAllWidgetDataAsync()
        .then((items) => {
            dispatch(replaceItemsInRedux(items));
            dispatch(GenericActions.operationCleared());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message ? [Errors.General, ErrorCodes.Storage8] : error));
            dispatch(GenericActions.operationCleared());
        });
};

const loadAllWidgetDataAsync = (): Promise<ItemBaseMultiArray> => {
    return StorageHelpers.getMultiItemsAndDecryptAsync(StoreConstants.monthsFromEpochDate);
};

/**
 * @description Load all storage data e.g. all widget data plus settings and anything else;
 * useful during the import/restore process
 */
export const loadAllData = (): AppThunkActionType => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    loadAllDataAsync()
        .then((items) => {
            dispatch(replaceItemsInRedux(items));
            dispatch(GenericActions.operationCleared());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message ? [Errors.General, ErrorCodes.Storage11] : error));
            dispatch(GenericActions.operationCleared());
        });
};

const loadAllDataAsync = () => {
    return StorageHelpers.getMultiItemsAndDecryptAsync(StoreConstants.AllEncryptedStoreKeys);
};

const loadAsync = async (key: string) => {
    if (key === StoreConstants.SETTINGS) { /* settings are stored unencrypted because need theme, language etc before user logs in */
        const items = await StorageHelpers.getItemAsync(key);
        if (!items)
            return null;
        return JSON.parse(items as string);
    }
    else {
        const items = await StorageHelpers.getItemsAndDecryptAsync(key);
        return items.sort((a: ItemBase, b: ItemBase) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
    }
};

const persistReduxAsync = async (key: string, items: ItemBase[]) => {

    if (!key && StorageHelpers.isValidStoreKey(key) === true)
        return;
    const nonEmptyItems = items.filter(item => !isEmptyWidgetItem(item));
    if (nonEmptyItems.length > 0) {
        if (key === StoreConstants.SETTINGS) /* settings are stored unencrypted because need theme, language etc before user logs in */
            await StorageHelpers.setItemsAsync(key, JSON.stringify(nonEmptyItems));
        else
            await StorageHelpers.setItemsAndEncryptAsync(key, nonEmptyItems);
    }
};

/**
 * @description Update redux store and persist items to Async Storage
 * @param key
 * @param allStoreItems
 * @param updatedItems
 */
export const updateReduxAndPersist = (key: string, allStoreItems: Readonly<ItemBaseAssociativeArray>, updatedItems: ItemBase[]): AppThunkActionType => (dispatch) => {
    const mergedItems = mergeArraysImmutable(allStoreItems[key], updatedItems);
    dispatch(updateReduxAndPersistInternal(key, mergedItems));
};

/**
 * @param key Store key of the group containing item to be removed e.g. Morning:SETTINGS or Morning:092020
 * @param allStoreItems All items from redux store i.e. StoreReducerState.items
 * @param id id of the ItemBase type item to be removed
 */
export const removeFromReduxAndPersist = (key: string, allStoreItems: Readonly<ItemBaseAssociativeArray>, id: string): AppThunkActionType => (dispatch) => {
    const items = allStoreItems[key];
    if (!items || !(items.length > 0))
        return;

    const itemsWithoutRemoved = items.filter(item => item.id !== id);
    dispatch(updateReduxAndPersistInternal(key, itemsWithoutRemoved));
};

const updateReduxAndPersistInternal = (key: string, updatedItems: ItemBase[]): AppThunkActionType => (dispatch) => {

    dispatch(replaceItemsInRedux([[key, updatedItems]]));

    if (key === StoreConstants.SETTINGS)
        dispatch(settingsChanged(updatedItems as ItemBase[]));

    persistReduxAsync(key, updatedItems)
        .then(() => { })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message ? [Errors.General, ErrorCodes.Storage2] : error));
            dispatch(GenericActions.operationCleared());
        });
};

const replaceItemsInRedux = (items: ItemBaseMultiArray) => ({
    type: ActionTypes.REPLACE_ITEMS_IN_REDUX_STORE,
    payload: { items }
});

export const logStorageData = (): AppThunkActionType => (dispatch) => {
    StorageHelpers.logStorageDataAsync().then();
};





