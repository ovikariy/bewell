import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    screenBody: {
      marginTop: 80, /* equal to header of tab navigator */
      marginBottom: 50, /* equal to height of bottom tab navigator */
      /* don't add padding here because will cut off lists on the bottom (e.g. Settings screen) */
    },
    contentContainer: {
      paddingTop: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginTop: 50,
      marginBottom: 30
    },
    logoImage: {
      height: 70,
      resizeMode: 'contain'
    },
    h1: {
      fontSize: 24,
      color: '#aaaaaa',
      lineHeight: 24,
      textAlign: 'center',
      marginBottom: 20,
    },
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        marginRight: 5,
        flex: 1
    },
    formItem: {
        flex: 2
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#eeeeee',
      margin: 20,
      padding: 10
    },
    historyRow: {
      flex: 1,
      flexDirection: 'row',
      padding: 10
    },
    highlight: {
      backgroundColor: '#eee'
    },
    historyRowTitle: {
      fontSize: 16,
      marginLeft: 20
    },
    historyRowSubtitle: {
      fontSize: 14,
      marginLeft: 20,
      color: '#aaa'
    },
    historyRowButtons: {
      flex: 1,
      alignItems: 'flex-end'
    },    
    cardImage: {
      width: 130,
      height: 130
    },
    cardContainer: {
      /* for rounded corners need borderRadius and overflow hidden */
      borderRadius: 8,
      borderWidth: 0,
      overflow: 'hidden',
      backgroundColor: 'transparent'
    },
    cardWrapper: {
      height: 130
    },
    cardText: {
      color: '#ffffff',
      fontWeight: 'bold'
    },
    wrappingRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      flex: 1
    }
  });

  