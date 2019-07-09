import { AES, HmacSHA256, enc, lib } from 'crypto-js';
import { ErrorCodes, Errors, strings, DataEncryptionStoreKey } from '../constants/Constants';
import * as SecureStore from 'expo-secure-store';

export const setPasswordAsync = async (oldPassword, newPassword) => {
  if (!newPassword)
    throw new Error(Errors.NewPasswordCannotBeBlank);

  try {
    const passwordInStore = await getFromSecureStoreAsync(strings.password, {});

    if (passwordInStore) {
      /* there already is a password in storage, 
         ensure the user supplied it before overwritting */
      if (!oldPassword || oldPassword !== passwordInStore)
        throw new Error(Errors.ExistingPasswordWrong);
      await setToSecureStoreAsync(strings.oldpassword, passwordInStore, {});
    }

    await setToSecureStoreAsync(strings.password, newPassword, {});

  } catch (err) {
    console.log(err);
    if (err.message && err.message.indexOf(Errors.ExistingPasswordWrong) > -1)
      throw err; /* this one we don't want to obfuscate */
    else
      throw new Error(Errors.General + ErrorCodes.Encrypt1);
  }
}

export const encryptAndHashMultiItemsAsync = async (items, password) => {
  /* data will be encrypted with a random Data Encryption Key and that 
  key is going to be encrypted with user's password and stored in Async Storage;
  if the user changes the password the Data Encryption Key will not change */
  const encryptionKey = await generateRandomKeyAsync();
  const resultArray = [];

  // 1. encrypt the encryption key
  resultArray.push([DataEncryptionStoreKey, await encryptAsync(encryptionKey, password)]);

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

  return resultArray;
}

export const getItemTypeNameHashAsync = async (itemTypeName, dataEncryptionKey) => {

  if (!dataEncryptionKey || !itemTypeName)
    throw new Error(Errors.General + ErrorCodes.Hash1);

  try {
    const dataEncryptionKeyDecrypted = await decryptWithKeychainPasswordAsync(dataEncryptionKey);
    const itemTypeNameHash = await getHashAsync(itemTypeName, dataEncryptionKeyDecrypted);
    return itemTypeNameHash;
  } catch (err) {
    console.log(err);
    throw new Error(Errors.General + ErrorCodes.Hash2);
  }
}

export const decryptDataAsync = async (value, dataEncryptionKey) => {
  if (!dataEncryptionKey)
    throw new Error(Errors.General + ErrorCodes.Decrypt1);

  try {
    const dataEncryptionKeyDecrypted = await decryptWithKeychainPasswordAsync(dataEncryptionKey);
    const valueDecrypted = await decryptAsync(value, dataEncryptionKeyDecrypted, null);

    if (value && !valueDecrypted)
      throw new Error(Errors.General + ErrorCodes.Decrypt2);
    return valueDecrypted;

  } catch (err) {
    console.log(err);
    throw new Error(Constants.Errors.General + ErrorCodes.Decrypt3);
  }
}

export const encryptDataAsync = async (value, dataEncryptionKey) => {
  if (!dataEncryptionKey)
    throw new Error(Errors.General + ErrorCodes.Encrypt4);

  try {
    // 1. decrypt Data Encryption Key with user's password from keychain
    const dataEncryptionKeyDecrypted = await decryptWithKeychainPasswordAsync(dataEncryptionKey);
    // 2. encrypt data with Data Encryption Key
    return await encryptAsync(value, dataEncryptionKeyDecrypted);
  } catch (err) {
    console.log(err);
    throw new Error(Constants.Errors.General + ErrorCodes.Decrypt5);
  }
}

export const reEncryptAsync = async (value, oldPassword, newPassword) => {
  // 1. decrypt with the old password
  const decrypted = await decryptAsync(value, oldPassword);
  if (!decrypted)
    throw new Error(Constants.Errors.ExistingPasswordWrong + ErrorCodes.Decrypt6);

  // 2. encrypt with the new password
  const encrypted = await encryptAsync(decrypted, newPassword);
  if (!encrypted)
    throw new Error(Constants.Errors.General + ErrorCodes.Encrypt5);

  return encrypted;
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

const decryptWithKeychainPasswordAsync = async (value) => {
  const password = await getFromSecureStoreAsync(strings.password, {});
  if (!password)
    throw new Error(Errors.ExistingPasswordWrong + ErrorCodes.Decrypt9);
  const decrypted = await decryptAsync(value, password);
  if (!decrypted)
    throw new Error(Errors.ExistingPasswordWrong + ErrorCodes.Decrypt10);
  return decrypted;
}

const getFromSecureStoreAsync = async (key, options) => {
  return await SecureStore.getItemAsync(key, options);
}

const setToSecureStoreAsync = async (key, value, options) => {
  return await SecureStore.setItemAsync(key, value, options);
}