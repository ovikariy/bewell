import { styles, Fonts, Colors } from '../assets/styles/style';

export const CannotSaveEmptyItem = 'Cannot save empty item';
export const MustSpecifyItemTypeToGet = 'Must specify item type to get';
export const MustSpecifyItemTypeToSave = 'Must specify item type to save';
export const MustSpecifyItemTypeToDelete = 'Must specify item type to delete';
export const HistoryItemDeleted = 'History item deleted successfully';

export const SelectItemToDelete = 'Select item to delete';
export const AreYouSureDeleteThisItemFromHistory = 'Are you sure you wish to delete this item from history?';
export const DeleteThisItemFromHistory = 'Delete this item from history?';

export const Ok = 'Ok';
export const Cancel = 'Cancel';

export const Sample = 'Sample';

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






