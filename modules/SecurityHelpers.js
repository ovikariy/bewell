import { AES, HmacSHA256, enc, lib } from 'crypto-js';
import { ErrorCodes, Errors, storeConstants, } from './Constants';
import * as SecureStore from 'expo-secure-store';
import { isNullOrEmpty } from './helpers';

export const getAllHashedStoreKeys = async () => {
  return getMultipleHashedKeys(storeConstants.AllStoreKeys);
}

export const getMultipleHashedKeys = async (keysToHash) => {
  if (!keysToHash || keysToHash.length < 0)
    throw [Errors.InvalidKey, ErrorCodes.MissingKey7];
  if (!DataEncryption.getHashAsync)
    throw [Errors.Unauthorized, ErrorCodes.MissingKey7];
  const hashedKeys = [];
  for (var i = 0; i < keysToHash.length; i++) {
    const keyHash = await DataEncryption.getHashAsync(keysToHash[i]);
    hashedKeys.push(keyHash);
  }
  return hashedKeys;
}

export const setupNewPINAsync = async (password, pin) => {
  if (isSignedIn() !== true)
    throw Errors.Unauthorized;
  if (isNullOrEmpty(password) || isNullOrEmpty(pin))
    throw Errors.MissingPassword;

  const encryptedPassword = await encryptAsync(password, pin); //TODO: check strong encryption even if PIN is short
  await setToSecureStoreAsync(storeConstants.password, encryptedPassword);
}

export const signOut = async () => {
  await resetEncryptDecryptDataFunctions();
}

export const initialize = async () => {
  await setToSecureStoreAsync(storeConstants.isInitialized, 'true');
}

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
    throw [Errors.Unauthorized, ErrorCodes.Decrypt12];

  return await decryptAllItemsInternal(items, DataEncryption.getHashAsync, DataEncryption.decryptDataAsync);
}

export const decryptAllItemsFromImport = async (items, getHashAsync, decryptDataAsync) => {
  if (!getHashAsync || !decryptDataAsync)
    throw [Errors.UnableToDecrypt, ErrorCodes.Decrypt13];

  return await decryptAllItemsInternal(items, getHashAsync, decryptDataAsync);
}

const decryptAllItemsInternal = async (items, getHashAsyncFunction, decryptDataAsyncFunction) => {
  /*  items are an array of arrays of itemTypeNameHash and itemValue 
      e.g. [[ 'itemType1hash', 'item1value' ], [ 'itemType2hash, 'item2value' ]]  */

  /* create a mapping of item type names and their hashes so we know which item is which */
  const itemKeyHashMap = {};
  for (var i = 0; i < storeConstants.AllStoreKeys.length; i++) {
    const itemKeyHash = await getHashAsyncFunction(storeConstants.AllStoreKeys[i]);
    itemKeyHashMap[itemKeyHash] = storeConstants.AllStoreKeys[i];
  }

  const decryptedItems = [];
  for (var i = 0; i < items.length; i++) {
    const item = items[i];

    if (!item || item.length != 2)
      throw Errors.InvalidData;

    if (item[0] === storeConstants.DataEncryptionStoreKey)
      continue; /* we don't want to process this */

    const hash = item[0];
    const value = item[1];

    const key = itemKeyHashMap[hash];
    if (!key)
      throw [Errors.InvalidKey, ErrorCodes.MissingKey10];

    const valueDecrypted = await decryptDataAsyncFunction(value);
    if (value && !valueDecrypted) {
      throw [Errors.UnableToDecrypt, ErrorCodes.Decrypt11];
    }

    decryptedItems.push([key, valueDecrypted]);
  }

  return decryptedItems;
}

export const getItemKeyHashAsync = async (itemKey) => {

  if (!itemKey)
    throw [Errors.General, ErrorCodes.Hash1];
  if (!DataEncryption.getHashAsync)
    throw [Errors.Unauthorized, ErrorCodes.Hash1];

  try {
    return await DataEncryption.getHashAsync(itemKey);
  } catch (error) {
    console.log(error);
    throw [Errors.General, ErrorCodes.Hash2];
  }
}

