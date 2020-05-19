import { isEmptyWidgetItem } from '../modules/helpers';
import * as StorageHelpers from '../modules/StorageHelpers';
import * as GenericActions from './operationActionCreators';
import { storeConstants } from '../modules/Constants';

export const load = (key) => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    //dispatch(logStorageData());
    loadAsync(key)
        .then((items) => {
            dispatch(GenericActions.operationReplaceRedux([[key, items]]));
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        })
}

/* load widget data for all months e.g. on historical views or total counts */
export const loadAllWidgetData = () => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    loadAllWidgetDataAsync()
        .then((items) => {
            dispatch(GenericActions.operationReplaceRedux(items));
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
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
            dispatch(GenericActions.operationReplaceRedux(items));
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        })
}

const loadAllDataAsync = async () => {
    return await StorageHelpers.getMultiItemsAndDecryptAsync(storeConstants.AllStoreKeys);
}

const loadAsync = async (key) => {
    const items = await StorageHelpers.getItemsAndDecryptAsync(key);
    return items.sort(function (x, y) {
        return new Date(y.date) - new Date(x.date);
    });
}

export const updateRedux = (key, newItems) => (dispatch) => {
    dispatch(GenericActions.operationUpdateRedux(key, newItems));
}

export const persistRedux = (state) => (dispatch) => {
    persistReduxAsync(state)
        .then(() => {
            dispatch(GenericActions.operationAfterPersist());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        });
}

const persistReduxAsync = async (state) => {
    if (!state.dirtyKeys || !(Object.keys(state.dirtyKeys).length > 0) || !state.store)
        return;

    for (const dirtyKey in state.dirtyKeys) {
        if (!state.store[dirtyKey])
            return;
        const nonEmptyItems = state.store[dirtyKey].filter(item => !isEmptyWidgetItem(item));
        if (nonEmptyItems.length > 0) {
            await StorageHelpers.setItemsAndEncryptAsync(dirtyKey, nonEmptyItems);
        }
    };
}

export const removeFromRedux = (key, id, options) => (dispatch) => {
    dispatch(GenericActions.operationRemoveFromRedux(key, id));
}

export const logStorageData = () => (dispatch) => {
    StorageHelpers.logStorageDataAsync().then();
}





