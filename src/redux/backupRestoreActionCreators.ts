import { StoreConstants, ErrorMessage, ErrorCode } from '../modules/constants';
import { loadAllData } from './mainActionCreators';
import * as operationActions from './operationActionCreators';
import * as storage from '../modules/storage';
import * as securityService from '../modules/securityService';
import * as ActionTypes from './actionTypes';
import { validatePasswordAsync } from './passwordActionCreators';
import { AppThunkActionType } from './store';
import { AppError } from '../modules/types';

export function startRestore(): AppThunkActionType {
    return (dispatch) => {
        dispatch({ type: ActionTypes.RESTORE_STARTED });
    };
}

export function startBackup(): AppThunkActionType {
    return (dispatch) => {
        dispatch({ type: ActionTypes.BACKUP_STARTED });
    };
}

export function finishBackup(): AppThunkActionType {
    return (dispatch) => {
        dispatch({ type: ActionTypes.BACKUP_COMPLETE });
    };
}

export function verifyPasswordForRestore(password: string): AppThunkActionType {
    return (dispatch) => {
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
}

export function tryDecryptFileData(data: [string, string][], password: string): AppThunkActionType {
    return (dispatch) => {
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
}

export async function tryDecryptFileDataAsync(data: [string, string][], password: string) {
    if (!data || !(data.length > 0) || !password)
        throw new AppError(ErrorMessage.InvalidParameter);
    const dataEncryptionKey = getDataEncryptionKeyFromFileData(data);
    const passwordWorks = await securityService.tryDecryptDataAsync(dataEncryptionKey, password);
    return passwordWorks ? true : false;
}

function getDataEncryptionKeyFromFileData(data: [string, string][]) {
    // Data encryption key is encrypted with a password and stored alongside the data
    // data = [
    //   ["bewellapp_DATAENCRYPTIONKEY", "U2FsdSLkX19umzDCod0cZ8u26/kfkYpizswaFdzVWDNf02FAl7Hxq2RRM64xRk4LKDeB2+PxYLy/INk0wod+7w=="]
    //   ["J8PUrI3a39kNZrcqbV7BeMKzs0Hc8uYYlMXzHjZW6ko=", null],
    //   ["Wf4rh34+qer48MSihQbrsCADTNfn31tavmFhnxX+S/o=", "U2FsdGVkX184dB4pXueAFrxIz9ZwhN1MTnSOdVu/jMC0DoUXGMOJls2ZptvvjkoVlrMmBuwipR3NV4ChVgfetfMAFRZYkQTXizbYMrlyk1/lyn8G+rcBlUe1gh2gqScp"],
    // ];
    const dataEncryptionKeyValuePair = data.find(item => item.length === 2 && item[0] === StoreConstants.DataEncryptionStoreKey);
    const dataEncryptionKey = dataEncryptionKeyValuePair ? dataEncryptionKeyValuePair[1] : null;
    if (!dataEncryptionKey)
        throw new AppError(ErrorMessage.InvalidFileData);
    return dataEncryptionKey;
}

export function importData(data: [string, string][], password: string): AppThunkActionType {
    return (dispatch) => {
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
}
async function importDataAsync(data: [string, string][], password: string) {
    // data = [
    //   ["bewellapp_DATAENCRYPTIONKEY", "U2FsdSLkX19umzDCod0cZ8u26/kfkYpizswaFdzVWDNf02FAl7Hxq2RRM64xRk4LKDeB2+PxYLy/INk0wod+7w=="]
    //   ["bewellapp_SETTINGS","[{\"id\":\"language\",\"date\":\"2020-07-31T08:02:58.050Z\",\"value\":\"en\"},{\"id\":\"theme\",\"date\":\"2020-07-31T08:02:50.524Z\",\"value\":\"dark\"}]"]
    //   ["J8PUrI3a39kNZrcqbV7BeMKzs0Hc8uYYlMXzHjZW6ko=", null],
    //   ["Wf4rh34+qer48MSihQbrsCADTNfn31tavmFhnxX+S/o=", "U2FsdGVkX184dB4pXueAFrxIz9ZwhN1MTnSOdVu/jMC0DoUXGMOJls2ZptvvjkoVlrMmBuwipR3NV4ChVgfetfMAFRZYkQTXizbYMrlyk1/lyn8G+rcBlUe1gh2gqScp"],
    // ];
    const dataEncryptionKeyEncrypted = getDataEncryptionKeyFromFileData(data);
    const cryptoFunctions = securityService.createCryptoFunctions(dataEncryptionKeyEncrypted, password);

    const items = await securityService.decryptAllItemsFromImportAsync(data, cryptoFunctions.getHash, cryptoFunctions.decryptData);

    if (!items || items.length <= 0)
        throw new AppError(ErrorMessage.NoRecordsInFile, ErrorCode.Import1);


    for (const itemType in items) {
        if (!items[itemType] || items[itemType].length !== 2)
            throw new AppError(ErrorMessage.InvalidFormat);

        const itemTypeName = (items[itemType][0] + '').replace(StoreConstants.keyPrefix, '');
        const itemTypeRecords = items[itemType][1] ? JSON.parse(items[itemType][1]) : [];

        if (!storage.isValidStoreKey(itemTypeName))
            throw new AppError(ErrorMessage.InvalidFileData, ErrorCode.Import2);

        if (!itemTypeRecords || itemTypeRecords.length <= 0)
            continue;

        /* one more check, the records must have ids and dates at the minimum */
        itemTypeRecords.forEach((record: any) => {
            if (!record.id || !record.date)
                throw new AppError(ErrorMessage.InvalidFileData, ErrorCode.Import3);
        });

        /* persist records by item type */
        await storage.mergeByIdAsync(itemTypeName, itemTypeRecords);
    }
}

export function getExportData(password: string): AppThunkActionType {
    return (dispatch) => {
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
}

async function getExportDataAsync(password: string) {
    await validatePasswordAsync(password);
    return storage.getAllStorageDataAsync();
}