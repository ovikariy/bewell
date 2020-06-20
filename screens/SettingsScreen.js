import React from 'react';
import Constants from 'expo-constants';
import { text } from '../modules/Constants';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { List } from '../components/MiscComponents';
import { LanguageContext } from '../modules/helpers';

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
  static contextType = LanguageContext;

  render() {
    const language = this.context;
    const items = [
      {
        id: 'lock',
        title: language.password,
        iconName: 'lock',
        onPress: () => { this.props.navigation.navigate('Password') }
      },
      {
        id: 'SetupPINScreen',
        title: language.pinLock,
        iconName: 'lock',
        onPress: () => { this.props.navigation.navigate('SetupPINScreen') }
      },
      {
        id: 'BackupRestore',
        title: language.importExport,
        iconName: 'retweet',
        onPress: () => { this.props.navigation.navigate('BackupRestore') }
      },
      {
        id: 'System',
        title: language.system,
        subTitle: language.systemSubtitle,
        iconName: 'info',
        onPress: () => { this.props.navigation.navigate('SystemSettings') }
      }
    ];

    return (
      <List data={items} />
    );
  }
};