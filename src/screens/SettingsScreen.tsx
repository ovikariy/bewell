import React, { Component } from 'react';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { List } from '../components/MiscComponents';
import { AppContext } from '../modules/appContext';
import { AppNavigationProp } from '../modules/types';

interface SettingsScreenProps {
  navigation: AppNavigationProp<'Settings'>
}

export default class SettingsScreen extends Component<SettingsScreenProps> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  constructor(props: SettingsScreenProps) {
    super(props);
    //this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'BackupRestore' }));
  }

  render() {
    const styles = this.context.styles;

    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} style={[styles.screenBodyContainerLargeMargin, { paddingHorizontal: 0 }]} >
          <SettingsComponent navigation={this.props.navigation} />
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

interface SettingsComponentProps {
  navigation: AppNavigationProp<'Settings'>
}

class SettingsComponent extends Component<SettingsComponentProps> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  render() {
    const language = this.context.language;
    const items = [
      {
        id: 'lock',
        title: language.password,
        iconName: 'lock',
        onPress: () => { this.props.navigation.navigate('Password'); }
      },
      {
        id: 'SetupPIN',
        title: language.pinLock,
        iconName: 'lock',
        onPress: () => { this.props.navigation.navigate('SetupPIN'); }
      },
      {
        id: 'BackupRestore',
        title: language.importExport,
        iconName: 'retweet',
        onPress: () => { this.props.navigation.navigate('BackupRestore'); }
      },
      {
        id: 'System',
        title: language.system,
        subTitle: language.systemSubtitle,
        iconName: 'info',
        onPress: () => { this.props.navigation.navigate('SystemSettings'); }
      }
    ];

    return (
      <List data={items} />
    );
  }
};