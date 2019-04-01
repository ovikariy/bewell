import Colors from '../constants/Colors';


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

export const HeaderOptions = {
    headerTransparent: true,
    headerStyle: {
      borderWidth: 0
    },
    headerTintColor: 'white'
  };

export const TabBarOptions = {
  style: {
    /* for background to be transparent also need position: 'absolute', left: 0, right: 0, bottom: 0 */
    borderTopColor: 'transparent',
    backgroundColor: 'transparent', //'rgba(255,255,255,0.1)',
    position: 'absolute', left: 0, right: 0, bottom: 0
  },
  // labelStyle: { color: Colors.tabIconDefault } ,
  activeTintColor: Colors.tabIconSelected,
  inactiveTintColor: Colors.tabIconDefault
}