export const decryptDataAsync = async (value) => {
  if (!value)
    return value;
  if (!DataEncryption.decryptDataAsync)
    throw [Errors.Unauthorized, ErrorCodes.Decrypt1];

  try {
    const valueDecrypted = await DataEncryption.decryptDataAsync(value);

    if (value && !valueDecrypted)
      throw [Errors.General, ErrorCodes.Decrypt2];
    return valueDecrypted;

  } catch (error) {
    console.log(error);
    throw [Errors.General, ErrorCodes.Decrypt3];
  }
}

export const tryDecryptDataAsync = async (value, key) => {
  try {
    const valueDecrypted = await decryptAsync(value, key, null);
    if (value && valueDecrypted)
      return true;
    return false;
  } catch (error) {
    return false;
  }
}

export const encryptDataAsync = async (value) => {
  if (!DataEncryption.encryptDataAsync)
    throw [Errors.Unauthorized, ErrorCodes.Encrypt4];

  try {
    return await DataEncryption.encryptDataAsync(value);
  } catch (error) {
    console.log(error);
    throw [Errors.General, ErrorCodes.Decrypt5];
  }
}

export const reEncryptAsync = async (value, oldPassword, newPassword) => {
  // 1. decrypt with the old password
  const decrypted = await decryptAsync(value, oldPassword);
  if (isNullOrEmpty(decrypted))
    throw [Errors.InvalidPassword, ErrorCodes.Decrypt6];

  // 2. encrypt with the new password
  const encrypted = await encryptAsync(decrypted, newPassword);
  if (isNullOrEmpty(encrypted))
    throw [Errors.General, ErrorCodes.Encrypt5];

  return encrypted;
}

export const getLoginInfo = async () => {
  const loginAttempts = await getFromSecureStoreAsync(storeConstants.loginAttempts);
  const isInitialized = await isInitializedAsync();
  const isPinLocked = await isPinLockedAsync();
  return { loginAttempts, isPinLocked, isInitialized, isSignedIn: DataEncryption.canEncryptDecrypt };
}

const isInitializedAsync = async () => {
  const isInitialized = await getFromSecureStoreAsync(storeConstants.isInitialized);
  return (isInitialized === 'true');
}

const isPinLockedAsync = async () => {
  try {
    const passwordInStore = await getFromSecureStoreAsync(storeConstants.password);
    if (passwordInStore && (passwordInStore + '').trim().length > 0)
      return true;
    return false;
  } catch (error) {
    console.log(error);
    throw [Errors.AccessStorage, ErrorCodes.Storage7];
  }
}

const DataEncryption = { canEncryptDecrypt: false, decryptDataAsync: null, encryptDataAsync: null, getHashAsync: null };
export const resetEncryptDecryptDataFunctions = async () => {
  DataEncryption.canEncryptDecrypt = false;
  DataEncryption.decryptDataAsync = null;
  DataEncryption.encryptDataAsync = null;
  DataEncryption.getHashAsync = null;
}

export const createEncryptDecryptDataFunctions = async (dataEncryptionKeyEncrypted, password) => {
  //TODO: check login attempts and show error if exceeded

  const functions = await createCryptoFunctions(dataEncryptionKeyEncrypted, password);

  DataEncryption.canEncryptDecrypt = true;
  DataEncryption.decryptDataAsync = functions.decryptDataAsync;
  DataEncryption.encryptDataAsync = functions.encryptDataAsync;
  DataEncryption.getHashAsync = functions.getHashAsync;
}
/**
 * @description createCryptoFunctions that takes password entered by the user during the logon process or import, 
 * decrypts the dataEncryptionKey and creates the functions that handle crypto without
 * re-retrieving the data encryption key or the need to pass it around
 */
