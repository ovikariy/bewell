import { storeConstants, text } from '../modules/Constants';
import { loadItems } from './mainActionCreators';
import * as GenericActions from './operationActionCreators';
import * as StorageHelpers from '../modules/StorageHelpers';

export const importItemsIntoStorage = (items) => (dispatch) => {
    dispatch(GenericActions.operationProcessing());

    try {
        for (var itemType in items) {
            if (!items[itemType] || items[itemType].length != 2)
                throw new Error(text.backupScreen.invalidFormat);

            const itemTypeName = (items[itemType][0] + '').replace(storeConstants.keyPrefix, '');
            const itemTypeRecords = items[itemType][1] ? JSON.parse(items[itemType][1]) : []; 

            if (!StorageHelpers.isValidStoreKey(itemTypeName))
                throw new Error(text.backupScreen.invalidItemName);

            if (!itemTypeRecords || itemTypeRecords.length <= 0)
                continue;

            /* one more check, the records must have ids and dates at the minimum */
            itemTypeRecords.forEach(record => {
                if (!record.id || !record.date)
                    throw new Error(text.backupScreen.invalidData);
            });

            StorageHelpers.mergeByIdAsync(itemTypeName, itemTypeRecords).then(() => {
                dispatch(loadItems(itemTypeName));
            });
        }

        dispatch(GenericActions.operationSucceeded(text.backupScreen.importSucceeded));
        dispatch(GenericActions.operationCleared());
    } catch (err) {
        console.log(err);
        dispatch(GenericActions.operationFailed(err.message));
        dispatch(GenericActions.operationCleared());
    };
}