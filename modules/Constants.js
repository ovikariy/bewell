export const text = {
  general: {
    Ok: 'Ok', Cancel: 'Cancel', Confirm: 'Confirm', ApplyChanges: 'Apply Changes',
    dateAndTime: 'date and time', pickTime: 'pick time',
    Loading: 'Loading...', Saved: 'Saved!', today: 'Today', yesterday: 'Yesterday', at: ' at '
  },
  listItems: {
    AreYouSureDeleteThisItem: 'Are you sure you wish to delete this item?',
    DeleteThisItem: 'Delete this item?',
    SelectItemToDelete: 'Select item to delete',
    ItemDeleted: 'Item deleted',
    Updated: 'Updated successfully'
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
  moodHistoryScreen: {
    title: 'Mood History'
  },
  sleepHistoryScreen: {
    title: 'Sleep History',
    bedTime: 'Bed time:  ',
    wakeTime: 'Wake time: '
  },
  note: {
    title: 'Note History',
    placeholder: 'On my mind...'
  },
  homeScreen: {
    title: 'Home',
    save: 'Save',
    dontSave: 'Don\'t save',
    confirmSave: 'Save changes?',
    confirmSaveMessage: 'Would you like to save changes before navigating away?'
  },
  settingsScreen: {
    title: 'Settings',
    dataPrivacy: 'Data Privacy ...',
    importExport: 'Import and Export ...',
    version: 'app version'
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

/* OtherItemTypes are for other records to be stored e.g Settings or Tags  */
export const OtherItemTypes = {
  TAGS: 'TAGS',
  SETTINGS: 'SETTINGS'
}

export const stateConstants = {
  OPERATION: 'OPERATION'
}

/* In storage we use '@Morning:key' pattern for keys in key/value pairs */
/* DataEncryptionStoreKey is special as it will not be hashed
and the value will be encrypted with the user's password. When the user changes password 
only DataEncryptionStoreKey will have to be re-encrypted in store */
const keyPrefix = '@Morning:';
export const storeConstants = {
  password: 'password',
  oldpassword: 'oldpassword',
  keyPrefix: keyPrefix,
  StoreKeys: Object.keys({ ...ItemTypes, ...OtherItemTypes }).map((item) => keyPrefix + item),
  DataEncryptionStoreKey: keyPrefix + 'DATAENCRYPTIONKEY'
}

export const widgetConfig = {
  [ItemTypes.NOTE]:
  {
    itemTypeName: ItemTypes.NOTE, historyScreenName: 'NoteHistory', multiItem: true,
    addIcon: { text: 'note',  name: 'sticky-note-o', type: 'font-awesome' },
    style: {}
  },
  [ItemTypes.MOOD]:
  {
    itemTypeName: ItemTypes.MOOD, historyScreenName: 'MoodHistory', multiItem: true,
    addIcon: { text: 'mood',  name: 'smile-o', type: 'font-awesome' },
    style: {},
    icons: [
      { name: 'Happy', icon: 'mood-happy', iconStyle: {}, backgroundStyle: { backgroundColor: '#ff9a55' } },
      { name: 'So-so', icon: 'mood-neutral', iconStyle: {}, backgroundStyle: { backgroundColor: '#009898' } },
      { name: 'Could be better', icon: 'mood-sad', iconStyle: {}, backgroundStyle: { backgroundColor: '#517fa4' } }
    ]
  },
  [ItemTypes.SLEEP]:
  {
    itemTypeName: ItemTypes.SLEEP, historyScreenName: 'SleepHistory', multiItem: true,
    addIcon: { text: 'sleep',  name:'moon-o', type:'font-awesome' },
    style: {},
    icons: [
      { name: 'Restful', icon: 'sleep-happy', iconStyle: { color: '#ffffff' }, backgroundStyle: { backgroundColor: '#ff9a55' } },
      { name: 'Interrupted', icon: 'sleep-neutral', iconStyle: { color: '#ffffff' }, backgroundStyle: { backgroundColor: '#009898' } },
      { name: 'Poor', icon: 'sleep-sad', iconStyle: { color: '#ffffff' }, backgroundStyle: { backgroundColor: '#517fa4' } }
    ]
  }
}

export const defaultTags = [{ id: '#gratitude' }, { id: '#inspired' },
{ id: '#feelingGood' }, { id: '#pain' }, { id: '#headache' }, { id: '#goals' }, { id: '#anxious' },
{ id: '#sensitive' }, { id: '#tired' }, { id: '#happy' }, { id: '#optimistic' }];

export const Errors = {
  General: 'An error has occurred ',
  InvalidData: 'Invalid data ',
  InvalidTypeName: 'Invalid type name ',
  NewPasswordCannotBeBlank: 'New password cannot be blank ',
  InvalidPassword: 'Invalid password, please try again ',
  InvalidFilePassword: 'Invalid password for this file, please try again',
  UnableToSave: 'Unable to save ',
  UnableToDecrypt: 'Unable to decrypt ',
  ImportError: 'Import error ',
  AccessStorage: ' Unable to access storage '
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
  Decrypt9: 'D1009',
  Decrypt10: 'D10010',
  Decrypt11: 'D10011',
  MissingItemType1: 'MIT1001',
  MissingItemType2: 'MIT1002',
  MissingItemType3: 'MIT1003',
  MissingKey1: 'MK1001',
  MissingKey2: 'MK1002',
  MissingKey3: 'MK1003',
  MissingKey4: 'MK1004',
  MissingKey5: 'MK1005',
  MissingKey6: 'MK1006',
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
  Storage11: 'S1011'
}