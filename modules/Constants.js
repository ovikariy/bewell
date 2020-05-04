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
    PasswordSaved: 'Password saved successfully',
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
    title: 'Set Password',
    explanation: 'Make your data private and protect it with a password',
    currentPlaceholder: 'Enter current password',
    newPlaceholder: 'Enter new password',
    reEnterPlaceholder: 'Re-enter new password',
    apply: 'Apply Changes',
    message1: 'New password and re-entered new password must match'
  },
  welcomeScreen: {
    title: 'Welcome friend!',
    menuLabel: 'Welcome',
    text1: 'Welcome \r\nfriend!',
    text2: 'Track your wellbeing \r\nand keep your data private',
    button1: 'QUICK SETUP',
    button2: 'SKIP'
  },
  setupSecurityScreen: {
    title: 'Secure data',
    menuLabel: 'Secure data',
    text1: 'Secure your data \r\nwith a password or \r\npass phrase',
    text2: 'Please use the minimum of 8 characters and can be multiple words with spaces',
    text3: 'Please re-enter your password \r\n\r\n',
    placeholder1: 'Enter password...',
    placeholder2: 'Re-renter password',
    link1: 'SKIP',
    message1: 'Passwords don\'t match. Please try again',
    message2: 'Password must be at least 8 characters long'
  },
  setupPINScreen: {
    title: 'Set PIN',
    menuLabel: 'Set PIN',
    text1: 'Set a numeric PIN for logging into the app',
    text2: 'To verify it is you, please enter your current password',
    text3: 'Enter at least a 4 digit PIN number below',
    text4: 'Re-enter your new PIN number',
    text5: 'Please use 4 to 6 digits',
    text6: 'Your PIN has been set',
    tip1: 'Tip: use a six or more digits \r\nfor stronger security',
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
    text1: 'Your data is protected',
    text2: 'Enter your password to proceed',
    text3: 'Enter your PIN to proceed',
    currentPlaceholder2: 'Enter password',
    currentPlaceholder3: 'Enter PIN',
    button: 'Sign In',
    message2: 'Invalid password',
    message3: 'Invalid PIN',
  },
  //TODO: need signup stuff?
  signUpScreen: {
    title: 'Sign Up',
    menuLabel: 'Sign Up',
    explanation: 'Create a password that will be used to securely encrypt your data and allow only you to access the app',
    currentPlaceholder: 'Enter password',
    button: 'Sign Up',
    message1: 'Invalid password'
  },
  signOutScreen: {
    title: 'Sign Out',
    menuLabel: 'Sign Out',
    text1: 'Click below \r\nto sign out',
    text2: 'This will clear your session and \r\nprompt for password on the next \r\napp launch',
    button: 'SIGN OUT',
    link: 'NO, GO BACK'
  },
  backupScreen: {
    title: 'Import and Export',
    exportExplanation: 'Export data to file',
    importExplanation: 'Import data from file',
    passwordExplanation: 'Please enter your password:',
    fileExplanation: 'Please enter the password that was used to encrypt the file:',
    export: 'Export',
    import: 'Import',
    passPlaceholder: 'Enter password',
    filePlaceholder: 'Enter file password',
    proceed: 'Proceed with import',
    emptyFile: 'Looks like the file is empty',
    noValidRecords: 'No valid records were found in the file',
    invalidData: 'Invalid data',
    invalidFormat: 'Invalid format',
    invalidItemName: 'Invalid type name found',
    importSucceeded: 'Import succeeded!'
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
    placeholder: 'What\'s on your mind?',
    tagInstruction: 'tap a tag to add to note or type in your own: '
  },
  homeScreen: {
    title: 'YOUR WELLBEING',
    menuLabel: 'Home',
    save: 'Save',
    dontSave: 'Don\'t save',
    confirmSave: 'Save changes?',
    confirmSaveMessage: 'Would you like to save changes before navigating away?'
  },
  settingsScreen: {
    title: 'Settings',
    setPassword: 'Set Password',
    setPIN: 'Set PIN',
    importExport: 'Import and Export',
    version: 'app version'
  },
  insightsScreen: {
    title: 'Insights'
  },
  widgets: {
    welcomeMessage1: 'How are you?',
    welcomeMessage2: 'Tap the buttons above to add to your wellbeing',
    welcomeMessage3: '(e.g. Note or Mood)'
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

/* WellKnownStoreKeys are for other records to be stored e.g Settings or Tags  */
export const WellKnownStoreKeys = {
  TAGS: keyPrefix + 'TAGS',
  SETTINGS: keyPrefix + 'SETTINGS'
}

export const stateConstants = {
  OPERATION: 'OPERATION',
  AUTH: 'AUTH',
  PINSETUP: 'PINSETUP'
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



const minDateString = '1970-01-01';
export const defaultTags = [{ id: '#gratitude', date: minDateString }, { id: '#inspired', date: minDateString },
{ id: '#feelingGood', date: minDateString }, { id: '#pain', date: minDateString }, { id: '#headache', date: minDateString },
{ id: '#goals', date: minDateString }, { id: '#anxious', date: minDateString }, { id: '#sensitive', date: minDateString },
{ id: '#tired', date: minDateString }, { id: '#happy', date: minDateString }, { id: '#optimistic', date: minDateString }];

export const Errors = {
  General: 'An error has occurred ',
  InvalidData: 'Invalid data ',
  InvalidParameter: 'Invalid parameter ',
  InvalidKey: 'Invalid key ',
  NewPasswordCannotBeBlank: 'New password cannot be blank ',
  InvalidPassword: 'Invalid password, please try again ',
  InvalidPIN: 'Invalid PIN, please try again ',
  MissingPassword: 'Missing password or PIN, please try again ',
  InvalidFilePassword: 'Invalid password for this file, please try again',
  UnableToSave: 'Unable to save ',
  UnableToDecrypt: 'Unable to decrypt ',
  ImportError: 'Import error ',
  AccessStorage: ' Unable to access storage ',
  PasswordAlreadySet: 'Password has already been set ',
  CannotSetPIN: 'Cannot setup new PIN'
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
  Decrypt11: 'D10012',
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
  Security1: 'SE1001'
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
