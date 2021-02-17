import { ErrorMessage } from "./translations";
export { ErrorMessage };

export const images = {
  logo_light: require('../assets/images/logo-light.png'),
  logo_dark: require('../assets/images/logo-dark.png'),
  logo_small_light: require('../assets/images/logo-small-light.png'),
  logo_small_dark: require('../assets/images/logo-small-dark.png'),
  splash: require('../assets/images/splash.png'),
  icon: require('../assets/images/icon.png'),
  header: getRandomHeaderImage(), /* chooses a random image from the folder for fun */
  arrow_up_dark: require('../assets/images/arrow-up-dark.png'),
  arrow_up_light: require('../assets/images/arrow-up-light.png'),
};

/* ItemTypes correspond to data keys in storage and will be hashed with DATA ENCRYPTION KEY
and their values will be encrypted with the DATA ENCRYPTION KEY;
These are only for widgets and not to be used for other storage items */
export const ItemTypes = {
  MOOD: 'MOOD',
  NOTE: 'NOTE',
  SLEEP: 'SLEEP',
  IMAGE: 'IMAGE'
};

export const brokenImageURI = 'broken'; /* this is just so that we can show something to user to indicate the image will not get loaded */

export const stateConstants = {
  STORE: 'STORE',
  OPERATION: 'OPERATION',
  AUTH: 'AUTH',
  PINSETUP: 'PINSETUP',
  BACKUPRESTORE: 'BACKUPRESTORE',
  CHANGEPASSWORD: 'CHANGEPASSWORD',
  APPCONTEXT: 'APPCONTEXT'
};

export class StoreConstants {
  static isInitialized = 'isInitialized';
  static loginAttempts = 'loginAttempts';
  static maxLoginAttempts = 6;
  /* In storage we use 'bewellapp_key' pattern for keys in key/value pairs */
  /* DataEncryptionStoreKey is special as it will not be hashed
  and the value will be encrypted with the user's password. When the user changes password
  only DataEncryptionStoreKey will have to be re-encrypted in store */
  static keyPrefix = 'bewellapp_';
  static keyDateFormat = 'MMYYYY';
  static monthsFromEpochDate = getMonthsFromEpochDate(StoreConstants.keyPrefix);
  static AllEncryptedStoreKeys = [...StoreConstants.monthsFromEpochDate];
  static DataEncryptionStoreKey = StoreConstants.keyPrefix + 'DATAENCRYPTIONKEY';
  static SETTINGS = StoreConstants.keyPrefix + 'SETTINGS';
}

function getMonthsFromEpochDate(keyPrefix: string) {
  /* data in store is partitioned by month so the keys can be potentially from
  when the app was first used to current year and month  ['012019', '022019', ... ] */
  const epochYear = 2019;
  const currentYear = new Date().getUTCFullYear();
  const currentMonth = new Date().getUTCMonth() + 1; /* getUTCMonth is zero based */
  const result = [];

  for (let year = epochYear; year <= currentYear; year++) {
    for (let month = 1; month <= 12; month++) {
      if (year === currentYear && month > currentMonth)
        break;
      result.push(keyPrefix + (month < 10 ? '0' : '') + month + '' + year); // 'MMYYYY' format
    };
  }
  return result;
}

export const settingsConstants = {
  language: 'language',
  theme: 'theme',
  version: 'version',
  hideNoteText: 'hideNoteText'
};

export enum ErrorCode {
  Encrypt1 = 'E1001',
  Encrypt2 = 'E1002',
  Encrypt3 = 'E1003',
  Encrypt4 = 'E1004',
  Decrypt1 = 'D1001',
  Decrypt2 = 'D1002',
  Decrypt3 = 'D1003',
  Decrypt4 = 'D1004',
  Decrypt5 = 'D1005',
  Decrypt6 = 'D1006',
  Decrypt7 = 'D1007',
  Decrypt8 = 'D1008',
  Decrypt9 = 'D1009',
  Decrypt10 = 'D10010',
  MissingItemType1 = 'MIT1001',
  MissingKey1 = 'MK1001',
  MissingKey2 = 'MK1002',
  MissingKey3 = 'MK1003',
  MissingKey4 = 'MK1004',
  MissingKey5 = 'MK1005',
  MissingKey7 = 'MK1007',
  MissingKey8 = 'MK1008',
  MissingKey9 = 'MK1009',
  MissingKey10 = 'MK10010',
  MissingKey11 = 'MK10011',
  UnableToHashWithoutPassword = 'HH1001',
  Hash1 = 'H1001',
  Hash2 = 'H1002',
  Storage1 = 'S1001',
  Storage2 = 'S1002',
  Storage3 = 'S1003',
  Storage4 = 'S1004',
  Storage5 = 'S1005',
  Storage6 = 'S1006',
  Storage7 = 'S1007',
  Storage8 = 'S108',
  Storage9 = 'S109',
  Storage10 = 'S1010',
  Storage11 = 'S1011',
  Storage12 = 'S1012',
  Auth1 = 'A1001',
  Auth2 = 'A1002',
  Auth3 = 'A1003',
  Auth4 = 'A1004',
  Auth5 = 'A1005',
  Auth6 = 'A1006',
  Auth7 = 'A1007',
  Auth8 = 'A1008',
  Auth9 = 'A1009',
  Auth10 = 'A10010',
  Auth11 = 'A10011',
  Auth12 = 'A10012',
  Security1 = 'SE1001',
  Security2 = 'SE1002',
  Security3 = 'SE1003',
  Security4 = 'SE1004',
  Security5 = 'SE1005',
  Security6 = 'SE1006',
  Security7 = 'SE1007',
  Security8 = 'SE1008',
  Security9 = 'SE1009',
  Security10 = 'SE1010',
  Import1 = 'I1001',
  Import2 = 'I1002',
  Import3 = 'I1003',
  BackupRestore1 = 'BR1001',
  BackupRestore2 = 'BR1002',
  BackupRestore3 = 'BR1003',
  BackupRestore4 = 'BR1004',
  File1 = 'F1001',
  File2 = 'F1002',
  File3 = 'F1003',
  File4 = 'F1004'
};
/**
 * @description Chooses an image from assets/images/headers directory
 * based on a random number and image filename. This is just for fun
 * instead of always showing the same header image. The filenames should
 * be 'header1.png', 'header2.png' etc format
 */
function getRandomHeaderImage() {
  const randomNumberForHeader = Math.floor(Math.random() * 11);  // returns a random integer from 0 to 10
  let headerImage;
  switch (randomNumberForHeader) {
    case 0:
      headerImage = require('../assets/images/headers/header1.png');
      break;
    case 1:
      headerImage = require('../assets/images/headers/header1.png');
      break;
    case 2:
      headerImage = require('../assets/images/headers/header2.png');
      break;
    case 3:
      headerImage = require('../assets/images/headers/header3.png');
      break;
    case 4:
      headerImage = require('../assets/images/headers/header4.png');
      break;
    case 5:
      headerImage = require('../assets/images/headers/header5.png');
      break;
    case 6:
      headerImage = require('../assets/images/headers/header6.png');
      break;
    case 7:
      headerImage = require('../assets/images/headers/header7.png');
      break;
    case 8:
      headerImage = require('../assets/images/headers/header8.png');
      break;
    case 9:
      headerImage = require('../assets/images/headers/header9.png');
      break;
    case 10:
      headerImage = require('../assets/images/headers/header10.png');
      break;
    default:
      headerImage = require('../assets/images/headers/header1.png');
      break;
  }
  return headerImage;
}