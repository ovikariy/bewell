import React, { Component } from 'react';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { List } from '../components/MiscComponents';
import { AppContext } from '../modules/AppContext';

interface SettingsScreenProps {
  navigation: any
}

export default class SettingsScreen extends Component<SettingsScreenProps> {
  constructor(props: SettingsScreenProps) {
    super(props);
    //this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'BackupRestore' }));
  }

  render() {
    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} style={{ paddingVertical: 20 }} >
          <SettingsComponent navigation={this.props.navigation} />
        </ScreenContent>
      </ScreenBackground>
    )
  }
}

interface SettingsComponentProps {
  navigation: any
}
class SettingsComponent extends Component<SettingsComponentProps> {
  static contextType = AppContext;
  declare context: React.ContextType<typeof AppContext>;

  render() {
    const language = this.context.language;
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