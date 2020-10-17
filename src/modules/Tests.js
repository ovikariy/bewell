import { enc } from 'crypto-js';
import { storeConstants } from '../modules/Constants';
import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as StorageHelpers from '../modules/StorageHelpers';
import * as SecureStore from 'expo-secure-store';

/* changes the color of console log statements and needs to be reset after
    console.log(consoleColors.green, 'this text is green', consoleColors.reset); */
const consoleColors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
}

export const runTests = async () => {
    console.log('\r\n************ Starting Tests ***********\r\n');
    await testEncoding();
    await testEncryption();
    await testChangePassword();
    console.log('\r\n************ Tests Completed ***********\r\n');
}

const deleteAllStorageWithoutReturn = async () => {
    /* this test DELETES ALL storage data, do not run this if data is valuable; TODO: maybe remove this code */
    //////// await AsyncStorage.multiRemove(await AsyncStorage.getAllKeys());
}

const testEncoding = async () => {
    /* this test does not change storage values */
    console.log('************ Starting testEncoding ***********\r\n');

    const randomKey = await SecurityHelpers.generateEncryptionKeyAsync();
    console.log('\r\n randomKey\r\n' + randomKey);

    const randomKeyEncrypted = await SecurityHelpers.encryptAsync(randomKey, 'password1');
    console.log('\r\n randomKeyEncrypted\r\n' + randomKeyEncrypted);
    const randomKeyDecrypted = await SecurityHelpers.decryptAsync(randomKeyEncrypted, 'password1');
    console.log('\r\n randomKeyDecrypted\r\n' + randomKeyDecrypted);

    const randomKeyEncrypted2 = await SecurityHelpers.encryptAsync(randomKeyDecrypted, 'password2');
    const randomKeyDecrypted2 = await SecurityHelpers.decryptAsync(randomKeyEncrypted2, 'password2');
    console.log('\r\n randomKeyDecrypted2\r\n' + randomKeyDecrypted2);

    const randomKeyEncrypted3 = await SecurityHelpers.encryptAsync(randomKeyDecrypted2, 'password3');
    const randomKeyDecrypted3 = await SecurityHelpers.decryptAsync(randomKeyEncrypted3, 'password3');
    console.log('\r\n randomKeyDecrypted3\r\n' + randomKeyDecrypted3);

    if (randomKey === randomKeyDecrypted && randomKeyDecrypted === randomKeyDecrypted2
        && randomKeyDecrypted2 === randomKeyDecrypted3)
        console.log(consoleColors.green, '\r\nPASSED\r\n', consoleColors.reset);
    else
        console.log(consoleColors.red, '\r\nFAILED\r\n', consoleColors.reset);
}

const testEncryption = async () => {
    /* this test does not change storage values */
    console.log('************ Starting testEncryption ***********\r\n');

    const testData = await configTestData();

    const encryptedItems = await SecurityHelpers.encryptForStorageAsync(testData.items, testData.dataEncryptionKey);
    console.log('\r\nencryptedItems\r\n' + encryptedItems);

    const decryptedItems = await SecurityHelpers.decryptFromStorageAsync(encryptedItems, testData.dataEncryptionKey);
    console.log('\r\ndecryptedItems\r\n' + decryptedItems);

    if (testData.items == decryptedItems)
        console.log(consoleColors.green, '\r\nPASSED\r\n', consoleColors.reset);
    else
        console.log(consoleColors.red, '\r\nFAILED\r\n', consoleColors.reset);
}

const testChangePassword = async () => {
    /* this test resets the password in the secure store and then changes it back to what it was */
    console.log('************ Starting testChangePassword ***********\r\n');

    let testData = await configTestData();

    const oldPassword = testData.passwordInStore;
    const newPassword = 'newPassword123';

    const encryptedItems = await SecurityHelpers.encryptForStorageAsync(testData.items, testData.dataEncryptionKey);
    console.log('\r\nencryptedItems\r\n' + encryptedItems);

    /* change password, should still be able to decrypt */
    await SecurityHelpers.setPasswordAsync(oldPassword, newPassword);

    /* reload data after password change */
    testData.passwordInStore = await SecureStore.getItemAsync(storeConstants.password, {});
    testData.dataEncryptionKey = await SecurityHelpers.reEncryptDataEncryptionKeyAsync(testData.dataEncryptionKey, oldPassword, newPassword);

    console.log('\r\ndataEncryptionKey\r\n' + testData.dataEncryptionKey);

    try {
        const decryptedItems = await SecurityHelpers.decryptFromStorageAsync(encryptedItems, testData.dataEncryptionKey);
        console.log('\r\ndecryptedItems\r\n' + decryptedItems);

        if (testData.items == decryptedItems)
            console.log(consoleColors.green, '\r\nPASSED\r\n', consoleColors.reset);
        else
            console.log(consoleColors.red, '\r\nFAILED\r\n', consoleColors.reset);
    } catch (error) {
        console.log(consoleColors.red, '\r\nFAILED with error\r\n' + error, consoleColors.reset);
    }

    /* reset password */
    await SecureStore.setItemAsync(storeConstants.password, oldPassword, {});
}

const configTestData = async () => {

    const testData = {};
    testData.items = JSON.stringify([{
        '@Morning:MOOD': [
            { "id": 1566119857019, "date": "2019-08-14T09:22:15.961Z", "rating": 0 },
            { "id": 1566182344310, "rating": 1, "date": "2019-08-19T02:39:00.473Z" },
            { "id": 1566182817427, "rating": 0, "date": "2019-08-18T02:46:00.268Z" }]
    }, {
        '@Morning:SLEEP': [
            { "id": 1566120130976, "rating": 1, "date": "2019-08-14T09:22:15.481Z" },
            { "id": 1566182348829, "rating": 0, "date": "2019-08-19T02:47:00.797Z", "startDate": "2019-08-18T23:00:00.000Z", "endDate": "2019-08-18T08:00:00.000Z" },
            { "id": 1566182818365, "rating": 1, "date": "2019-08-18T02:47:00.749Z", "startDate": "2019-08-17T23:00:00.000Z", "endDate": "2019-08-17T08:00:00.000Z" }]
    }]);
    console.log('\r\nitems\r\n' + testData.items);
    testData.passwordInStore = await SecureStore.getItemAsync(storeConstants.password, {});
    console.log('\r\npasswordInStore\r\n' + testData.passwordInStore);
    testData.dataEncryptionKey = await StorageHelpers.getItemsAsync(storeConstants.DataEncryptionStoreKey);
    console.log('\r\ndataEncryptionKey\r\n' + testData.dataEncryptionKey);
    return testData;
}