import { AES, HmacSHA256, enc, lib } from 'crypto-js';
import { ErrorCode, ErrorMessage, StoreConstants } from './constants';
import * as SecureStore from 'expo-secure-store';
import { consoleColors, consoleLogWithColor, isNullOrEmpty } from './helpers';
import { isNumber, toNumber } from 'lodash';
import { AppError } from './appError';


export interface LoginInfo {
  loginAttempts: number;
  isPinLocked: boolean;
  isEncrypted: boolean;
  isInitialized: boolean;
  isSignedIn: boolean;
}

interface DataEncryptionInterface {
  canEncryptDecrypt: boolean;
  encryptData: ((data: string) => string) | null;
  decryptData: ((data: string) => string) | null;
  getHash: ((data: string) => string) | null;
}

export async function getAllHashedStoreKeysAsync() {
  return getMultipleHashedKeysAsync(StoreConstants.AllEncryptedStoreKeys);
}

export async function getMultipleHashedKeysAsync(keysToHash: string[]) {
  if (!keysToHash || keysToHash.length < 0)
    throw new AppError(ErrorMessage.InvalidKey, ErrorCode.MissingKey7);
  if (!DataEncryption.getHash)
    throw new AppError(ErrorMessage.Unauthorized, ErrorCode.MissingKey7);
  const hashedKeys = [];

  for (const key of keysToHash) {
    const keyHash = DataEncryption.getHash(key);
    hashedKeys.push(keyHash);
  }
  return hashedKeys;
}

export async function setupNewPINAsync(password: string, pin: string) {
  if (isSignedIn() !== true)
    throw new AppError(ErrorMessage.Unauthorized);
  if (isNullOrEmpty(password) || isNullOrEmpty(pin))
    throw new AppError(ErrorMessage.MissingPassword);

  const encryptedPassword = encrypt(password, pin); //TODO: check strong encryption even if PIN is short
  await setToSecureStoreAsync(StoreConstants.password, encryptedPassword);
}

export function signOut() {
  resetEncryptDecryptDataFunctions();
}

export async function initializeAsync() {
  await setToSecureStoreAsync(StoreConstants.isInitialized, 'true');
}

//TODO: revisit
export async function firstTimeEncryptAllAsync(items: [string, string][], password: string) {
  /* data will be encrypted with a random Data Encryption Key and that
  key is going to be encrypted with user's password and stored in Async Storage;
  if the user changes the password the Data Encryption Key will not change */
  const encryptionKey = generateRandomKey();
  const encryptionKeyEncrypted = encrypt(encryptionKey, password);
  const resultArray: [string, string][] = [];

  // 1. encrypt the encryption key
  resultArray.push([StoreConstants.DataEncryptionStoreKey, encryptionKeyEncrypted]);

  // items format is [['k1', 'val1'], ['k2', 'val2']] keys need to be hashed and values encrypted
  for (const index in items) {
    const item = items[index];
    // 2. hash item key with encryption key
    const existingItemTypeHash = await getHash(item[0], encryptionKey);
    const existingItemValue = item[1];
    if (!existingItemValue)
      continue;
    // 3. encrypt item value with encryption key
    const existingItemValueEncrypted = encrypt(existingItemValue, encryptionKey);
    resultArray.push([existingItemTypeHash, existingItemValueEncrypted]);
  }
  createEncryptDecryptDataFunctions(encryptionKeyEncrypted, password);
  return resultArray;
}

export async function decryptAllItemsAsync(items: [string, string][]) {
  if (!DataEncryption.getHash || !DataEncryption.decryptData)
    throw new AppError(ErrorMessage.Unauthorized, ErrorCode.Decrypt10);

  return decryptAllItemsInternalAsync(items, DataEncryption.getHash, DataEncryption.decryptData);
}

export async function decryptAllItemsFromImportAsync(items: [string, string][], getHashAsync: any, decryptDataAsync: any) {
  if (!getHashAsync || !decryptDataAsync)
    throw new AppError(ErrorMessage.UnableToDecrypt, ErrorCode.Decrypt4);

  return decryptAllItemsInternalAsync(items, getHashAsync, decryptDataAsync);
}

