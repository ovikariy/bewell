import { StyleSheet, Platform, Dimensions } from 'react-native';

export const fonts = {
  primary: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
  primaryLight: Platform.OS === 'ios' ? 'Helvetica' : 'open-sans-condensed-light',
  secondary: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif-thin',
  secondaryLight: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif-light',
  defaultTextSize: 18
};

export const size = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  isSmallDevice: Dimensions.get('window').width < 375
}

/* don't use short notation for colors because may need to append opacity e.g. tintColor + '70' */
const defaultColors = {
  color1: '#FFFFFF', /* snow white */
  color2: '#F0F3F4', /* ice super light grey */
  color3: '#C8D1D3',  /* steel light grey */
  color4: '#87BCBF', /* sage light aqua */

  color5: '#324755', /* drab dark grey */
  color6: '#D97D54', /* rust burnt orange */
  color7: '#6E8CA0', /* slate medium grey */
  color8: '#1B1C20',  /* onyx black */

  transparent: 'transparent'
}

export const styles = StyleSheet.create({

  /* common */
  flex: {
    flex: 1
  },
  centered: {
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },

  /* typography */

  heading: {
    fontFamily: fonts.primary,
    fontSize: 22,
    fontWeight: '100',
    color: defaultColors.color1
  },
  heading2: {
    fontFamily: fonts.primary,
    fontSize: 18,
    fontWeight: '100',
    color: defaultColors.color1
  },  
  subHeading: {
    fontFamily: fonts.primary,
    fontSize: 15,
    color: defaultColors.color4
  },
  bodyText: {
    fontFamily: fonts.primary,
    fontSize: 15,
    color: defaultColors.color4
  },
  bodyTextBright: {
    fontFamily: fonts.primary,
    fontSize: 15,
    color: defaultColors.color1
  },
  placeholderText: {
    color: defaultColors.color4 + '70'
  },
  titleText: {
    fontFamily: fonts.primaryLight,
    fontSize: 24,
    fontWeight: '200',
    color: defaultColors.color1
  },
  subTitleText: {
    fontFamily: fonts.primary,
    color: defaultColors.color1 + '95',
    fontSize: 18
  },

  /* buttons */

  iconPrimary: {
    fontSize: 30,
    color: defaultColors.color1
  },

  iconPrimarySmall: {
    fontSize: 20,
    color: defaultColors.color1
  },

  iconSecondary: {
    fontSize: 30,
    color: defaultColors.color4
  },
  iconSecondarySmall: {
    fontSize: 20,
    color: defaultColors.color4
  },
  buttonPrimary: {
    backgroundColor: defaultColors.color1 + '10',
    borderColor: defaultColors.color1 + '50',
    borderWidth: 1,
    borderRadius: 40,
    paddingHorizontal: 15,
    margin: 3
  },

  buttonSecondary: {
    backgroundColor: defaultColors.transparent,
    borderWidth: 0,
    borderRadius: 50,
    paddingHorizontal: 15,
    margin: 3
  },

  /* containers */

  screenContainer: {
    flex: 1,
    backgroundColor: defaultColors.color5
  },
  screenBodyContainer: {
    /* don't add padding here because will cut off lists on the bottom (e.g. Settings screen) */
    /* add margins equal to the navigator height (e.g. drawer or tab) or bottom toolbar */
    marginTop: 70
  },
  selectedDateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10
  },
  rowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    marginBottom: 0
  },
  imageContainer: {
    height: 60,
    margin: 10,
    resizeMode: 'contain'
  },

  /* widgets */


  widgetTitleContainer: {
    paddingBottom: 10,
    paddingLeft: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center' /* vertical align when flexDirection is set to row */
  },
  widgetTitle: {
    color: defaultColors.color2,
    textTransform: 'capitalize',
    fontSize: 20
  },
  widgetSubTitle: {
    color: defaultColors.color2 + '50',
    fontSize: 12,
    marginLeft: 10
  },
  widgetContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderColor: 'transparent',
    borderBottomColor: defaultColors.color7 + '50',
    borderBottomWidth: 1
  },
  widgetContainerSelected: {
    backgroundColor: defaultColors.color7 + '80'
  },

  tagsContainer: {
    backgroundColor: defaultColors.color7 + '90',
    padding: 10
  },

  dontKnowWhatToNameThis: {
    width: 300,
    paddingHorizontal: 15,
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
    alignSelf: 'center'
  },

  /* nanvigator */

  logoImage: {
    height: 60,
    width: 60,
    margin: 5,
    resizeMode: 'contain'
  },

  logoImageSmall: {
    height: 30,
    width: 30,
    resizeMode: 'contain'
  },

  /* rating icons  */

  ratingButtonGroupContainer: {
    flexDirection: 'row',
    borderWidth: 0,
    backgroundColor: 'transparent'
  },

  ratingContainer: {
    flex: 1
  },

  ratingOutlineContainer: {
    borderRadius: 50,
    borderWidth: 3,
    borderStyle: 'dotted',
    padding: 2,
    borderColor: 'transparent'
  },

  ratingOutlineContainerSelected: {
    borderColor: '#ffffff'
  },

  ratingIconContainer: {
    alignItems: 'center', /* horizontal center */
    justifyContent: 'center', /* vertical center */
    borderRadius: 50,
    height: 50,
    width: 50
  },

  ratingIconStyle: {
    fontSize: 30,
    color: '#ffffff'
  },

  /* form fields */

  formField: {
    borderWidth: 0
  },

  formItem: {
    flex: 2,
    flexDirection: 'row'
  },
  strongText: {
    fontWeight: 'bold'
  },
  spacedOut: {
    margin: 3
  },
  clearTextAreaContainer: {
    margin: 0,
    padding: 0,
    borderWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: defaultColors.transparent
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    padding: 10
  },
  dimBackground: {
    backgroundColor: defaultColors.color8 + '40'
  },
  highlightBackground: {
    backgroundColor: defaultColors.color2
  },
  highlightText: {
    color: defaultColors.color5,
  },
  alignEnd: {
    alignItems: 'flex-end'
  },
  menuBackground: {
    backgroundColor: defaultColors.color5
  },
  toolbarContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: defaultColors.color6
  },
  toolbarButtonContainer: {
    /* flex: 0, flexGrow: 1 - stretch the buttons and don't cut if they don't fit */
    flex: 0, 
    flexGrow: 1,
    alignItems: 'center', /* horizontal center */
    justifyContent: 'center', /* vertical center */
    textAlignVertical: 'center',
    alignContent: 'center'
  },
  toolbarButtonText: {
    fontFamily: fonts.primary,
    fontSize: 12,
    color: defaultColors.color1,
    alignSelf: 'center'
  },
  floatingContainer: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    paddingVertical: 10,
    backgroundColor: defaultColors.color7
  },
  toolbarBottomOffset: {
    paddingBottom: 56 /* 52 is the height the toolbar auto renders */
  },


  listItemContainer: {
    height: 70, 
    marginBottom: 2, 
    backgroundColor: '#ffffff20' 
  },
  listItemLeftIcon: { 
    marginLeft: 5, 
    width: 50 
  }
});

