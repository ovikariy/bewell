/* ItemTypes correspond to data keys in storage and will be hashed with DATA ENCRYPTION KEY
and their values will be encrypted with the DATA ENCRYPTION KEY; 
These are only for widgets and not to be used for other storage items */
export const ItemTypes = {
  MOOD: 'MOOD',
  NOTE: 'NOTE',
  SLEEP: 'SLEEP',
  IMAGE: 'IMAGE'
}

export const brokenImageURI = 'broken'; /* this is just so that we can show something to user to indicate the image will not get loaded */

export const stateConstants = {
  STORE: 'STORE',
  OPERATION: 'OPERATION',
  AUTH: 'AUTH',
  PINSETUP: 'PINSETUP',
  BACKUPRESTORE: 'BACKUPRESTORE',
  CHANGEPASSWORD: 'CHANGEPASSWORD',
  APPCONTEXT: 'APPCONTEXT'
}

export class storeConstants {
  static password = 'password';
  static isInitialized = 'isInitialized';
  static loginAttempts = 'loginAttempts';
  /* In storage we use '@Morning:key' pattern for keys in key/value pairs */
  /* DataEncryptionStoreKey is special as it will not be hashed
  and the value will be encrypted with the user's password. When the user changes password 
  only DataEncryptionStoreKey will have to be re-encrypted in store */
  static keyPrefix = '@Morning:';
  static keyDateFormat = 'MMYYYY';
  static monthsFromEpochDate = getMonthsFromEpochDate(storeConstants.keyPrefix);
  static AllEncryptedStoreKeys = [...storeConstants.monthsFromEpochDate];
  static DataEncryptionStoreKey = storeConstants.keyPrefix + 'DATAENCRYPTIONKEY';
  static SETTINGS = storeConstants.keyPrefix + 'SETTINGS';
}

function getMonthsFromEpochDate(keyPrefix: string) {
  /* data in store is partitioned by month so the keys can be potentially from 
  when the app was first used to current year and month  ['012019', '022019', ... ] */
  const epochYear = 2019; //TODO: override this from settings when the app was first used?
  const currentYear = new Date().getUTCFullYear();
  const currentMonth = new Date().getUTCMonth() + 1; /* getUTCMonth is zero based */
  const result = [];

  for (var year = epochYear; year <= currentYear; year++) {
    for (var month = 1; month <= 12; month++) {
      if (year == currentYear && month > currentMonth)
        break;
      result.push(keyPrefix + (month < 10 ? '0' : '') + month + '' + year); // 'MMYYYY' format
    };
  }
  return result;
}

export const settingsConstants = {
  language: 'language',
  theme: 'theme',
  version: 'version'
}

export const Errors = {
  General: 'General',
  InvalidData: 'InvalidData',
  EmptyData: 'EmptyData',
  InvalidFormat: 'InvalidFormat',
  InvalidFile: 'InvalidFile',
  InvalidFileData: 'InvalidFileData',
  NoRecordsInFile: 'NoRecordsInFile',
  InvalidParameter: 'InvalidParameter',
  InvalidKey: 'InvalidKey',
  NewPasswordCannotBeBlank: 'NewPasswordCannotBeBlank',
  InvalidPassword: 'InvalidPassword',
  InvalidPIN: 'InvalidPIN',
  InvalidCredentials: 'InvalidCredentials',
  MissingPassword: 'MissingPassword',
  InvalidFilePassword: 'InvalidFilePassword',
  UnableToSave: 'UnableToSave',
  UnableToDecrypt: 'UnableToDecrypt',
  UnableToEncrypt: 'UnableToEncrypt',
  ImportError: 'ImportError',
  ExportError: 'ExportError',
  AccessStorage: 'AccessStorage',
  PasswordAlreadySet: 'PasswordAlreadySet',
  CannotSetPIN: 'CannotSetPIN',
  Unauthorized: 'Unauthorized',
  PasswordSet: 'PasswordSet',
  PinSet: 'PinSet',
  CannotDeleteFile: 'CannotDeleteFile',
  ImageNotFound: 'ImageNotFound'
}

export const ErrorCodes = {
  Encrypt1: 'E1001',
  Encrypt2: 'E1002',
  Encrypt3: 'E1003',
  Encrypt4: 'E1004',
  Decrypt1: 'D1001',
  Decrypt2: 'D1002',
  Decrypt3: 'D1003',
  Decrypt4: 'D1004',
  Decrypt5: 'D1005',
  Decrypt6: 'D1006',
  Decrypt7: 'D1007',
  Decrypt8: 'D1008',
  Decrypt9: 'D1009',
  Decrypt10: 'D10010',
  MissingItemType1: 'MIT1001',
  MissingKey1: 'MK1001',
  MissingKey2: 'MK1002',
  MissingKey3: 'MK1003',
  MissingKey4: 'MK1004',
  MissingKey5: 'MK1005',
  MissingKey7: 'MK1007',
  MissingKey8: 'MK1008',
  MissingKey9: 'MK1009',
  MissingKey10: 'MK10010',
  MissingKey11: 'MK10011',
  UnableToHashWithoutPassword: 'HH1001',
  Hash1: 'H1001',
  Hash2: 'H1002',
  Storage1: 'S1001',
  Storage2: 'S1002',
  Storage3: 'S1003',
  Storage4: 'S1004',
  Storage5: 'S1005',
  Storage6: 'S1006',
  Storage7: 'S1007',
  Storage8: 'S108',
  Storage9: 'S109',
  Storage10: 'S1010',
  Storage11: 'S1011',
  Auth1: 'A1001',
  Auth2: 'A1002',
  Auth3: 'A1003',
  Auth4: 'A1004',
  Auth5: 'A1005',
  Auth6: 'A1006',
  Auth7: 'A1007',
  Auth8: 'A1008',
  Auth9: 'A1009',
  Auth10: 'A10010',
  Auth11: 'A10011',
  Security1: 'SE1001',
  Security2: 'SE1002',
  Security3: 'SE1003',
  Security4: 'SE1004',
  Security5: 'SE1005',
  Security6: 'SE1006',
  Security7: 'SE1007',
  Import1: 'I1001',
  Import2: 'I1002',
  Import3: 'I1003',
  BackupRestore1: 'BR1001',
  BackupRestore2: 'BR1002',
  BackupRestore3: 'BR1003',
  BackupRestore4: 'BR1004',
}
