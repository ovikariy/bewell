import { storeConstants, text, Errors, ErrorCodes } from '../modules/Constants';
import { loadAllData } from './mainActionCreators';
import * as GenericActions from './operationActionCreators';
import * as StorageHelpers from '../modules/StorageHelpers';
import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as ActionTypes from './ActionTypes';
import { validatePasswordAsync } from './passwordActionCreators';

export const startRestore = () => (dispatch) => {
    dispatch({ type: ActionTypes.RESTORE_STARTED });
}

export const startBackup = () => (dispatch) => {
    dispatch({ type: ActionTypes.BACKUP_STARTED });
}

export const finishBackup = () => (dispatch) => {
    dispatch({ type: ActionTypes.BACKUP_COMPLETE });
}

export const verifyPasswordForRestore = (password) => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    validatePasswordAsync(password)
        .then(() => {
            dispatch({ type: ActionTypes.RESTORE_PASSWORD_VERIFIED });
            dispatch(GenericActions.operationCleared());
        })
        .catch(error => {
            console.log(error);
            dispatch({ type: ActionTypes.RESTORE_PASSWORD_FAILED });
            dispatch(GenericActions.operationFailed(Errors.InvalidPassword));
            dispatch(GenericActions.operationCleared());
        })
}

export const tryDecryptFileData = (data, password) => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    tryDecryptFileDataAsync(data, password)
        .then((passwordWorks) => {
            if (passwordWorks === true)
                dispatch({ type: ActionTypes.RESTORE_FILE_PASSWORD_VERIFIED });
            else {
                dispatch({ type: ActionTypes.RESTORE_FILE_PASSWORD_FAILED });
                dispatch(GenericActions.operationFailed(Errors.InvalidFilePassword));
            }
            dispatch(GenericActions.operationCleared());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        })
}

export const tryDecryptFileDataAsync = async (data, password) => {
    if (!data || !(data.length > 0) || !password)
        throw new Error(Errors.InvalidParameter);
    const dataEncryptionKey = getDataEncryptionKeyFromFileData(data);
    const passwordWorks = await SecurityHelpers.tryDecryptDataAsync(dataEncryptionKey, password);
    return passwordWorks ? true : false;
}

function getDataEncryptionKeyFromFileData(data) {
    // Data encryption key is encrypted with a password and stored alongside the data
    // data = [
    //   ["@Morning:DATAENCRYPTIONKEY", "U2FsdSLkX19umzDCod0cZ8u26/kfkYpizswaFdzVWDNf02FAl7Hxq2RRM64xRk4LKDeB2+PxYLy/INk0wod+7w=="]
    //   ["J8PUrI3a39kNZrcqbV7BeMKzs0Hc8uYYlMXzHjZW6ko=", null],
    //   ["Wf4rh34+qer48MSihQbrsCADTNfn31tavmFhnxX+S/o=", "U2FsdGVkX184dB4pXueAFrxIz9ZwhN1MTnSOdVu/jMC0DoUXGMOJls2ZptvvjkoVlrMmBuwipR3NV4ChVgfetfMAFRZYkQTXizbYMrlyk1/lyn8G+rcBlUe1gh2gqScp"],
    // ];
    const dataEncryptionKeyValuePair = data.find(item => item.length == 2 && item[0] == storeConstants.DataEncryptionStoreKey);
    const dataEncryptionKey = dataEncryptionKeyValuePair ? dataEncryptionKeyValuePair[1] : null;
    if (!dataEncryptionKey)
        throw new Error(Errors.InvalidFileData);
    return dataEncryptionKey;
}

export const importData = (data, password) => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    importDataAsync(data, password)
        .then(() => {
            dispatch({ type: ActionTypes.RESTORE_COMPLETE });
            dispatch(loadAllData());
        })
        .catch(error => {
            console.log(error);
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        })
}
const importDataAsync = async (data, password) => {
    // data = [
    //   ["@Morning:DATAENCRYPTIONKEY", "U2FsdSLkX19umzDCod0cZ8u26/kfkYpizswaFdzVWDNf02FAl7Hxq2RRM64xRk4LKDeB2+PxYLy/INk0wod+7w=="]
    //   ["J8PUrI3a39kNZrcqbV7BeMKzs0Hc8uYYlMXzHjZW6ko=", null],
    //   ["Wf4rh34+qer48MSihQbrsCADTNfn31tavmFhnxX+S/o=", "U2FsdGVkX184dB4pXueAFrxIz9ZwhN1MTnSOdVu/jMC0DoUXGMOJls2ZptvvjkoVlrMmBuwipR3NV4ChVgfetfMAFRZYkQTXizbYMrlyk1/lyn8G+rcBlUe1gh2gqScp"],
    // ];
    const dataEncryptionKeyEncrypted = getDataEncryptionKeyFromFileData(data);
    const cryptoFunctions = await SecurityHelpers.createCryptoFunctions(dataEncryptionKeyEncrypted, password);

    const items = await SecurityHelpers.decryptAllItemsFromImport(data, cryptoFunctions.getHashAsync, cryptoFunctions.decryptDataAsync);

    if (!items || items.length <= 0) {
        throw new Error(Errors.NoRecordsInFile + ErrorCodes.Import1);
    }

    for (var itemType in items) {
        if (!items[itemType] || items[itemType].length != 2)
            throw new Error(Errors.InvalidFormat);

        const itemTypeName = (items[itemType][0] + '').replace(storeConstants.keyPrefix, '');
        const itemTypeRecords = items[itemType][1] ? JSON.parse(items[itemType][1]) : [];

        if (!StorageHelpers.isValidStoreKey(itemTypeName))
            throw new Error(Errors.InvalidFileData + ErrorCodes.Import2);

        if (!itemTypeRecords || itemTypeRecords.length <= 0)
            continue;

        /* one more check, the records must have ids and dates at the minimum */
        itemTypeRecords.forEach(record => {
            if (!record.id || !record.date)
                throw new Error(Errors.InvalidFileData + ErrorCodes.Import3);
        });

        /* persist records by item type */
        await StorageHelpers.mergeByIdAsync(itemTypeName, itemTypeRecords);
    }
}

export const getExportData = (password) => (dispatch) => {
    dispatch(GenericActions.operationProcessing());
    getExportDataAsync(password)
        .then((data) => {
            dispatch({ type: ActionTypes.BACKUP_DATA_READY, payload: { backupData: data } });
            dispatch(GenericActions.operationCleared());
        })
        .catch(error => {
            console.log(error);
            dispatch({ type: ActionTypes.BACKUP_DATA_FAILED });
            dispatch(GenericActions.operationFailed(error.message));
            dispatch(GenericActions.operationCleared());
        })
}

const getExportDataAsync = async (password) => {
    const isValidPassword = await validatePasswordAsync(password);
    if (!isValidPassword)
        throw new Error(Errors.InvalidPassword);
    return await StorageHelpers.getAllStorageData();
}