async function decryptAllItemsInternalAsync(items: [string, string][], getHashAsyncFunction: any, decryptDataAsyncFunction: any) {
  /*  items are an array of arrays of itemTypeNameHash and itemValue
      e.g. [[ 'itemType1hash', 'item1value' ], [ 'itemType2hash, 'item2value' ]]  */
  /* create a mapping of item type names and their hashes so we know which item is which */
  const itemKeyHashMap: { [hash: string]: string; } = {};

  for (const encryptedStoreKey of StoreConstants.AllEncryptedStoreKeys) {
    const itemKeyHash = await getHashAsyncFunction(encryptedStoreKey);
    itemKeyHashMap[itemKeyHash] = encryptedStoreKey;
  }

  const decryptedItems = [];
  for (const item of items) {

    if (!item || item.length !== 2)
      throw new AppError(ErrorMessage.InvalidData);

    if (item[0] === StoreConstants.DataEncryptionStoreKey)
      continue; /* we don't want to process this */

    if (item[0] === StoreConstants.SETTINGS) {
      decryptedItems.push([item[0], item[1]]); /* SETTINGS are not encrypted */
      continue;
    }

    const hash = item[0];
    const value = item[1];

    const key = itemKeyHashMap[hash];
    if (!key)
      throw new AppError(ErrorMessage.InvalidKey, ErrorCode.MissingKey10);

    const valueDecrypted = await decryptDataAsyncFunction(value);
    if (value && !valueDecrypted)
      throw new AppError(ErrorMessage.UnableToDecrypt, ErrorCode.Decrypt9);


    decryptedItems.push([key, valueDecrypted]);
  }

  return decryptedItems;
}

export function getItemKeyHash(itemKey: string) {

  if (!itemKey)
    throw new AppError(ErrorMessage.General, ErrorCode.Hash1);
  if (!DataEncryption.getHash)
    throw new AppError(ErrorMessage.Unauthorized, ErrorCode.Hash1);

  try {
    return DataEncryption.getHash(itemKey);
  }
  catch (error) {
    console.log(error);
    throw new AppError(ErrorMessage.General, ErrorCode.Hash2);
  }
}

export function decryptData(value: any) {
  if (!value)
    return value;
  if (!DataEncryption.decryptData)
    throw new AppError(ErrorMessage.Unauthorized, ErrorCode.Decrypt1);

  try {
    const valueDecrypted = DataEncryption.decryptData(value);

    if (value && !valueDecrypted)
      throw new AppError(ErrorMessage.General, ErrorCode.Decrypt2);
    return valueDecrypted;

  }
  catch (error) {
    console.log(error);
    throw new AppError(ErrorMessage.General, ErrorCode.Decrypt3);
  }
}

export async function tryDecryptDataAsync(value: any, key: string) {
  try {
    const valueDecrypted = decrypt(value, key);
    if (value && valueDecrypted)
      return true;
    return false;
  }
  catch (error) {
    return false;
  }
}

export function encryptData(value: string) {
  if (!DataEncryption.encryptData)
    throw new AppError(ErrorMessage.Unauthorized, ErrorCode.Encrypt4);

  try {
    return DataEncryption.encryptData(value);
  }
  catch (error) {
    console.log(error);
    throw new AppError(ErrorMessage.General, ErrorCode.Decrypt5);
  }
}

export async function reEncryptAsync(value: string, oldPassword: string, newPassword: string) {
  // 1. decrypt with the old password
  const decrypted = decrypt(value, oldPassword);
  if (isNullOrEmpty(decrypted))
    throw new AppError(ErrorMessage.InvalidPassword, ErrorCode.Decrypt6);

  // 2. encrypt with the new password
  const encrypted = encrypt(decrypted, newPassword);
  if (isNullOrEmpty(encrypted))
    throw new AppError(ErrorMessage.General, ErrorCode.Encrypt1);

  return encrypted;
}

