import { StoreConstants, ErrorMessage, ErrorCode } from '../modules/Constants';
import { loadAllData } from './mainActionCreators';
import * as operationActions from './operationActionCreators';
import * as StorageHelpers from '../modules/StorageHelpers';
import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as ActionTypes from './ActionTypes';
import { validatePasswordAsync } from './passwordActionCreators';
import { AppThunkActionType } from './configureStore';
import { AppError } from '../modules/AppError';

export const startRestore = (): AppThunkActionType => (dispatch) => {
    dispatch({ type: ActionTypes.RESTORE_STARTED });
};

export const startBackup = (): AppThunkActionType => (dispatch) => {
    dispatch({ type: ActionTypes.BACKUP_STARTED });
};

export const finishBackup = (): AppThunkActionType => (dispatch) => {
    dispatch({ type: ActionTypes.BACKUP_COMPLETE });
};

export const verifyPasswordForRestore = (password: string): AppThunkActionType => (dispatch) => {
    dispatch(operationActions.start());
    validatePasswordAsync(password)
        .then(() => {
            dispatch({ type: ActionTypes.RESTORE_PASSWORD_VERIFIED });
            dispatch(operationActions.clear());
        })
        .catch(error => {
            console.log(error);
            dispatch({ type: ActionTypes.RESTORE_PASSWORD_FAILED });
            dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.InvalidPassword, ErrorCode.BackupRestore1) : error));
            dispatch(operationActions.clear());
        });
};

export const tryDecryptFileData = (data: [string, string][], password: string): AppThunkActionType => (dispatch) => {
    dispatch(operationActions.start());
    tryDecryptFileDataAsync(data, password)
        .then((passwordWorks) => {
            if (passwordWorks === true)
                dispatch({ type: ActionTypes.RESTORE_FILE_PASSWORD_VERIFIED });
            else {
                dispatch({ type: ActionTypes.RESTORE_FILE_PASSWORD_FAILED });
                dispatch(operationActions.fail(new AppError(ErrorMessage.InvalidFilePassword)));
            }
            dispatch(operationActions.clear());
        })
        .catch(error => {
            console.log(error);
            dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.BackupRestore2) : error));
            dispatch(operationActions.clear());
        });
};

export const tryDecryptFileDataAsync = async (data: [string, string][], password: string) => {
    if (!data || !(data.length > 0) || !password)
        throw new AppError(ErrorMessage.InvalidParameter);
    const dataEncryptionKey = getDataEncryptionKeyFromFileData(data);
    const passwordWorks = await SecurityHelpers.tryDecryptDataAsync(dataEncryptionKey, password);
    return passwordWorks ? true : false;
};

function getDataEncryptionKeyFromFileData(data: [string, string][]) {
    // Data encryption key is encrypted with a password and stored alongside the data
    // data = [
    //   ["@Morning:DATAENCRYPTIONKEY", "U2FsdSLkX19umzDCod0cZ8u26/kfkYpizswaFdzVWDNf02FAl7Hxq2RRM64xRk4LKDeB2+PxYLy/INk0wod+7w=="]
    //   ["J8PUrI3a39kNZrcqbV7BeMKzs0Hc8uYYlMXzHjZW6ko=", null],
    //   ["Wf4rh34+qer48MSihQbrsCADTNfn31tavmFhnxX+S/o=", "U2FsdGVkX184dB4pXueAFrxIz9ZwhN1MTnSOdVu/jMC0DoUXGMOJls2ZptvvjkoVlrMmBuwipR3NV4ChVgfetfMAFRZYkQTXizbYMrlyk1/lyn8G+rcBlUe1gh2gqScp"],
    // ];
    const dataEncryptionKeyValuePair = data.find(item => item.length === 2 && item[0] === StoreConstants.DataEncryptionStoreKey);
    const dataEncryptionKey = dataEncryptionKeyValuePair ? dataEncryptionKeyValuePair[1] : null;
    if (!dataEncryptionKey)
        throw new AppError(ErrorMessage.InvalidFileData);
    return dataEncryptionKey;
}

