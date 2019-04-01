import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

export const Fonts = {
  default: 'sans-serif-light',
  heading: 'sans-serif',
  defaultTextSize: 18,
  iconTextSize: 10
};

export const Size = {
  width: Dimensions.get('window').width
}

/* don't use short notation for colors */
const tintColor = '#cccccc';
const headingColor = '#ffffff'

export const Colors = {
  tintColor,
  headingColor,
  tabIconDefault: tintColor,
  tabIconSelected: headingColor,
  hightlightText: '#555555',
  hightlightBackground: '#eeeeee',
  darkBackground: '#3f374f',
  placeholderText: tintColor + '70',
  semiTransparentBG: 'rgba(0,0,0,0.2)',
  transparent: 'transparent',  //'rgba(0,0,0,0)',
  button: '#23a8ff',
  primaryButton: '#23a8ff',
  secondaryButton: '#4eb4ae',
  disabledColor: tintColor + '40'
};

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  screenBody: {
    marginTop: 80, /* equal to header of tab navigator */
    //marginBottom: 50, /* equal to height of bottom tab navigator */
    /* don't add padding here because will cut off lists on the bottom (e.g. Settings screen) */
  },
  contentContainer: {
    paddingTop: 20,
  },
  selectedDateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 30
  },
  logoImage: {
    height: 60,
    width: 150,
    margin: 10,
    resizeMode: 'contain'
  },
  h1: {
    fontSize: 24,
    color: Colors.headingColor,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Fonts.heading
  },
  formRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    marginBottom: 0
  },
  formLabel: {
    fontSize: Fonts.defaultTextSize,
    color: Colors.tintColor,
    marginRight: 5,
    flex: 1
  },
  formItem: {
    flex: 2,
    flexDirection: 'row'
  },
  formDateText: {
    fontSize: Fonts.defaultTextSize,
    borderBottomColor: Colors.tintColor,
    borderBottomWidth: 1,
    color: Colors.tintColor,
    marginLeft: 30,
  },
  text: {
    color: Colors.tintColor,
    fontSize: Fonts.defaultTextSize,
    fontFamily: Fonts.default
  },
  textArea: {
    margin: 10,
    color: Colors.tintColor,
    fontFamily: Fonts.default
  },
  textAreaContainer: {
    backgroundColor: Colors.semiTransparentBG,
    borderRadius: 5,
    borderBottomWidth: 0
  },
  tabIconLabel: {
    fontFamily: Fonts.default
  },
  floatingButtonBar: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  historyRow: {
    flex: 1,
    flexDirection: 'row',
    padding: 10
  },
  highlight: {
    backgroundColor: Colors.hightlightBackground
  },
  highlightText: {
    color: Colors.hightlightText,
  },
  historyRowTitle: {
    fontSize: 16,
    marginLeft: 20,
    color: Colors.tintColor
  },
  historyRowSubtitle: {
    fontSize: Fonts.defaultTextSize,
    marginLeft: 20,
    color: '#aaa'
  },
  historyRowButtons: {
    alignItems: 'flex-end'
  },
  cardImage: {
    width: 140,
    height: 140
  },
  cardContainer: {
    /* for rounded corners need borderRadius and overflow hidden */
    borderRadius: 8,
    borderWidth: 0,
    overflow: 'hidden',
    backgroundColor: Colors.transparent
  },
  cardWrapper: {
    height: 140
  },
  cardTitle: {
    color: Colors.headingColor,
    fontWeight: '300',
    fontSize: 22,
    fontFamily: Fonts.default
  },
  wrappingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flex: 1
  },
  link: {
    color: Colors.button,
    fontSize: 18,
    fontWeight: '500',
    fontFamily: Fonts.default
  },
  widgetTitleContainer: {
    paddingLeft: 10,
    paddingBottom: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center' /* vertical align when flexDirection is set to row */
  },
  widgetTitle: {
    color: Colors.tintColor,
    fontSize: 20
  },
  widgetSubTitle: {
    color: Colors.tintColor + '90',
    fontSize: 14,
    marginLeft: 10
  },
  widgetButtonContainer: {
    zIndex: 1,
    position: 'absolute',
    right: 7,
    top: 9
  },
  widgetContainer: {
    width: Size.width - 20, /* subtract margins */
    backgroundColor: '#f0ad4e30',
    borderLeftColor: '#f0ad4e',
    margin: 10,
    marginBottom: 20,
    paddingTop: 10,
    paddingBottom: 30,
    borderLeftWidth: 4,
    borderRadius: 4,
  },
  ratingIconContainer: {
    alignContent: 'center', alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 50,
    width: 60,
    height: 60,
    padding: 10,
    borderWidth: 0,
  }
});

