/* no matter what screen we're on the way it get and saves items are the same so 
we can re-use the reducers  */

import { AsyncStorage } from "react-native";
import * as constants from '../constants/Constants';


export const itemsLoading = (itemTypeName) => ({
    type: itemTypeName + '_LOADING'
})

export const itemsLoaded = (itemTypeName, items) => ({
    type: itemTypeName + '_LOADED',
    payload: items
})

export const itemDeleteFailed = (itemTypeName) => ({
    type: itemTypeName + '_DELETEFAILED'
})

export const itemDeleteSucceeded = (itemTypeName) => ({
    type: itemTypeName + '_DELETESUCCEEDED'
})

export const loadItems = (itemTypeName = '') => (dispatch) => {
    dispatch(itemsLoading(itemTypeName));
    getItemsFromStorage(itemTypeName).then(items => {
        dispatch(itemsLoaded(itemTypeName, items));
    });
}

export const postItem = (itemTypeName, item) => (dispatch) => {
    dispatch(postItems(itemTypeName, [ item ]));
}

export const postItems = (itemTypeName, newItems) => (dispatch) => {
    if (!newItems || newItems.length <= 0)
        throw new Error('Cannot save an empty list');

    getItemsFromStorage(itemTypeName)
        .then(oldItems => {
            setItemsInStorage(itemTypeName, oldItems.concat(newItems))
                .then(items => {
                    dispatch(loadItems(itemTypeName));
                }).catch(error => {
                    console.log(error);
                });

        }).catch(error => {
            console.log(error);
            throw error;
        })
}

export const deleteItem = (itemTypeName, id) => (dispatch) => {
    if (!itemTypeName)
        throw new Error(constants.MustSpecifyItemTypeToDelete);  /* TODO: this exception is not shown on screen, silent */

    getItemsFromStorage(itemTypeName)
        .then(items => {
            const itemsFiltered = items.filter(item => item.id !== id);
            setItemsInStorage(itemTypeName, itemsFiltered)
                .then(() => {
                    dispatch(itemDeleteSucceeded(itemTypeName));
                    dispatch(loadItems(itemTypeName));
                }).catch(error => {
                    console.log(error);
                    dispatch(itemDeleteFailed(itemTypeName));
                });

        }).catch(error => {
            console.log(error);
            throw error;
        })
}

getItemsFromStorage = async (itemTypeName) => {
    try {
        if (!itemTypeName)
            throw(constants.MustSpecifyItemTypeToGet);
        const existingItems = await AsyncStorage.getItem(itemTypeName);
        if (existingItems != null) {
            const item = JSON.parse(existingItems).sort(function (x, y) {
                return new Date(y.date) - new Date(x.date);
            });
            return item;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
    return [];
}

setItemsInStorage = async (itemTypeName, items) => {
    try {
        if (!itemTypeName)
            throw(constants.MustSpecifyItemTypeToSave);        
        await AsyncStorage.setItem(itemTypeName, JSON.stringify(items));
    } catch (error) {
        console.log(error);
        throw error;
    }
}