export const importData = (data: [string, string][], password: string): AppThunkActionType => (dispatch) => {
    dispatch(operationActions.start());
    importDataAsync(data, password)
        .then(() => {
            dispatch({ type: ActionTypes.RESTORE_COMPLETE });
            dispatch(loadAllData());
        })
        .catch(error => {
            console.log(error);
            dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.BackupRestore3) : error));
            dispatch(operationActions.clear());
        });
};
const importDataAsync = async (data: [string, string][], password: string) => {
    // data = [
    //   ["@Morning:DATAENCRYPTIONKEY", "U2FsdSLkX19umzDCod0cZ8u26/kfkYpizswaFdzVWDNf02FAl7Hxq2RRM64xRk4LKDeB2+PxYLy/INk0wod+7w=="]
    //   ["@Morning:SETTINGS","[{\"id\":\"language\",\"date\":\"2020-07-31T08:02:58.050Z\",\"value\":\"en\"},{\"id\":\"theme\",\"date\":\"2020-07-31T08:02:50.524Z\",\"value\":\"dark\"}]"]
    //   ["J8PUrI3a39kNZrcqbV7BeMKzs0Hc8uYYlMXzHjZW6ko=", null],
    //   ["Wf4rh34+qer48MSihQbrsCADTNfn31tavmFhnxX+S/o=", "U2FsdGVkX184dB4pXueAFrxIz9ZwhN1MTnSOdVu/jMC0DoUXGMOJls2ZptvvjkoVlrMmBuwipR3NV4ChVgfetfMAFRZYkQTXizbYMrlyk1/lyn8G+rcBlUe1gh2gqScp"],
    // ];
    const dataEncryptionKeyEncrypted = getDataEncryptionKeyFromFileData(data);
    const cryptoFunctions = await SecurityHelpers.createCryptoFunctions(dataEncryptionKeyEncrypted, password);

    const items = await SecurityHelpers.decryptAllItemsFromImport(data, cryptoFunctions.getHashAsync, cryptoFunctions.decryptDataAsync);

    if (!items || items.length <= 0)
        throw new AppError(ErrorMessage.NoRecordsInFile, ErrorCode.Import1);


    for (const itemType in items) {
        if (!items[itemType] || items[itemType].length !== 2)
            throw new AppError(ErrorMessage.InvalidFormat);

        const itemTypeName = (items[itemType][0] + '').replace(StoreConstants.keyPrefix, '');
        const itemTypeRecords = items[itemType][1] ? JSON.parse(items[itemType][1]) : [];

        if (!StorageHelpers.isValidStoreKey(itemTypeName))
            throw new AppError(ErrorMessage.InvalidFileData, ErrorCode.Import2);

        if (!itemTypeRecords || itemTypeRecords.length <= 0)
            continue;

        /* one more check, the records must have ids and dates at the minimum */
        itemTypeRecords.forEach((record: any) => {
            if (!record.id || !record.date)
                throw new AppError(ErrorMessage.InvalidFileData, ErrorCode.Import3);
        });

        /* persist records by item type */
        await StorageHelpers.mergeByIdAsync(itemTypeName, itemTypeRecords);
    }
};

export const getExportData = (password: string): AppThunkActionType => (dispatch) => {
    dispatch(operationActions.start());
    getExportDataAsync(password)
        .then((data) => {
            dispatch({ type: ActionTypes.BACKUP_DATA_READY, payload: { backupData: data } });
            dispatch(operationActions.clear());
        })
        .catch(error => {
            console.log(error);
            dispatch({ type: ActionTypes.BACKUP_DATA_FAILED });
            dispatch(operationActions.fail(error instanceof AppError !== true ? new AppError(ErrorMessage.General, ErrorCode.BackupRestore4) : error));
            dispatch(operationActions.clear());
        });
};

const getExportDataAsync = async (password: string) => {
    await validatePasswordAsync(password);
    return StorageHelpers.getAllStorageData();
};