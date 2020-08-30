import { StyleSheet, Platform, Dimensions, ViewStyle } from 'react-native';
import { themes, ThemePropertyType } from '../../modules/themes';

const fonts = {
  //TODO: check iOS fonts
  primary: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
  primaryLight: Platform.OS === 'ios' ? 'Helvetica' : 'open-sans-condensed-light',
  secondary: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif-medium',
  secondaryCondensed: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif-condensed',
  defaultTextSize: 18
};

const size = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  isSmallDevice: Dimensions.get('window').width < 375
}

export function getThemeStyles(theme: ThemePropertyType) {

  const colors = theme.colors ? theme.colors : themes.dark.colors;

  return StyleSheet.create({

    /* common */
    flex: {
      flex: 1
    },
    centered: {
      textAlign: 'center',
      alignContent: 'center',
      alignItems: 'center'
    },
    centeredVertical: {
      justifyContent: 'center'
    },
    bottomPositioned: {
      alignSelf: 'center',
      position: 'absolute',
      bottom: 40
    },

    /* typography */

    heading: {
      fontFamily: fonts.primary,
      textTransform: 'uppercase',
      fontSize: 22,
      fontWeight: '100',
      color: colors.foreground
    },
    heading2: {
      fontFamily: fonts.primary,
      fontSize: 18,
      fontWeight: '100',
      color: colors.foreground
    },
    subHeading: {
      fontFamily: fonts.primary,
      fontSize: 15,
      color: colors.foreground + '70'
    },
    bodyText: {
      fontFamily: fonts.primary,
      fontSize: 15,
      color: colors.colorful1
    },
    bodyTextLarge: {
      fontFamily: fonts.primary,
      fontSize: 18,
      color: colors.colorful1
    },
    placeholderText: {
      color: colors.foreground + '70'
    },
    placeholderHighlight: {
      color: colors.foreground3 + '70',
    },
    titleText: {
      fontFamily: fonts.primaryLight,
      fontSize: 24,
      fontWeight: '200',
      color: colors.foreground
    },
    subTitleText: {
      fontFamily: fonts.secondaryCondensed,
      color: colors.foreground + '70',
      fontSize: 18
    },
    buttonText: {
      fontFamily: fonts.secondaryCondensed,
      color: colors.foreground,
      fontSize: 18,
      textTransform: 'uppercase'
    },
    hugeText: {
      fontFamily: fonts.secondary,
      fontSize: 30,
      letterSpacing: 2
    },
    appName: {
      fontFamily: fonts.secondaryCondensed,
      fontSize: 30,
      letterSpacing: 2,
      textTransform: 'uppercase'
    },

    border: {
      borderWidth: 1,
      borderColor: colors.foreground + '50',
    },

    /* buttons */

    iconPrimary: {
      fontSize: 30,
      color: colors.foreground
    },

    iconPrimarySmall: {
      fontSize: 20,
      color: colors.foreground
    },

    iconSecondary: {
      fontSize: 30,
      color: colors.colorful1
    },
    iconSecondarySmall: {
      fontSize: 20,
      color: colors.colorful1
    },
    roundedButton: {
      fontSize: 30,
      color: colors.foreground2
    },
    roundedButtonContainer: {
      borderRadius: 50,
      width: 40,
      height: 40,
      justifyContent: 'center', /* for vertical icon alignment */
      backgroundColor: colors.colorful2
    },
    rounded: {
      borderRadius: 50,
      padding: 5
    },
    buttonPrimary: {
      backgroundColor: colors.foreground + '10',
      borderColor: colors.foreground + '50',
      borderWidth: 1,
      borderRadius: 40,
      paddingHorizontal: 10,
      paddingVertical: 10,
      margin: 3
    },
    buttonSecondary: {
      backgroundColor: colors.colorful2,
      borderWidth: 0,
      borderRadius: 40,
      paddingHorizontal: 10,
      paddingVertical: 10,
      margin: 3
    },

    /* containers */

    screenContainer: {
      flex: 1,
      backgroundColor: colors.background
    },
    screenBodyContainer: {
      /* don't add padding here because will cut off lists on the bottom (e.g. Settings screen) */
      /* add margins equal to the navigator height (e.g. drawer or tab) or bottom toolbar */
      marginTop: 50,
      flex: 1
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

    /* widgets */

    widgetTitleContainer: {
      paddingBottom: 10,
      paddingLeft: 10,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center' /* vertical align when flexDirection is set to row */
    },
    widgetTitle: {
      color: colors.foreground,
      textTransform: 'capitalize',
      fontSize: 20
    },
    widgetSubTitle: {
      color: colors.foreground + '70',
      fontSize: 12,
      marginLeft: 10
    },
    widgetContainer: {
      paddingHorizontal: 10,
      paddingVertical: 20,
      borderColor: colors.transparent,
      borderBottomColor: colors.foreground + '50',
      borderBottomWidth: 1
    },
    widgetContainerSelected: {
      backgroundColor: colors.foreground + '20'
    },
    widgetArrowContainer: {
      height: 50,
      width: 15,
      margin: 10,
      resizeMode: 'contain'
    },

    sleepComponentTimeFieldContainer: {
      width: 300,
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginTop: 30,
      marginBottom: 20,
      textAlign: 'center',
      alignSelf: 'center'
    },

    imageComponentClearButtonContainer: {
      position: 'absolute',
      zIndex: 1,
      top: -20,
      alignSelf: 'flex-end',
      backgroundColor: colors.background
    },

    /* navigator */

    logoImage: {
      height: 50,
      width: 50,
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
      backgroundColor: colors.transparent
    },
    ratingOutlineContainer: {
      borderRadius: 50,
      borderWidth: 3,
      borderStyle: 'dotted',
      padding: 2,
      borderColor: colors.transparent
    },
    ratingOutlineContainerSelected: {
      borderColor: colors.foreground
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
      color: colors.foreground
    },

    /* form fields */
    formItem: {
      flex: 2,
      flexDirection: 'row'
    },
    spacedOut: {
      margin: 3
    },
    clearTextAreaContainer: {
      margin: 0,
      padding: 0,
      borderWidth: 0,
      borderBottomWidth: 0,
      backgroundColor: colors.transparent
    },
    row: {
      flex: 1,
      flexDirection: 'row',
      padding: 10
    },

    /* colors */

    dimBackground: {
      backgroundColor: colors.foreground3 + '40'  /* dark color e.g. black */
    },
    highlightBackground: {
      backgroundColor: colors.foreground /* e.g. when user selects a row, usually dark text and light background */
    },
    brightBackground: {
      backgroundColor: colors.foreground2, /* light color e.g. white */
    },
    highlightColor: {
      color: colors.background,
    },
    brightColor: {
      color: colors.foreground2, /* light color e.g. white */
    },

    /* drawer */

    drawerBackground: {
      backgroundColor: colors.background
    },
    drawerItem: {
      borderRadius: 0,
      marginHorizontal: 0,
      marginVertical: 0,
      paddingHorizontal: 10,
      minHeight: 60,
      justifyContent: 'center'
    },
    drawerLabel: {
      fontSize: 17
    },

    /* toolbar */

    toolbarContainer: {
      flex: 1,
      flexWrap: 'wrap',
      flexDirection: 'row',
      backgroundColor: colors.colorful2
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
      color: colors.foreground2,
      alignSelf: 'center'
    },
    floatingContainer: {
      zIndex: 1,
      position: 'absolute',
      bottom: 0,
      paddingVertical: 10,
      backgroundColor: colors.background2
    },
    toolbarBottomOffset: {
      paddingBottom: 56 /* 52 is the height the toolbar auto renders */
    },

    /* list */

    listItemContainer: {
      height: 70,
      marginBottom: 2,
      backgroundColor: colors.foreground + '20'
    },
    listItemLeftIcon: {
      marginLeft: 5,
      width: 50
    }
  });
}
