export const text = {
  app: {
    name: 'Wellbeing Tracker'
  },
  general: {
    Ok: 'Ok', Cancel: 'Cancel', Confirm: 'Confirm', ApplyChanges: 'Apply Changes',
    dateAndTime: 'date and time', pickTime: 'pick time',
    Loading: 'Loading...', Saved: 'Saved!', today: 'Today', yesterday: 'Yesterday', at: ' at ',
    SignedOut: 'Signed out'
  },
  successMessages: {
    PasswordSaved: 'Password applied successfully',
    PINSet: 'PIN set successfully'
  },
  listItems: {
    AreYouSureDeleteThisItem: 'Are you sure you wish to delete this item?',
    DeleteThisItem: 'Delete this item?',
    SelectItemFirst: 'Select item first',
    ItemDeleted: 'Item deleted',
    Updated: 'Updated successfully',
    EmptyList: 'Oops...looks like we don\'t have any items here'
  },
  passwordScreen: {
    title: 'Change Password',
    explanation: 'Consider choosing a passphrase with multiple separate random words for stronger protection',
    textInstructions: 'Please use the minimum of 8 characters for new password',
    textConfirmPassword: 'Please confirm your current password',
    textConfirmPIN: 'Please confirm your PIN number',
    textDone: 'Your password has been changed',
    buttonDone: 'DONE',
    currentPlaceholder: 'Confirm current password',
    pinPlaceholder: 'Enter PIN',
    newPlaceholder: 'Enter new password',
    reEnterPlaceholder: 'Re-enter new password',
    apply: 'SAVE',
    message1: 'New password and re-entered new password must match',
    message2: 'All fields are required. New password must be at least 8 characters long'
  },
  welcomeScreen: {
    title: 'Welcome friend!',
    menuLabel: 'Welcome',
    text1: 'Welcome \r\nfriend!',
    text2: 'Track your wellbeing \r\nand keep your data private',
    button1: 'QUICK SETUP',
    button2: 'SKIP'
  },
  setupPasswordScreen: {
    title: 'Secure data',
    menuLabel: 'Secure data',
    text1: 'Secure your data \r\nwith a password or \r\npass phrase',
    text2: 'Please use the minimum of 8 characters and can be multiple words with spaces',
    text3: 'Please re-enter your password',
    placeholder1: 'Enter password...',
    placeholder2: 'Re-renter password',
    link1: 'SKIP',
    message1: 'Passwords don\'t match. Please try again',
    message2: 'Password must be at least 8 characters long'
  },
  setupPINScreen: {
    title: 'PIN Lock',
    menuLabel: 'PIN Lock',
    text1: 'Lock your app with a PIN',
    text2: 'Please confirm your password',
    text3: 'Enter at least a 4 digit PIN number below',
    text4: 'Re-enter your new PIN number',
    text5: 'Please use 4 to 6 digits',
    text6: 'Your PIN has been set',
    tip1: 'Tip: use six or more digits \r\nfor stronger security',
    placeholder2: 'Password',
    placeholder3: 'Enter PIN',
    placeholder4: 'Re-enter PIN',
    message1: 'PIN and re-entered PIN numbers don\'t match. Please try again.',
    message2: 'Please enter the password',
    message3: 'PIN must be at least 4 digits',
    button: 'DONE',
    link: 'Done, go to Home screen'
  },
  signInScreen: {
    text1: 'Welcome back, friend',
    text2: '',
    text3: '',
    currentPlaceholder2: 'Enter password',
    currentPlaceholder3: 'Enter PIN',
    button: 'Sign In',
    message2: 'Invalid password',
    message3: 'Invalid PIN',
  },
  signOutScreen: {
    title: 'Sign Out',
    menuLabel: 'Sign Out',
    text1: 'Click below \r\nto sign out',
    text2: 'This will clear your session and prompt for login again',
    button: 'SIGN OUT',
    link: 'NO, GO BACK'
  },
  restoreScreen: {
    title: 'Import',
    importExplanation: 'Import your app data from a file',
    textBrowse: 'Browse for the file where you have stored it during a prior backup/export operation',
    textFilePassword: 'Oops....cannot import the file. Maybe it was created with a different password? If so, please enter it below or try another file.',
    textComplete: 'Data imported successfully',
    textPassword: 'Please confirm your password',
    textImport: 'Press the button below to import the selected file',
    textDone: 'Data successfully imported',
    labelSelectedFile: 'Selected File:',
    buttonBrowse: 'BROWSE FOR FILE',
    buttonClear: 'CLEAR FILE',
    buttonImport: 'IMPORT',
    buttonPreview: 'PREVIEW',
    buttonDone: 'DONE',
    placeholder1: 'Enter Password',
    placeholder2: 'Enter File Password',
    message1: 'Please enter the password',
    messageEmptyFile: 'Looks like the file is empty',
    messageNoValidRecords: 'No valid records were found in the file',
    messageInvalidData: 'Invalid data, please try another file',
    messageInvalidFormat: 'Invalid format',
    messageInvalidItemName: 'Invalid type name found',
  },
  backupRestoreScreen: {
    title: 'Import and Export',
    exportExplanation: 'Export data to file to be used as a backup or for moving data to another device',
    importExplanation: 'Import data from file, maybe after moving to another device or after resetting the device',
    buttonExport: 'Export',
    buttonImport: 'Import'
  },
  backupScreen: {
    title: 'Export',
    exportExplanation: 'Export data to file to be used as a backup or for moving data to another device',
    exportSubExplanation: 'Your encrypted data is ready for export',
    textPassword: 'Please confirm your password',
    textComplete: 'Data export completed',
    placeholder1: 'Enter Password',
    buttonExport: 'EXPORT',
    buttonDone: 'DONE',
    message1: 'Please enter the password',
    message2: 'Something went wrong. No data to export.'
  },
  files: {
    invalidFileCopy: 'Invalid file to copy'
  },
  historyScreen: {
    title: 'History'
  },
  moodHistoryScreen: {
    title: 'Mood History'
  },
  sleepHistoryScreen: {
    title: 'Sleep History',
    bedTime: 'Bed time:  ',
    wakeTime: 'Wake time: '
  },
  sleep: {
    bedTime: 'set bed time',
    wakeTime: 'set wake time'
  },
  note: {
    title: 'Note History',
    placeholder: 'What\'s on your mind?'
  },
  homeScreen: {
    title: 'YOUR WELLBEING',
    menuLabel: 'Home'
  },
  settingsScreen: {
    title: 'Settings',
    setPassword: 'Password',
    setPIN: 'PIN Lock',
    importExport: 'Import and Export',
    version: 'app version'
  },
  insightsScreen: {
    title: 'History'
  },
  widgets: {
    welcomeMessage1: 'How are you?',
    welcomeMessage2: 'Tap the buttons above to add to your wellbeing',
    welcomeMessage3: ''
  }
}

