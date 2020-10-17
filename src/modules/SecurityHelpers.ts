import { AES, HmacSHA256, enc, lib } from 'crypto-js';
import { ErrorCodes, Errors, storeConstants } from './Constants';
import * as SecureStore from 'expo-secure-store';
import { consoleColors, consoleLogWithColor, isNullOrEmpty } from './helpers';
import { isNumber, toNumber } from 'lodash';


export interface LoginInfo {
  loginAttempts: number;
  isPinLocked: boolean;
  isEncrypted: boolean;
  isInitialized: boolean;
  isSignedIn: boolean;
}

interface DataEncryptionInterface {
  canEncryptDecrypt: boolean;
  encryptDataAsync: { (data: string): Promise<string> } | null;
  decryptDataAsync: { (data: string): Promise<string> } | null;
  getHashAsync: { (data: string): Promise<string> } | null;
}

export const getAllHashedStoreKeys = async () => {
  return getMultipleHashedKeys(storeConstants.AllEncryptedStoreKeys);
}

export const getMultipleHashedKeys = async (keysToHash: string[]) => {
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

export const setupNewPINAsync = async (password: string, pin: string) => {
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
export const firstTimeEncryptAllAsync = async (items: [string, string][], password: string) => {
  /* data will be encrypted with a random Data Encryption Key and that 
  key is going to be encrypted with user's password and stored in Async Storage;
  if the user changes the password the Data Encryption Key will not change */
  const encryptionKey = await generateRandomKeyAsync();
  const encryptionKeyEncrypted = await encryptAsync(encryptionKey, password);
  const resultArray: [string, string][] = [];

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

export const decryptAllItems = async (items: [string, string][]) => {
  if (!DataEncryption.getHashAsync || !DataEncryption.decryptDataAsync)
    throw [Errors.Unauthorized, ErrorCodes.Decrypt10];

  return await decryptAllItemsInternal(items, DataEncryption.getHashAsync, DataEncryption.decryptDataAsync);
}

export const decryptAllItemsFromImport = async (items: [string, string][], getHashAsync: any, decryptDataAsync: any) => {
  if (!getHashAsync || !decryptDataAsync)
    throw [Errors.UnableToDecrypt, ErrorCodes.Decrypt4];

  return await decryptAllItemsInternal(items, getHashAsync, decryptDataAsync);
}

const decryptAllItemsInternal = async (items: [string, string][], getHashAsyncFunction: any, decryptDataAsyncFunction: any) => {
  /*  items are an array of arrays of itemTypeNameHash and itemValue 
      e.g. [[ 'itemType1hash', 'item1value' ], [ 'itemType2hash, 'item2value' ]]  */

  /* create a mapping of item type names and their hashes so we know which item is which */
  var itemKeyHashMap: { [hash: string]: string; } = {};

  for (var i = 0; i < storeConstants.AllEncryptedStoreKeys.length; i++) {
    const itemKeyHash = await getHashAsyncFunction(storeConstants.AllEncryptedStoreKeys[i]);
    itemKeyHashMap[itemKeyHash] = storeConstants.AllEncryptedStoreKeys[i];
  }

  const decryptedItems = [];
  for (var i = 0; i < items.length; i++) {
    const item = items[i];

    if (!item || item.length != 2)
      throw Errors.InvalidData;

    if (item[0] === storeConstants.DataEncryptionStoreKey)
      continue; /* we don't want to process this */

    if (item[0] === storeConstants.SETTINGS) {
      decryptedItems.push([item[0], item[1]]); /* SETTINGS are not encrypted */
      continue;
    }

    const hash = item[0];
    const value = item[1];

    const key = itemKeyHashMap[hash];
    if (!key)
      throw [Errors.InvalidKey, ErrorCodes.MissingKey10];

    const valueDecrypted = await decryptDataAsyncFunction(value);
    if (value && !valueDecrypted) {
      throw [Errors.UnableToDecrypt, ErrorCodes.Decrypt9];
    }

    decryptedItems.push([key, valueDecrypted]);
  }

  return decryptedItems;
}

export const getItemKeyHashAsync = async (itemKey: string) => {

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

export const decryptDataAsync = async (value: any) => {
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

export const tryDecryptDataAsync = async (value: any, key: string) => {
  try {
    const valueDecrypted = await decryptAsync(value, key);
    if (value && valueDecrypted)
      return true;
    return false;
  } catch (error) {
    return false;
  }
}

export const encryptDataAsync = async (value: string) => {
  if (!DataEncryption.encryptDataAsync)
    throw [Errors.Unauthorized, ErrorCodes.Encrypt4];

  try {
    return await DataEncryption.encryptDataAsync(value);
  } catch (error) {
    console.log(error);
    throw [Errors.General, ErrorCodes.Decrypt5];
  }
}

export const reEncryptAsync = async (value: string, oldPassword: string, newPassword: string) => {
  // 1. decrypt with the old password
  const decrypted = await decryptAsync(value, oldPassword);
  if (isNullOrEmpty(decrypted))
    throw [Errors.InvalidPassword, ErrorCodes.Decrypt6];

  // 2. encrypt with the new password
  const encrypted = await encryptAsync(decrypted, newPassword);
  if (isNullOrEmpty(encrypted))
    throw [Errors.General, ErrorCodes.Encrypt1];

  return encrypted;
}

export async function getLoginInfo(): Promise<LoginInfo> {
  const loginAttempts = await getFromSecureStoreAsync(storeConstants.loginAttempts);
  let loginAttemptsNumber = -1;
  if (isNumber(loginAttempts))
    loginAttemptsNumber = toNumber(loginAttempts);
  const isInitialized = await isInitializedAsync();
  const isPinLocked = await isPinLockedAsync();
  return { loginAttempts: loginAttemptsNumber, isPinLocked, isInitialized, isSignedIn: DataEncryption.canEncryptDecrypt } as LoginInfo;
}

async function isInitializedAsync(): Promise<boolean> {
  const isInitialized = await getFromSecureStoreAsync(storeConstants.isInitialized);
  return (isInitialized === 'true');
}

async function isPinLockedAsync(): Promise<boolean> {
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

const DataEncryption = { canEncryptDecrypt: false } as DataEncryptionInterface;

export const resetEncryptDecryptDataFunctions = async () => {
  DataEncryption.canEncryptDecrypt = false;
  DataEncryption.decryptDataAsync = null;
  DataEncryption.encryptDataAsync = null;
  DataEncryption.getHashAsync = null;
}

export const createEncryptDecryptDataFunctions = async (dataEncryptionKeyEncrypted: string, password: string) => {

  const functions = await createCryptoFunctions(dataEncryptionKeyEncrypted, password);

  /** if we're here then we passed authentication, clear login attempts flag  */
  resetInvalidPINAttempts().catch(() => { throw [Errors.General, ErrorCodes.Auth12] });

  DataEncryption.canEncryptDecrypt = functions.canEncryptDecrypt;
  DataEncryption.decryptDataAsync = functions.decryptDataAsync;
  DataEncryption.encryptDataAsync = functions.encryptDataAsync;
  DataEncryption.getHashAsync = functions.getHashAsync;
}
/**
 * @description createCryptoFunctions that takes password entered by the user during the logon process or import, 
 * decrypts the dataEncryptionKey and creates the functions that handle crypto without
 * re-retrieving the data encryption key or the need to pass it around
 */
export async function createCryptoFunctions(dataEncryptionKeyEncrypted: string, password: string): Promise<DataEncryptionInterface> {
  if (!dataEncryptionKeyEncrypted || !password)
    throw [Errors.InvalidParameter, ErrorCodes.Auth1];
  const dataEncryptionKeyDecrypted = await decryptAsync(dataEncryptionKeyEncrypted, password);
  if (!dataEncryptionKeyDecrypted)
    throw [Errors.InvalidPassword, ErrorCodes.Auth2];

  let functions = { canEncryptDecrypt: true } as DataEncryptionInterface;
  functions.decryptDataAsync = async (data: string) => {
    return await decryptAsync(data, dataEncryptionKeyDecrypted);
  };
  functions.encryptDataAsync = async (data: string) => {
    return await encryptAsync(data, dataEncryptionKeyDecrypted);
  };
  functions.getHashAsync = async (data: string) => {
    return await getHashAsync(data, dataEncryptionKeyDecrypted);
  };
  return functions;
}

/* retrieve encrypted password from store and try to decrypt it with PIN */
export async function validatePIN(pin: string): Promise<void> {
  if (!pin)
    throw Errors.InvalidPIN;
  const encryptedPassword = await getFromSecureStoreAsync(storeConstants.password);
  if (isNullOrEmpty(encryptedPassword))
    throw Errors.InvalidPIN;
  const decryptedPassword = await decryptAsync(encryptedPassword + '', pin);
  if (isNullOrEmpty(decryptedPassword))
    throw Errors.InvalidPIN;
}

/* user signing in with PIN number; retrieve encrypted password from store, try to decrypt it and 
use it to sign in if the PIN is correct; after storeConstants.maxLoginAttempts failed attempts clear PIN so user has to re-enter password */
export const createEncryptDecryptDataFunctionsPIN = async (dataEncryptionKeyEncrypted: string, pin: string) => {
  if (!dataEncryptionKeyEncrypted || !pin)
    throw [Errors.InvalidParameter, ErrorCodes.Auth4];
  const encryptedPassword = await getFromSecureStoreAsync(storeConstants.password);
  if (isNullOrEmpty(encryptedPassword))
    throw [Errors.General, ErrorCodes.Auth5];
  const decryptedPassword = await decryptAsync(encryptedPassword + '', pin);
  if (isNullOrEmpty(decryptedPassword)) {
    await incrementInvalidPINAttempts();
    throw [Errors.InvalidPIN, ErrorCodes.Auth6];
  }
  await createEncryptDecryptDataFunctions(dataEncryptionKeyEncrypted, decryptedPassword);
}

const incrementInvalidPINAttempts = async() => {
  /** run this function at other places where PIN re-entry is required */
  const loginAttempts = await getFromSecureStoreAsync(storeConstants.loginAttempts);
  const loginAttemptsNumber = parseInt(loginAttempts + '') ?? 0;
  if (loginAttemptsNumber >= storeConstants.maxLoginAttempts) {
    //disable ability to login with PIN so user has to enter the password
    await setToSecureStoreAsync(storeConstants.password, '');
    throw Errors.MaxLoginAttempts;
  }
  if (loginAttemptsNumber >= 0 && loginAttemptsNumber <= storeConstants.maxLoginAttempts) {
    await setToSecureStoreAsync(storeConstants.loginAttempts, (loginAttemptsNumber + 1).toString());
    return;
  }
  await setToSecureStoreAsync(storeConstants.loginAttempts, (1).toString());
}

async function resetInvalidPINAttempts() {
  getFromSecureStoreAsync(storeConstants.loginAttempts)
    .then((loginAttempts) => {
      const loginAttemptsNumber = parseInt(loginAttempts + '') ?? 0;
      if (loginAttemptsNumber != 0)
        setToSecureStoreAsync(storeConstants.loginAttempts, (0).toString());
    });
}

export function isSignedIn(): boolean {
  return DataEncryption.canEncryptDecrypt;
}

const generateRandomKeyAsync = async () => {
  return lib.WordArray.random(16).toString(); /* convert to string, important for decryption, otherwise the encodings will be different Utf8 vs Hex after re-encryption */
}

const getHashAsync = async (value: string, key: string) => {
  if (!key)
    throw [Errors.General, ErrorCodes.UnableToHashWithoutPassword];

  const hash = HmacSHA256(value, key);
  return enc.Base64.stringify(hash);
}

const encryptAsync = async (value: string, key: string) => {
  if (!key)
    throw [Errors.General, ErrorCodes.Encrypt2];
  if (!value || value === '')
    return value;
  try {
    return AES.encrypt(value, key).toString();
  } catch (error) {
    console.log(error);
    throw [Errors.General, ErrorCodes.Encrypt3];
  }
}

const decryptAsync = async (value: string, key: string) => {
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

const getFromSecureStoreAsync = async (key: string) => {
  return await SecureStore.getItemAsync(key, {});
}

const setToSecureStoreAsync = async (key: string, value: string) => {
  return await SecureStore.setItemAsync(key, value, {});
}