import { text } from '../modules/Constants';
import { isEmptyItem } from '../modules/helpers';
import * as StorageHelpers from '../modules/StorageHelpers';
import * as GenericActions from './operationActionCreators';

export const load = (key) => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    loadAsync(key)
        .then((items) => {
            dispatch(GenericActions.operationReplaceRedux(key, items));
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        })
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

export const replaceRedux = (key, newItems) => (dispatch) => {
    dispatch(GenericActions.operationReplaceRedux(key, newItems));
}

export const persistRedux = (state) => (dispatch) => {
    try {
        if (!state.dirtyKeys || !state.store)
            return;
        Object.keys(state.dirtyKeys).forEach(dirtyKey => {
            if (!state.store[dirtyKey])
                return;
            const nonEmptyItems = state.store[dirtyKey].filter(item => !isEmptyItem(item));
            if (nonEmptyItems.length > 0)
                StorageHelpers.setItemsAndEncryptAsync(dirtyKey, nonEmptyItems).then(() => {});
        });
        dispatch(GenericActions.operationAfterPersist());
    }
    catch (error) {
        console.log(error);
        dispatch(GenericActions.operationFailed(error.message));
        dispatch(GenericActions.operationCleared());
    }
}

export const removeFromRedux = (key, id, options) => (dispatch) => {
    dispatch(GenericActions.operationRemoveFromRedux(key, id));
}

export const logStorageData = () => (dispatch) => {
    StorageHelpers.logStorageDataAsync().then();
}





