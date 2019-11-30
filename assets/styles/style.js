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

//TODO: get rid of this colors const and replace with classes
export const colors = {
  tintColor: defaultColors.color5,
  headingColor: defaultColors.color5,
  bright: defaultColors.color5,
  tabIconDefault: defaultColors.color5,
  tabIconSelected: defaultColors.color5,
  hightlightText: '#555555',
  hightlightBackground: '#eeeeee',
  darkBackground: defaultColors.color3,
  placeholderText: defaultColors.color5 + '70',
  semiTransparentBG: '#00000020',
  transparent: 'transparent',  //'rgba(0,0,0,0)' or '#00000000'
  button: defaultColors.color2,
  primaryButton: defaultColors.color1,
  secondaryButton: defaultColors.color5,
  disabledColor: defaultColors.color5 + '40'
};

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
  // subTitleText: {
  //   fontFamily: fonts.primary,
  //   fontSize: 18,
  //   color: typographyColors.textColor2
  // },

  // buttonLabel: {
  //   fontFamily: fonts.secondary,
  //   fontSize: 14,
  //   color: typographyColors.textColor2
  // },
  // buttonLabelSmall: {
  //   fontFamily: fonts.secondary,
  //   fontSize: 12,
  //   color: typographyColors.textColor2
  // },
  // linkLabel: {
  //   fontFamily: fonts.primaryLight,
  //   fontSize: 12,
  //   color: typographyColors.textColor2
  // },


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
    marginTop: 70 /* add margins equal to the navigator height (e.g. drawer or tab) */
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

  addNewWidgetsButtonContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 5,
    backgroundColor: defaultColors.color6
  },
  widgetTitleContainer: {
    paddingBottom: 10,
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
    color: defaultColors.color2 + '90',
    fontSize: 14,
    marginLeft: 10
  },
  widgetContainer: {
    marginHorizontal: 20, 
    marginBottom: 10,
    paddingVertical: 20,
    borderColor: 'transparent',
    borderBottomColor: defaultColors.color7 + '50',
    borderBottomWidth: 1
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
    width: 150,
    margin: 10,
    resizeMode: 'contain'
  },

  logoImageSmall: {
    height: 30,
    width: 30,
    resizeMode: 'contain'
  },

  /* rating icons  */

  ratingButtonGroupContainer: {
    height: 'auto',
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
    margin: 5
  },
  textArea: {
    margin: 10
  },
  textAreaContainer: {
    backgroundColor: colors.semiTransparentBG,
    borderRadius: 5,
    borderBottomWidth: 0
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    padding: 10
  },
  highlightBackground: {
    backgroundColor: defaultColors.color2
  },
  highlightText: {
    color: defaultColors.color5,
  },
  alignEnd: {
    alignItems: 'flex-end'
  }




  // floatingContainer: {
  //   zIndex: 1,
  //   position: 'absolute',
  //   right: 7,
  //   top: 9
  // },

});

