import { AES, HmacSHA256, enc, lib } from 'crypto-js';
import { ErrorCodes, Errors, storeConstants } from './Constants';
import * as SecureStore from 'expo-secure-store';
import { consoleColors } from './helpers';

export const getAllHashedStoreKeys = async () => {
  return getMultipleHashedKeys(storeConstants.AllStoreKeys);
}

export const getMultipleHashedKeys = async (keysToHash) => {
  if (!keysToHash || keysToHash.length < 0 || !DataEncryption.getHashAsync)
    throw new Error(Errors.InvalidKey + ErrorCodes.MissingKey7);
  const hashedKeys = [];
  for (var i = 0; i < keysToHash.length; i++) {
    const keyHash = await DataEncryption.getHashAsync(keysToHash[i]);
    hashedKeys.push(keyHash);
  }
  return hashedKeys;
}

//TODO: revisit, save and encrypt if PIN entered
// export const setPasswordAsync = async (oldPassword, newPassword) => {
//   if (!newPassword)
//     throw new Error(Errors.NewPasswordCannotBeBlank);

//   try {
//     const passwordInStore = await getFromSecureStoreAsync(storeConstants.password);

//     if (passwordInStore) {
//       /* there already is a password in storage, 
//          ensure the user supplied it before overwritting */
//       if (!oldPassword || oldPassword !== passwordInStore)
//         throw new Error(Errors.InvalidPassword);
//       await setToSecureStoreAsync(storeConstants.oldpassword, passwordInStore);
//     }

//     await setToSecureStoreAsync(storeConstants.password, newPassword);

//   } catch (err) {
//     console.log(err);
//     if (err.message && err.message.indexOf(Errors.InvalidPassword) > -1)
//       throw err; /* this one we don't want to obfuscate */
//     else
//       throw new Error(Errors.General + ErrorCodes.Encrypt1);
//   }
// }

export const signOut = async () => {
  await setToSecureStoreAsync(storeConstants.password, '');
  await resetEncryptDecryptDataFunctions();
}

export const isPasswordSet = async () => {
  try {
    const passwordInStore = await getFromSecureStoreAsync(storeConstants.password);
    if (passwordInStore && (passwordInStore + '').trim().length > 0)
      return true;
    return false;
  } catch (err) {
    console.log(err);
    throw new Error(Errors.General + Errors.AccessStorage + ErrorCodes.Storage7);
  }
}

// export const isPasswordMatchingExisting = async (password) => {
//   try {
//     //TODO: get PIN from user and decrypt
//     const passwordInStore = await getFromSecureStoreAsync(storeConstants.password);

//     if (passwordInStore && passwordInStore === password) {
//       return true;
//     }
//     return false;
//   } catch (err) {
//     console.log(err);
//     throw new Error(Errors.General + Errors.AccessStorage + ErrorCodes.Storage8);
//   }
// }

//TODO: revisit
export const firstTimeEncryptAllAsync = async (items, password) => {
  /* data will be encrypted with a random Data Encryption Key and that 
  key is going to be encrypted with user's password and stored in Async Storage;
  if the user changes the password the Data Encryption Key will not change */
  const encryptionKey = await generateRandomKeyAsync();
  const encryptionKeyEncrypted = await encryptAsync(encryptionKey, password);
  const resultArray = [];

  // 1. encrypt the encryption key
  resultArray.push([storeConstants.DataEncryptionStoreKey, encryptionKeyEncrypted]);

  // items format is [['k1', 'val1'], ['k2', 'val2']] keys need to be hashed and values encrypted
  for (var index in items) {
    const item = items[index];
    // 2. hash item key with encryption key
    const existingItemTypeHash = await getHashAsync(item[0], encryptionKey);
    let existingItemValue = item[1];
    if (!existingItemValue)
      continue;
    // 3. encrypt item value with encryption key
    const existingItemValueEncrypted = await encryptAsync(existingItemValue, encryptionKey);
    resultArray.push([existingItemTypeHash, existingItemValueEncrypted]);
  }

  createEncryptDecryptDataFunctions(encryptionKeyEncrypted, password);
  return resultArray;
}

export const decryptAllItems = async (items) => {
  if (!DataEncryption.getHashAsync || !DataEncryption.decryptDataAsync)
    throw new Error(Errors.UnableToDecrypt + ErrorCodes.Decrypt12);

  /*  items are an array of arrays of itemTypeNameHash and itemValue 
      e.g. [[ 'itemType1hash', 'item1value' ], [ 'itemType2hash, 'item2value' ]]  */

  /* create a mapping of item type names and their hashes so we know which item is which */
  const itemKeyHashMap = {};
  for (var i = 0; i < storeConstants.AllStoreKeys.length; i++) {
    const itemKeyHash = await DataEncryption.getHashAsync(storeConstants.AllStoreKeys[i]);
    itemKeyHashMap[itemKeyHash] = storeConstants.AllStoreKeys[i];
  }

  const decryptedItems = [];
  for (var i = 0; i < items.length; i++) {
    const item = items[i];

    if (!item || item.length != 2)
      throw new Error(Errors.InvalidData);

    if (item[0] === storeConstants.DataEncryptionStoreKey)
      continue; /* we don't want to process this */

    const hash = item[0];
    const value = item[1];

    const key = itemKeyHashMap[hash];
    if (!key)
      throw new Error(Errors.InvalidKey);

    const valueDecrypted = await DataEncryption.decryptDataAsync(value);
    if (value && !valueDecrypted) {
      throw new Error(Errors.UnableToDecrypt + ErrorCodes.Decrypt11);
    }

    decryptedItems.push([key, valueDecrypted]);
  }

  return decryptedItems;
}