export async function getLoginInfoAsync(): Promise<LoginInfo> {
  const loginAttempts = await getFromSecureStoreAsync(StoreConstants.loginAttempts);
  let loginAttemptsNumber = -1;
  if (isNumber(loginAttempts))
    loginAttemptsNumber = toNumber(loginAttempts);
  const isInitialized = await isInitializedAsync();
  const isPinLocked = await isPinLockedAsync();
  return { loginAttempts: loginAttemptsNumber, isPinLocked, isInitialized, isSignedIn: DataEncryption.canEncryptDecrypt } as LoginInfo;
}

async function isInitializedAsync(): Promise<boolean> {
  const isInitialized = await getFromSecureStoreAsync(StoreConstants.isInitialized);
  return (isInitialized === 'true');
}

async function isPinLockedAsync(): Promise<boolean> {
  try {
    const passwordInStore = await getFromSecureStoreAsync(StoreConstants.password);
    if (passwordInStore && (passwordInStore + '').trim().length > 0)
      return true;
    return false;
  }
  catch (error) {
    console.log(error);
    throw new AppError(ErrorMessage.AccessStorage, ErrorCode.Storage7);
  }
}

const DataEncryption = { canEncryptDecrypt: false } as DataEncryptionInterface;

export function resetEncryptDecryptDataFunctions() {
  DataEncryption.canEncryptDecrypt = false;
  DataEncryption.decryptData = null;
  DataEncryption.encryptData = null;
  DataEncryption.getHash = null;
}

export function createEncryptDecryptDataFunctions(dataEncryptionKeyEncrypted: string, password: string) {

  const functions = createCryptoFunctions(dataEncryptionKeyEncrypted, password);

  /** if we're here then we passed authentication, clear login attempts flag  */
  resetInvalidPINAttemptsAsync().catch(() => { throw new AppError(ErrorMessage.General, ErrorCode.Auth12); });

  DataEncryption.canEncryptDecrypt = functions.canEncryptDecrypt;
  DataEncryption.decryptData = functions.decryptData;
  DataEncryption.encryptData = functions.encryptData;
  DataEncryption.getHash = functions.getHash;
}
/**
 * @description createCryptoFunctions that takes password entered by the user during the logon process or import,
 * decrypts the dataEncryptionKey and creates the functions that handle crypto without
 * re-retrieving the data encryption key or the need to pass it around
 */
export function createCryptoFunctions(dataEncryptionKeyEncrypted: string, password: string): DataEncryptionInterface {
  if (!dataEncryptionKeyEncrypted || !password)
    throw new AppError(ErrorMessage.InvalidParameter, ErrorCode.Auth1);
  const dataEncryptionKeyDecrypted = decrypt(dataEncryptionKeyEncrypted, password);
  if (!dataEncryptionKeyDecrypted)
    throw new AppError(ErrorMessage.InvalidPassword, ErrorCode.Auth2);

  const functions = { canEncryptDecrypt: true } as DataEncryptionInterface;
  functions.decryptData = (data: string) => {
    return decrypt(data, dataEncryptionKeyDecrypted);
  };
  functions.encryptData = (data: string) => {
    return encrypt(data, dataEncryptionKeyDecrypted);
  };
  functions.getHash = (data: string) => {
    return getHash(data, dataEncryptionKeyDecrypted);
  };
  return functions;
}

/* retrieve encrypted password from store and try to decrypt it with PIN */
export async function validatePINAsync(pin: string): Promise<void> {
  if (!pin)
    throw new AppError(ErrorMessage.InvalidPIN);
  const encryptedPassword = await getFromSecureStoreAsync(StoreConstants.password);
  if (isNullOrEmpty(encryptedPassword))
    throw new AppError(ErrorMessage.InvalidPIN);
  const decryptedPassword = decrypt(encryptedPassword + '', pin);
  if (isNullOrEmpty(decryptedPassword))
    throw new AppError(ErrorMessage.InvalidPIN);
}