export const createCryptoFunctions = async (dataEncryptionKeyEncrypted, password) => {

  if (!dataEncryptionKeyEncrypted || !password)
    throw [Errors.InvalidParameter, ErrorCodes.Auth1];
  const dataEncryptionKeyDecrypted = await decryptAsync(dataEncryptionKeyEncrypted, password);
  if (!dataEncryptionKeyDecrypted)
    throw [Errors.InvalidPassword, ErrorCodes.Auth2];

  const functions = {};
  functions.decryptDataAsync = async (data) => {
    return await decryptAsync(data, dataEncryptionKeyDecrypted);
  };
  functions.encryptDataAsync = async (data) => {
    return await encryptAsync(data, dataEncryptionKeyDecrypted);
  };
  functions.getHashAsync = async (data) => {
    return await getHashAsync(data, dataEncryptionKeyDecrypted);
  };
  return functions;
}

/* retrieve encrypted password from store and try to decrypt it with PIN */
export const validatePIN = async (pin) => {
  if (!pin)
    throw Errors.InvalidPIN;
  const encryptedPassword = await getFromSecureStoreAsync(storeConstants.password);
  if (isNullOrEmpty(encryptedPassword))
    throw Errors.InvalidPIN;
  const decryptedPassword = await decryptAsync(encryptedPassword, pin);
  if (isNullOrEmpty(decryptedPassword))
    throw Errors.InvalidPIN;
}

/* user signing in with PIN number; retrieve encrypted password from store, try to decrypt it and 
use it to sign in if the PIN is correct */
export const createEncryptDecryptDataFunctionsPIN = async (dataEncryptionKeyEncrypted, pin) => {
  //TODO: check login attempts and show error if exceeded
  if (!dataEncryptionKeyEncrypted || !pin)
    throw [Errors.InvalidParameter, ErrorCodes.Auth4];
  const encryptedPassword = await getFromSecureStoreAsync(storeConstants.password);
  if (isNullOrEmpty(encryptedPassword))
    throw [Errors.General, ErrorCodes.Auth5];
  const decryptedPassword = await decryptAsync(encryptedPassword, pin);
  if (isNullOrEmpty(decryptedPassword))
    throw [Errors.InvalidPIN, ErrorCodes.Auth6];
  await createEncryptDecryptDataFunctions(dataEncryptionKeyEncrypted, decryptedPassword);
}

export const isSignedIn = () => {
  return DataEncryption.canEncryptDecrypt;
}

const generateRandomKeyAsync = async () => {
  return lib.WordArray.random(16).toString(); /* convert to string, important for decryption, otherwise the encodings will be different Utf8 vs Hex after re-encryption */
}

const getHashAsync = async (value, key) => {
  if (!key)
    throw [Errors.General, ErrorCodes.UnableToHashWithoutPassword];

  const hash = HmacSHA256(value, key);
  return enc.Base64.stringify(hash);
}

const encryptAsync = async (value, key) => {
  if (!key)
    throw [Errors.General, ErrorCodes.Encrypt6];
  if (!value || value === '')
    return value;
  try {
    return AES.encrypt(value, key).toString();
  } catch (error) {
    console.log(error);
    throw [Errors.General, ErrorCodes.Encrypt7];
  }
}

const decryptAsync = async (value, key) => {
  if (!key)
    throw [Errors.General, ErrorCodes.Decrypt7];
  if (!value || value === '')
    return value;

  try {
    const bytes = AES.decrypt(value, key);
    const decrypted = bytes.toString(enc.Utf8);
    return decrypted;

  } catch (error) {
    console.log(error);
    throw [Errors.InvalidData, ErrorCodes.Decrypt8];
  }
}

const getFromSecureStoreAsync = async (key) => {
  return await SecureStore.getItemAsync(key, {});
}

const setToSecureStoreAsync = async (key, value) => {
  return await SecureStore.setItemAsync(key, value, {});
}