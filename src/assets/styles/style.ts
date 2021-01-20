import { StyleSheet, Platform, Dimensions, StatusBar, PixelRatio } from 'react-native';
import { themes, ThemePropertyType } from '../../modules/themes';

const fonts = {
  primary: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
  primaryLight: Platform.OS === 'ios' ? 'Helvetica' : 'open-sans-condensed-light',
  secondary: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif-medium',
  secondaryCondensed: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif-condensed'
};

/* small tablets and smaller are treated the same; dimensions.width is 392 for a 5.7-inch device, 600 for a 7-inch device, and 800 for a 10-inch device */
const smallDeviceWidth = 700;

export const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  isSmallDevice: Dimensions.get('window').width <= smallDeviceWidth,
  /* on larger devices need some padding at the top, seems to be ok on smaller devices */
  safeAreaAndroidPadding: Platform.OS === "android" && Dimensions.get('window').width > smallDeviceWidth ? StatusBar.currentHeight : 0
};

export const platform = {
  OS: Platform.OS
};

/**
 * sizes constant is useful when specifying margins, widths, etc so they get scaled properly
 * i.e. style={{ marginTop: sizes[10] }}
 */
export const sizes = {
  5: normalizeSize(5),
  6: normalizeSize(6),
  10: normalizeSize(10),
  15: normalizeSize(15),
  16: normalizeSize(16),
  18: normalizeSize(18),
  20: normalizeSize(20),
  22: normalizeSize(22),
  24: normalizeSize(24),
  30: normalizeSize(30),
  40: normalizeSize(40),
  50: normalizeSize(50),
  60: normalizeSize(60),
  70: normalizeSize(70),
  100: normalizeSize(100),
  150: normalizeSize(150),
  180: normalizeSize(180),
  255: normalizeSize(255)
};