export const getItemKeyHashAsync = async (itemKey) => {

  if (!itemKey || !DataEncryption.getHashAsync)
    throw new Error(Errors.General + ErrorCodes.Hash1);

  try {
    return await DataEncryption.getHashAsync(itemKey);
  } catch (err) {
    console.log(err);
    throw new Error(Errors.General + ErrorCodes.Hash2);
  }
}

export const decryptDataAsync = async (value) => {
  if (!value)
    return value;
  if (!DataEncryption.decryptDataAsync)
    throw new Error(Errors.General + ErrorCodes.Decrypt1);

  try {
    const valueDecrypted = await DataEncryption.decryptDataAsync(value);

    if (value && !valueDecrypted)
      throw new Error(Errors.General + ErrorCodes.Decrypt2);
    return valueDecrypted;

  } catch (err) {
    console.log(err);
    throw new Error(Errors.General + ErrorCodes.Decrypt3);
  }
}

export const tryDecryptDataAsync = async (value, key) => {
  try {
    const valueDecrypted = await decryptAsync(value, key, null);
    if (value && valueDecrypted)
      return true;
    return false;
  } catch (err) {
    return false;
  }
}

export const encryptDataAsync = async (value) => {
  if (!DataEncryption.encryptDataAsync)
    throw new Error(Errors.General + ErrorCodes.Encrypt4);

  try {
    return await DataEncryption.encryptDataAsync(value);
  } catch (err) {
    console.log(err);
    throw new Error(Errors.General + ErrorCodes.Decrypt5);
  }
}

export const reEncryptAsync = async (value, oldPassword, newPassword) => {
  // 1. decrypt with the old password
  const decrypted = await decryptAsync(value, oldPassword);
  if (!decrypted)
    throw new Error(Errors.InvalidPassword + ErrorCodes.Decrypt6);

  // 2. encrypt with the new password
  const encrypted = await encryptAsync(decrypted, newPassword);
  if (!encrypted)
    throw new Error(Errors.General + ErrorCodes.Encrypt5);

  return encrypted;
}

export const getLoginInfo = async () => {
  const loginAttempts = await getFromSecureStoreAsync(storeConstants.loginAttempts);
  const hasPasswordInStore = await isPasswordSet();
  return { loginAttempts, hasPasswordInStore, isSignedIn: DataEncryption.canEncryptDecrypt };
}

const DataEncryption = { canEncryptDecrypt: false, decryptDataAsync: null, encryptDataAsync: null, getHashAsync: null };
const resetEncryptDecryptDataFunctions = async () => {
  DataEncryption.canEncryptDecrypt = false;
  DataEncryption.decryptDataAsync = null;
  DataEncryption.encryptDataAsync = null;
  DataEncryption.getHashAsync = null;
}
/**
 * @description createEncryptDecryptDataFunctions that takes password entered by the user during the logon process, 
 * retrieves the data encryption key from storage, decrypts it and creates the functions that handle crypto without
 * re-retrieving the data encryption key or the need to pass it around
 */
export const createEncryptDecryptDataFunctions = async (dataEncryptionKeyEncrypted, password) => {
  if (!dataEncryptionKeyEncrypted || !password)
    throw new Error(Errors.InvalidParameter + ErrorCodes.Auth1);
  const dataEncryptionKeyDecrypted = await decryptAsync(dataEncryptionKeyEncrypted, password);
  if (!dataEncryptionKeyDecrypted)
    throw new Error(Errors.InvalidPassword + ErrorCodes.Auth2);

  DataEncryption.decryptDataAsync = async (data) => {
    return await decryptAsync(data, dataEncryptionKeyDecrypted);
  };
  DataEncryption.encryptDataAsync = async (data) => {
    return await encryptAsync(data, dataEncryptionKeyDecrypted);
  };
  DataEncryption.getHashAsync = async (data) => {
    return await getHashAsync(data, dataEncryptionKeyDecrypted);
  };

  DataEncryption.canEncryptDecrypt = true;
}

export const canEncryptDecrypt = () => {
  return DataEncryption.canEncryptDecrypt;
}

const generateRandomKeyAsync = async () => {
  return lib.WordArray.random(16).toString(); /* convert to string, important for decryption, otherwise the encodings will be different Utf8 vs Hex after re-encryption */
}

const getHashAsync = async (value, key) => {
  if (!key)
    throw new Error(Errors.General + ErrorCodes.UnableToHashWithoutPassword);

  const hash = HmacSHA256(value, key);
  return enc.Base64.stringify(hash);
}

const encryptAsync = async (value, key) => {
  if (!key)
    throw new Error(Errors.General + ErrorCodes.Encrypt6);
  if (!value || value === '')
    return value;
  try {
    return AES.encrypt(value, key).toString();
  } catch (err) {
    console.log(err);
    throw new Error(Errors.General + ErrorCodes.Encrypt7);
  }
}

const decryptAsync = async (value, key) => {
  if (!key)
    throw new Error(Errors.General + ErrorCodes.Decrypt7);
  if (!value || value === '')
    return value;

  try {
    const bytes = AES.decrypt(value, key);
    const decrypted = bytes.toString(enc.Utf8);
    return decrypted;

  } catch (err) {
    console.log(err);
    throw new Error(Errors.InvalidData + ErrorCodes.Decrypt8);
  }
}

const getFromSecureStoreAsync = async (key) => {
  return await SecureStore.getItemAsync(key, {});
}

const setToSecureStoreAsync = async (key, value) => {
  return await SecureStore.setItemAsync(key, value, {});
}