/* user signing in with PIN number; retrieve encrypted password from store, try to decrypt it and
use it to sign in if the PIN is correct; after StoreConstants.maxLoginAttempts failed attempts clear PIN so user has to re-enter password */
export async function createEncryptDecryptDataFunctionsPINAsync(dataEncryptionKeyEncrypted: string, pin: string) {
  if (!dataEncryptionKeyEncrypted || !pin)
    throw new AppError(ErrorMessage.InvalidParameter, ErrorCode.Auth4);
  const encryptedPassword = await getFromSecureStoreAsync(StoreConstants.password);
  if (isNullOrEmpty(encryptedPassword))
    throw new AppError(ErrorMessage.General, ErrorCode.Auth5);
  const decryptedPassword = decrypt(encryptedPassword + '', pin);
  if (isNullOrEmpty(decryptedPassword)) {
    await incrementInvalidPINAttemptsAsync();
    throw new AppError(ErrorMessage.InvalidPIN, ErrorCode.Auth6);
  }
  createEncryptDecryptDataFunctions(dataEncryptionKeyEncrypted, decryptedPassword);
}

async function incrementInvalidPINAttemptsAsync() {
  /** run this function at other places where PIN re-entry is required */
  const loginAttempts = await getFromSecureStoreAsync(StoreConstants.loginAttempts);
  const loginAttemptsNumber = parseInt(loginAttempts + '') ?? 0;
  if (loginAttemptsNumber >= StoreConstants.maxLoginAttempts) {
    //disable ability to login with PIN so user has to enter the password
    await setToSecureStoreAsync(StoreConstants.password, '');
    throw new AppError(ErrorMessage.MaxLoginAttempts);
  }
  if (loginAttemptsNumber >= 0 && loginAttemptsNumber <= StoreConstants.maxLoginAttempts) {
    await setToSecureStoreAsync(StoreConstants.loginAttempts, (loginAttemptsNumber + 1).toString());
    return;
  }
  await setToSecureStoreAsync(StoreConstants.loginAttempts, (1).toString());
}

async function resetInvalidPINAttemptsAsync() {
  getFromSecureStoreAsync(StoreConstants.loginAttempts)
    .then((loginAttempts) => {
      const loginAttemptsNumber = parseInt(loginAttempts + '') ?? 0;
      if (loginAttemptsNumber !== 0)
        setToSecureStoreAsync(StoreConstants.loginAttempts, (0).toString());
    });
}

export function isSignedIn(): boolean {
  return DataEncryption.canEncryptDecrypt;
}

function generateRandomKey() {
  return lib.WordArray.random(16).toString(); /* convert to string, important for decryption, otherwise the encodings will be different Utf8 vs Hex after re-encryption */
}

function getHash(value: string, key: string) {
  if (!key)
    throw new AppError(ErrorMessage.General, ErrorCode.UnableToHashWithoutPassword);

  const hash = HmacSHA256(value, key);
  return enc.Base64.stringify(hash);
}

function encrypt(value: string, key: string) {
  if (!key)
    throw new AppError(ErrorMessage.General, ErrorCode.Encrypt2);
  if (!value || value === '')
    return value;
  try {
    return AES.encrypt(value, key).toString();
  }
  catch (error) {
    console.log(error);
    throw new AppError(ErrorMessage.General, ErrorCode.Encrypt3);
  }
}

function decrypt(value: string, key: string) {
  if (!key)
    throw new AppError(ErrorMessage.General, ErrorCode.Decrypt7);
  if (!value || value === '')
    return value;

  try {
    const bytes = AES.decrypt(value, key);
    const decrypted = bytes.toString(enc.Utf8);
    return decrypted;

  }
  catch (error) {
    console.log(error);
    throw new AppError(ErrorMessage.InvalidData, ErrorCode.Decrypt8);
  }
}

function getFromSecureStoreAsync(key: string) {
  return SecureStore.getItemAsync(key, {});
}

function setToSecureStoreAsync(key: string, value: string) {
  return SecureStore.setItemAsync(key, value, {});
}