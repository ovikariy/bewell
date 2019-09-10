import { ErrorCodes, Errors, Messages, strings } from '../constants/Constants';
import * as ActionTypes from './ActionTypes';
import { loadItems } from './CommonActionCreators';
import * as GenericActions from './GenericOperationActionCreators';
import * as StorageHelpers from '../modules/StorageHelpers';


export const importItemsIntoStorage = (items) => (dispatch) => {
    dispatch(GenericActions.operationProcessing());

    try {
        for (var itemType in items) {
            if (!items[itemType] || items[itemType].length != 2)
                throw new Error('Invalid data format');  //TODO: move text into constant

            const itemTypeName = (items[itemType][0] + '').replace(strings.keyPrefix, '');
            const itemTypeRecords = items[itemType][1] ? JSON.parse(items[itemType][1]) : []; 

            if (!StorageHelpers.isValidItemTypeName(itemTypeName))
                throw new Error('Invalid type name found');  //TODO: move text into constant

            if (!itemTypeRecords || itemTypeRecords.length <= 0)
                continue;

            /* one more check, the records must have ids and dates at the minimum */
            itemTypeRecords.forEach(record => {
                if (!record.id || !record.date)
                    throw new Error('Invalid data found');
            });
            console.log('\r\n Ready for saving: ' + itemTypeName + '\r\n' + JSON.stringify(itemTypeRecords) + '\r\n');  //TODO: remove this

            StorageHelpers.mergeByIdAsync(itemTypeName, itemTypeRecords).then(() => {
                dispatch(loadItems(itemTypeName));
            });
        }

        dispatch(GenericActions.operationSucceeded("Import succeeded!"));
        dispatch(GenericActions.operationCleared()); //TODO: how to clear the error between re-renders?
    } catch (err) {
        console.log(err);
        dispatch(GenericActions.operationFailed(err.message));
        dispatch(GenericActions.operationCleared()); //TODO: how to clear the error between re-renders?
    };
}