/* ItemTypes correspond to data keys in storage and will be hashed with DATA ENCRYPTION KEY
and their values will be encrypted with the DATA ENCRYPTION KEY; 
These are only for widgets and not to be used for other storage items */
export const ItemTypes = {
  MOOD: 'MOOD',
  NOTE: 'NOTE',
  SLEEP: 'SLEEP'
}

/* In storage we use '@Morning:key' pattern for keys in key/value pairs */
/* DataEncryptionStoreKey is special as it will not be hashed
and the value will be encrypted with the user's password. When the user changes password 
only DataEncryptionStoreKey will have to be re-encrypted in store */
const keyPrefix = '@Morning:';
const monthsFromEpochDate = getMonthsFromEpochDate(keyPrefix);

/* WellKnownStoreKeys are for other records to be stored e.g Settings  */
export const WellKnownStoreKeys = {
  SETTINGS: keyPrefix + 'SETTINGS'
}

export const stateConstants = {
  STORE: 'STORE',
  OPERATION: 'OPERATION',
  AUTH: 'AUTH',
  PINSETUP: 'PINSETUP',
  BACKUPRESTORE: 'BACKUPRESTORE',
  CHANGEPASSWORD: 'CHANGEPASSWORD'
}

export const storeConstants = {
  password: 'password',
  isInitialized: 'isInitialized',
  loginAttempts: 'loginAttempts',
  oldpassword: 'oldpassword', /* TODO: probably need to remove the usage of this */
  keyPrefix: keyPrefix,
  keyDateFormat: 'MMYYYY',
  monthsFromEpochDate: monthsFromEpochDate,
  AllStoreKeys: [...monthsFromEpochDate, ...Object.values(WellKnownStoreKeys)],
  DataEncryptionStoreKey: keyPrefix + 'DATAENCRYPTIONKEY'
}

