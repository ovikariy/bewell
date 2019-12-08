import React from 'react';
import { TouchableOpacity, SectionList, Image, StyleSheet, Text, View, Button } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Constants from 'expo-constants';
import { text } from '../modules/Constants';
import { styles } from '../assets/styles/style';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { ParagraphText, List } from '../components/MiscComponents';
import { Icon } from 'react-native-elements';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: text.settingsScreen.title
  };

  constructor(props) {
    super(props);
    //this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'BackupRestore' }));
  }

  render() {
    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent isKeyboardAvoidingView={true}  style={{ paddingVertical: 20 }} >
          <Settings navigation={this.props.navigation} />
        </ScreenContent>
      </ScreenBackground>
    )
  }
}

class Settings extends React.Component {
  render() {
    const items = [
      {
        id: 'lock',
        text: text.settingsScreen.setPassword,
        iconName: 'lock',
        onPress: () => { this.props.navigation.navigate('Password') }
      },
      {
        id: 'BackupRestore',
        text: text.settingsScreen.importExport,
        iconName: 'retweet',
        onPress: () => { this.props.navigation.navigate('BackupRestore') }
      }, 
      {
        id: 'version',
        text: text.settingsScreen.version,
        subText: Constants.manifest.version,
        iconName: 'info-circle'
      }      
    ];

    return (
      <List data={items} />
    );
  }
};