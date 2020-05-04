import React from 'react';
import Constants from 'expo-constants';
import { text } from '../modules/Constants';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { List } from '../components/MiscComponents';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    //this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'BackupRestore' }));
  }

  render() {
    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} style={{ paddingVertical: 20 }} >
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
        title: text.settingsScreen.setPassword,
        iconName: 'lock',
        onPress: () => { this.props.navigation.navigate('Password') }
      },
      {
        id: 'SetupPINScreen',
        title: text.settingsScreen.setPIN,
        iconName: 'lock',
        onPress: () => { this.props.navigation.navigate('SetupPINScreen') }
      },
      {
        id: 'BackupRestore',
        title: text.settingsScreen.importExport,
        iconName: 'retweet',
        onPress: () => { this.props.navigation.navigate('BackupRestore') }
      },
      {
        id: 'version',
        title: text.settingsScreen.version,
        subTitle: Constants.manifest.version,
        iconName: 'info-circle'
      }
    ];

    return (
      <List data={items} />
    );
  }
};