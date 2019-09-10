import { styles, Fonts, Colors } from '../assets/styles/style';

export const Ok = 'Ok';
export const Cancel = 'Cancel';
export const Sample = 'Sample';

/* TODO: move the above strings here */
export const strings = { password: 'password', oldpassword: 'oldpassword', keyPrefix: '@Morning:' };

/* ItemTypes correspond to data keys in storage and will be hashed with DATA ENCRYPTION KEY
and their values will be encrypted with the DATA ENCRYPTION KEY; 
These are only for widgets and not to be used for other storage items */
export const ItemTypes = {
  MOOD: 'MOOD',
  GRATITUDE: 'GRATITUDE',
  NOTE: 'NOTE',
  SLEEP: 'SLEEP'
}

/* In storage we use '@Morning:key' pattern for keys in key/value pairs */
/* DataEncryptionStoreKey is special as it will not be hashed
and the value will be encrypted with the user's password. When the user changes password 
only DataEncryptionStoreKey will have to be re-encrypted in store */
export const StoreKeys = Object.keys(ItemTypes).map((item) =>  strings.keyPrefix + item);
export const DataEncryptionStoreKey = strings.keyPrefix + 'DATAENCRYPTIONKEY';

export const Messages = {
  AreYouSureDeleteThisItemFromHistory: 'Are you sure you wish to delete this item from history?',
  DeleteThisItemFromHistory: 'Delete this item from history?',
  SelectItemToDelete: 'Select item to delete',
  ItemDeleted: 'Item deleted',
}

export const Errors = {
  General: 'An error has occurred ',
  InvalidData: 'Invalid data ',
  InvalidTypeName: 'Invalid type name',
  NewPasswordCannotBeBlank: 'New password cannot be blank',
  ExistingPasswordWrong: 'Password invalid',
  UnableToDecrypt: 'Unable to decrypt'
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
  MissingItemType1: 'MIT1001',
  MissingItemType2: 'MIT1002',
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
  Storage5: 'S1005'
}

export const moodRatingIcons = [
  { name: 'Yay', icon: 'mood-happy', color: '#ff9a55' },
  { name: 'Meh', icon: 'mood-neutral', color: '#009898' },
  { name: 'Boo', icon: 'mood-sad', color: '#517fa4' }
];

export const sleepRatingIcons = [
  { name: 'Yay', icon: 'sleep-happy', color: '#ff9a55' },
  { name: 'Meh', icon: 'sleep-neutral', color: '#009898' },
  { name: 'Boo', icon: 'sleep-sad', color: '#517fa4' }
];

export const TabBarOptions = {
  style: {
    /* for background to be transparent also need position: 'absolute', left: 0, right: 0, bottom: 0 */
    borderTopColor: Colors.transparent,
    backgroundColor: Colors.transparent, //'rgba(255,255,255,0.1)',
    position: 'absolute', left: 0, right: 0, bottom: 0
  },
  // labelStyle: { color: Colors.tabIconDefault } ,
  activeTintColor: Colors.tabIconSelected,
  inactiveTintColor: Colors.tabIconDefault,
  labelStyle: styles.tabIconLabel
}

export const DrawerNavOptions = {
  headerStyle: {
    borderWidth: 0
  },
  headerTitleStyle: {
    fontFamily: Fonts.heading,
    fontWeight: 'bold'
  },
  headerTransparent: true,
  headerTintColor: Colors.tintColor
}






