/* no matter what screen we're on the way it get and saves items are the same so 
we can re-use the reducers  */

import { ErrorCodes, Errors, Messages } from '../constants/Constants';
import * as StorageHelpers from '../modules/StorageHelpers';

export const itemsLoading = (itemTypeName) => ({
    type: itemTypeName + '_LOADING'
})

export const itemsLoaded = (itemTypeName, items) => ({
    type: itemTypeName + '_LOADED',
    payload: items
})

export const itemDeleteFailed = (itemTypeName, message) => ({
    type: itemTypeName + '_DELETEFAILED',
    payload: message
})

export const itemDeleteSucceeded = (itemTypeName) => ({
    type: itemTypeName + '_DELETESUCCEEDED',
    payload: Messages.ItemDeleted
})

export const loadItems = (itemTypeName) => (dispatch) => {
    dispatch(itemsLoading(itemTypeName));
    loadItemsAsync(itemTypeName)
        .then((items) => {
            dispatch(itemsLoaded(itemTypeName, items))
        })
        .catch(error => {
            console.log(error);
            throw error;
        })
}

const loadItemsAsync = async (itemTypeName) => {
    const items = await StorageHelpers.getItemsAndDecryptAsync(itemTypeName);
    return items.sort(function (x, y) {
        return new Date(y.date) - new Date(x.date);
    });
}

export const postItem = (itemTypeName, item) => (dispatch) => {
    dispatch(postItems(itemTypeName, [item]));
}

export const postItems = (itemTypeName, newItems) => (dispatch) => {
    StorageHelpers.mergeByIdAsync(itemTypeName, newItems)
        .then(() => dispatch(loadItems(itemTypeName)))
        .catch(error => {
            console.log(error);
            throw error;
        })
}

export const deleteItem = (itemTypeName, id) => (dispatch) => {
    StorageHelpers.removeByIdAsync(itemTypeName, id)
        .then(() => {
            dispatch(itemDeleteSucceeded(itemTypeName));
            dispatch(loadItems(itemTypeName));
        }).catch(err => {
            console.log(err);
            dispatch(itemDeleteFailed(itemTypeName, err.message));
        });
}

export const logStorageData = () => (dispatch) => {
    StorageHelpers.logStorageDataAsync().then();
}





