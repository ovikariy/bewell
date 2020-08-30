import React, { Component } from 'react';
import { debounce } from 'lodash';
import { connect, ConnectedProps } from 'react-redux';
import { List } from '../components/MiscComponents';
import { DefaultSettings } from '../modules/SettingsFactory';
import { stateConstants, storeConstants } from '../modules/Constants';
import { load, persistRedux, updateRedux } from '../redux/mainActionCreators';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { AppContext } from '../modules/AppContext';
import { RootState } from '../redux/configureStore';
import { ItemBase, ItemBaseAssociativeArray, SettingType } from '../modules/types';

const mapStateToProps = (state: RootState) => ({
  STORE: state.STORE
})

const mapDispatchToProps = {
  load: (key: string) => load(key),
  updateRedux: (key: string, items: ItemBase[]) => updateRedux(key, items),
  persistRedux: (items: ItemBaseAssociativeArray, dirtyKeys: { [key: string]: string }) => persistRedux(items, dirtyKeys)
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface SystemSettingsScreenProps {
  navigation: any;
}

class SystemSettingsScreen extends Component<PropsFromRedux & SystemSettingsScreenProps> {

  componentDidMount() {
    this.props.load(storeConstants.SETTINGS);
  }

  onChange(updatedSetting: ItemBase) {
    /* settings are stored unencrypted because need theme, language etc before user logs in */
    this.props.updateRedux(storeConstants.SETTINGS, [updatedSetting]);
    this.persistAfterDelay();
  }

  persistAfterDelay = debounce(() => {
    this.persist();
  }, 6000, {});

  persist = () => {
    const state = this.props.STORE;
    if (!state.dirtyKeys || !(Object.keys(state.dirtyKeys).length > 0))
      return;
    this.props.persistRedux(state.items, state.dirtyKeys);
  }

  render() {
    const settings = this.props.STORE.items ? this.props.STORE.items[storeConstants.SETTINGS] : undefined;
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
    )
  }
}

export default connector(SystemSettingsScreen);

interface SystemSettingsComponentProps {
  navigation: any;
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
          defaultSetting.itemContent(value, (newValue) => { this.onChange(defaultSetting.id, newValue) })
          : null
      }
    });

    return (
      <List data={listItems} />
    );
  }

};