export function normalizeSize(size: number, factor?: number) {
  if (!size || dimensions.isSmallDevice) /* a small tablet or phone, don't scale */
    return size;
  const scale = dimensions.width / 700;
  let newSize = size * scale;
  if (factor)
    newSize = size + (newSize - size) * factor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
  // if (Platform.OS === 'ios')
  //   return Math.round(PixelRatio.roundToNearestPixel(newSize));
  // else
  //   return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
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
      fontSize: sizes[22],
      fontWeight: '100',
      color: colors.foreground
    },
    heading2: {
      fontFamily: fonts.primary,
      fontSize: sizes[18],
      fontWeight: '100',
      color: colors.foreground
    },
    subHeading: {
      fontFamily: fonts.primary,
      fontSize: sizes[15],
      color: colors.foreground + '70'
    },
    bodyText: {
      fontFamily: fonts.primary,
      fontSize: normalizeSize(15, 1.2),
      color: colors.colorful1
    },
    bodyTextLarge: {
      fontFamily: fonts.primary,
      fontSize: normalizeSize(18, 1.2),
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
      fontSize: sizes[24],
      fontWeight: '200',
      color: colors.foreground
    },
    subTitleText: {
      fontFamily: fonts.secondaryCondensed,
      color: colors.foreground + '70',
      fontSize: sizes[18]
    },
    buttonText: {
      fontFamily: fonts.secondaryCondensed,
      color: colors.foreground,
      fontSize: sizes[18],
      textTransform: 'uppercase'
    },
    hugeText: {
      fontFamily: fonts.secondary,
      fontSize: sizes[30],
      letterSpacing: 2
    },
    appName: {
      fontFamily: fonts.secondaryCondensed,
      fontSize: sizes[30],
      letterSpacing: 2,
      textTransform: 'uppercase'
    },

    border: {
      borderWidth: 1,
      borderColor: colors.foreground + '50',
    },

    /* buttons */

    iconPrimary: {
      fontSize: sizes[30],
      color: colors.foreground
    },

    iconPrimarySmall: {
      fontSize: sizes[20],
      color: colors.foreground
    },

    iconSecondary: {
      fontSize: sizes[30],
      color: colors.colorful1
    },
    iconSecondarySmall: {
      fontSize: sizes[20],
      color: colors.colorful1
    },
    roundedButton: {
      fontSize: sizes[30],
      color: colors.foreground2
    },
    roundedButtonContainer: {
      borderRadius: 100,
      width: sizes[40],
      height: sizes[40],
      justifyContent: 'center', /* for vertical icon alignment */
      backgroundColor: colors.colorful2
    },
    rounded: {
      borderRadius: 100,
      padding: sizes[5]
    },
    padded: {
      padding: sizes[10]
    },
    buttonPrimary: {
      backgroundColor: colors.foreground + '10',
      borderColor: colors.foreground + '50',
      borderWidth: 1,
      borderRadius: 40,
      paddingHorizontal: normalizeSize(10, 0.5),
      paddingVertical: normalizeSize(10, 0.5),
      margin: normalizeSize(3, 0.5)
    },
    buttonSecondary: {
      backgroundColor: colors.colorful2,
      borderWidth: 0,
      borderRadius: 40,
      paddingHorizontal: normalizeSize(10, 0.5),
      paddingVertical: normalizeSize(10, 0.5),
      margin: normalizeSize(3, 0.5)
    },
    buttonLarge: {
      width: normalizeSize(280)
    },
    buttonMedium: {
      width: sizes[180]
    },
    buttonSmallCentered: {
      marginTop: 60,
      width: 200,
      alignSelf: 'center'
    },
    /* containers */

    safeAreaView: {
      flex: 1,
      backgroundColor: colors.background /* color behind the device status bar */
    },
    screenContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingScreeenOverlay: {
      position: 'absolute',
      zIndex: 1,
      width: '100%',
      height: '100%',
      marginTop: dimensions.safeAreaAndroidPadding
    },
    screenBodyContainer: {
      /* don't add padding here because will cut off lists on the bottom (e.g. Settings screen) */
      /* add margins equal to the navigator height (e.g. drawer or tab) or bottom toolbar */
      marginTop: sizes[40],
      flex: 1
    },
    screenBodyContainerLargeMargin: {
      paddingHorizontal: sizes[40],
      marginTop: dimensions.isSmallDevice ? sizes[70] : sizes[100]
    },
    screenBodyContainerMediumMargin: {
      paddingHorizontal: sizes[40],
      marginTop: dimensions.isSmallDevice ? sizes[50] : sizes[60]
    },
    screenBodyContainerSmallMargin: {
      paddingHorizontal: sizes[40],
      marginTop: dimensions.isSmallDevice ? sizes[30] : sizes[40]
    },
    selectedDateContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    rowContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: sizes[10],
      marginBottom: 0
    },

    /* widgets */

    widgetTitleContainer: {
      paddingBottom: sizes[10],
      paddingLeft: sizes[10],
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center' /* vertical align when flexDirection is set to row */
    },
    widgetTitle: {
      color: colors.foreground,
      textTransform: 'capitalize',
      fontSize: sizes[20]
    },
    widgetSubTitle: {
      color: colors.foreground + '70',
      fontSize: normalizeSize(12),
      marginLeft: sizes[10]
    },
    widgetContainer: {
      paddingHorizontal: sizes[10],
      paddingVertical: sizes[20],
      borderColor: colors.transparent,
      borderBottomColor: colors.foreground + '50',
      borderBottomWidth: 1
    },
    widgetContainerSelected: {
      backgroundColor: colors.foreground + '20'
    },
    widgetArrowContainer: {
      height: sizes[50],
      width: sizes[15],
      margin: sizes[10],
      resizeMode: 'contain'
    },

    //TODO: normalize
    sleepComponentTimeFieldContainer: {
      width: normalizeSize(300),
      paddingVertical: normalizeSize(10, 0.5),
      paddingHorizontal: sizes[15],
      marginTop: normalizeSize(30, 0.5),
      marginBottom: normalizeSize(20, 0.5),
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
      height: sizes[60],
      width: sizes[150],
      resizeMode: 'contain'
    },

    logoImageSmall: {
      height: sizes[30],
      width: sizes[30],
      resizeMode: 'contain'
    },

    /* rating icons  */

    ratingButtonGroupContainer: {
      flexDirection: 'row',
      borderWidth: 0,
      backgroundColor: colors.transparent
    },
    ratingOutlineContainer: {
      borderRadius: 100,
      borderWidth: normalizeSize(3),
      borderStyle: 'dotted',
      padding: normalizeSize(2),
      borderColor: colors.transparent
    },
    ratingOutlineContainerSelected: {
      borderColor: colors.foreground
    },
    ratingIconContainer: {
      alignItems: 'center', /* horizontal center */
      justifyContent: 'center', /* vertical center */
      borderRadius: 100,
      height: sizes[50],
      width: sizes[50]
    },
    ratingIconStyle: {
      fontSize: sizes[30],
      color: colors.foreground
    },

    /* form fields */
    formItem: {
      flex: 2,
      flexDirection: 'row'
    },
    spacedOut: {
      margin: normalizeSize(3)
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
      padding: sizes[10],
      paddingLeft: sizes[20]
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
    dimColor: {
      color: colors.foreground3  /* dark color e.g. black */
    },
    highlightColor: {
      color: colors.background,
    },
    brightColor: {
      color: colors.foreground2, /* light color e.g. white */
    },

    /* drawer */

    drawerHeaderContainer: {
      marginBottom: sizes[20],
    },
    drawerBackground: {
      backgroundColor: colors.background
    },
    drawerItem: {
      borderRadius: 0,
      marginHorizontal: 0,
      marginVertical: 0,
      paddingHorizontal: sizes[10],
      minHeight: sizes[60],
      justifyContent: 'center'
    },
    drawerLabel: {
      fontSize: sizes[18]
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
      fontSize: normalizeSize(12),
      color: colors.foreground2,
      alignSelf: 'center'
    },
    floatingContainer: {
      zIndex: 1,
      position: 'absolute',
      bottom: 0,
      paddingVertical: sizes[10],
      backgroundColor: colors.background2
    },
    toolbarBottomOffset: {
      paddingBottom: normalizeSize(56) /* 52 is the height the toolbar auto renders */
    },

    /* list */

    listItemContainer: {
      height: sizes[70],
      marginBottom: normalizeSize(2),
      backgroundColor: colors.foreground + '20'
    },
    listItemLeftIcon: {
      marginLeft: sizes[5],
      width: sizes[50]
    },

    /* modal */
    modalWrapper: {
      flex: 1,
      backgroundColor: colors.background + '90',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modal: {
      margin: sizes[10],
      padding: sizes[24],
      alignItems: "center",
      shadowColor: colors.foreground3,
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    }
  });
}