export const Errors = {
  General: 'An error has occurred ',
  InvalidData: 'Invalid data ',
  EmptyData: 'Looks like no records have been found',
  InvalidFormat: 'Invalid format ',
  InvalidFileData: 'Invalid data, please try another file ',
  NoRecordsInFile: 'Looks like there are no records in file ',
  InvalidParameter: 'Invalid parameter ',
  InvalidKey: 'Invalid key ',
  NewPasswordCannotBeBlank: 'New password cannot be blank ',
  InvalidPassword: 'Invalid password, please try again ',
  InvalidPIN: 'Invalid PIN, please try again ',
  InvalidCredentials: 'Invalid credentials, please try again ',
  MissingPassword: 'Missing password or PIN, please try again ',
  InvalidFilePassword: 'Invalid password for this file, please try again',
  UnableToSave: 'Unable to save ',
  UnableToDecrypt: 'Unable to decrypt ',
  ImportError: 'Import error ',
  ExportError: 'Export error ',
  AccessStorage: ' Unable to access storage ',
  PasswordAlreadySet: 'Password has already been set, try logging in instead ',
  CannotSetPIN: 'Cannot setup new PIN',
  Unauthorized: 'Unauthorized '
}

export const ErrorCodes = {
  Encrypt1: 'E1001',
  Encrypt2: 'E1002',
  Encrypt3: 'E1003',
  Encrypt4: 'E1004',
  Encrypt5: 'E1005',
  Encrypt6: 'E1006',
  Encrypt7: 'E1007',
  Encrypt8: 'E1008',
  Decrypt1: 'D1001',
  Decrypt2: 'D1002',
  Decrypt3: 'D1003',
  Decrypt4: 'D1004',
  Decrypt5: 'D1005',
  Decrypt6: 'D1006',
  Decrypt7: 'D1007',
  Decrypt8: 'D1008',
  Decrypt11: 'D10011',
  Decrypt12: 'D10012',
  Decrypt13: 'D10013',
  MissingItemType1: 'MIT1001',
  MissingItemType2: 'MIT1002',
  MissingItemType3: 'MIT1003',
  MissingKey1: 'MK1001',
  MissingKey2: 'MK1002',
  MissingKey3: 'MK1003',
  MissingKey4: 'MK1004',
  MissingKey5: 'MK1005',
  MissingKey6: 'MK1006',
  MissingKey7: 'MK1007',
  MissingKey8: 'MK1008',
  MissingKey9: 'MK1009',
  MissingKey10: 'MK10010',
  MissingKey11: 'MK10011',
  MissingItemType4: 'MIT1004',
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
  Storage8: 'S1008',
  Storage9: 'S1009',
  Storage10: 'S1010',
  Storage11: 'S1011',
  Auth1: 'A1001',
  Auth2: 'A1002',
  Auth3: 'A1003',
  Auth4: 'A1004',
  Auth5: 'A1005',
  Auth6: 'A1006',
  Security1: 'SE1001',
  Security2: 'SE1002',
  Security3: 'SE1003',
  Security4: 'SE1004',
  Import1: 'I1001',
  Import2: 'I1002',
  Import3: 'I1003'
}

function getMonthsFromEpochDate(keyPrefix) {
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
