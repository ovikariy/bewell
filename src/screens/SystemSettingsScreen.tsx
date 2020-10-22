import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { List } from '../components/MiscComponents';
import { DefaultSettings } from '../modules/settingsFactory';
import { StoreConstants } from '../modules/constants';
import { load, updateReduxAndPersist } from '../redux/mainActionCreators';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { AppContext } from '../modules/appContext';
import { RootState } from '../redux/configureStore';
import { ItemBase, ItemBaseAssociativeArray, AppNavigationProp, SettingType } from '../modules/types';

const mapStateToProps = (state: RootState) => ({
  STORE: state.STORE
});

const mapDispatchToProps = {
  load,
  updateReduxAndPersist
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface SystemSettingsScreenProps extends PropsFromRedux {
  navigation: AppNavigationProp<'SystemSettings'>
}

class SystemSettingsScreen extends Component<SystemSettingsScreenProps> {

  componentDidMount() {
    this.props.load(StoreConstants.SETTINGS);
  }

  onChange(updatedSetting: ItemBase) {
    /* settings are stored unencrypted because need theme, language etc before user logs in */
    this.props.updateReduxAndPersist(StoreConstants.SETTINGS, this.props.STORE.items, [updatedSetting]);
  }

  render() {
    const settings = this.props.STORE.items ? this.props.STORE.items[StoreConstants.SETTINGS] : undefined;
    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} style={{ paddingVertical: 20 }} >
          <SystemSettingsComponent
            settings={settings}
            navigation={this.props.navigation}
            onChange={(updatedSetting: ItemBase) => this.onChange(updatedSetting)}
          />
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connector(SystemSettingsScreen);

interface SystemSettingsComponentProps {
  navigation: AppNavigationProp<'SystemSettings'>
  settings?: SettingType[];
  onChange: (newValue: SettingType) => void;
}

class SystemSettingsComponent extends Component<SystemSettingsComponentProps> {
  static contextType = AppContext;
  declare context: React.ContextType<typeof AppContext>;

  onChange(id: string, newValue: string) {
    this.props.onChange({ id, date: new Date().toISOString(), value: newValue });
  }

  render() {
    const userOverrides = this.props.settings ? this.props.settings : [];

    const defaultSettings = DefaultSettings(this.context);

    const listItems = defaultSettings.map((defaultSetting) => {

      const userOverride = userOverrides.find((item) => item.id === defaultSetting.id);
      const value = userOverride ? userOverride.value : defaultSetting.value;

      return {
        id: defaultSetting.id,
        title: defaultSetting.title,
        subTitle: defaultSetting.subTitle,
        iconName: defaultSetting.iconName,
        itemContent: defaultSetting.itemContent ?
          defaultSetting.itemContent(value, (newValue) => { this.onChange(defaultSetting.id, newValue); })
          : null
      };
    });

    return (
      <List data={listItems} />
    );
  }

};