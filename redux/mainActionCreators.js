import { text } from '../modules/Constants';
import * as StorageHelpers from '../modules/StorageHelpers';
import * as GenericActions from './operationActionCreators';

export const loadItems = (itemTypeName) => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    loadItemsAsync(itemTypeName)
        .then((items) => {
            dispatch(GenericActions.operationCompleted(itemTypeName, items));
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        })
}

const loadItemsAsync = async (itemTypeName) => {
    const items = await StorageHelpers.getItemsAndDecryptAsync(itemTypeName);
    return items.sort(function (x, y) {
        return new Date(y.date) - new Date(x.date);
    }); 
}

export const postItem = (itemTypeName, item, options) => (dispatch) => {
    dispatch(postItems(itemTypeName, [item], options));
}

export const postItems = (itemTypeName, newItems, options) => (dispatch) => {
    StorageHelpers.mergeByIdAsync(itemTypeName, newItems)
        .then((updatedItems) => {
            console.log('posted items');
            if (!options || !options.silent) /* sometimes we don't want to show messages e.g. when updating recently used tags */
                dispatch(GenericActions.operationSucceeded(text.listItems.Updated));
            dispatch(GenericActions.operationCleared());
            dispatch(GenericActions.operationCompleted(itemTypeName, updatedItems));
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        })
}

export const deleteItem = (itemTypeName, id) => (dispatch) => {
    /* WARNING: calling this through dispatch in a loop does not delete any items; TODO: current solution is to delete multiples at a time, maybe there is a better way */
    StorageHelpers.removeByIdAsync(itemTypeName, id)
        .then((updatedItems) => {
            dispatch(GenericActions.operationSucceeded(text.listItems.ItemDeleted));
            dispatch(GenericActions.operationCleared());
            dispatch(GenericActions.operationCompleted(itemTypeName, updatedItems));
        }).catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        });
}

export const deleteMultiItems = (itemTypeName, ids) => (dispatch) => {
    StorageHelpers.removeByIdMultipleAsync(itemTypeName, ids)
        .then(() => {
            dispatch(GenericActions.operationSucceeded(text.listItems.ItemDeleted));
            dispatch(GenericActions.operationCleared());
            dispatch(loadItems(itemTypeName));
        }).catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        });
}

export const logStorageData = () => (dispatch) => {
    StorageHelpers.logStorageDataAsync().then();
}





