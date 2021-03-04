import React, { Component, useState } from 'react';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { List } from '../components/MiscComponents';
import { AppContext } from '../modules/appContext';
import { AppNavigationProp, ItemBase, SettingType } from '../modules/types';
import { RootState } from '../redux/store';
import { connect, ConnectedProps } from 'react-redux';
import { load, updateReduxAndPersist } from '../redux/mainActionCreators';
import { StoreConstants } from '../modules/constants';
import { DefaultSettings } from '../modules/settingsFactory';

const mapStateToProps = (state: RootState) => ({
  STORE: state.STORE
});

const mapDispatchToProps = {
  load,
  updateReduxAndPersist
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
interface SettingsScreenProps extends PropsFromRedux {
  navigation: AppNavigationProp<'Settings'>
}

class SettingsScreen extends Component<SettingsScreenProps> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  constructor(props: SettingsScreenProps) {
    super(props);
    //this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'BackupRestore' }));
  }

  componentDidMount() {
    this.props.load(StoreConstants.SETTINGS);
  }

  onChange(updatedSetting: ItemBase) {
    /* settings are stored unencrypted because need theme, language etc before user logs in */
    this.props.updateReduxAndPersist(StoreConstants.SETTINGS, this.props.STORE.items, [updatedSetting]);
  }

  render() {
    const styles = this.context.styles;
    const settings = this.props.STORE.items ? this.props.STORE.items[StoreConstants.SETTINGS] : undefined;

    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} style={[styles.screenBodyContainerLargeMargin, { paddingHorizontal: 0 }]} >
          <SettingsComponent navigation={this.props.navigation} settings={settings} onChange={(updatedSetting: ItemBase) => this.onChange(updatedSetting)} />
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connector(SettingsScreen);

interface SettingsComponentProps {
  navigation: AppNavigationProp<'Settings'>
  settings?: SettingType[];
  onChange: (newValue: SettingType) => void;
}

export const SettingsComponent = (props: SettingsComponentProps) => {
  const context = React.useContext(AppContext);
  const language = context.language;
  const [selectedItemId, setSelectedItemId] = useState('');

  function onChange(id: string, newValue: string) {
    setSelectedItemId('');
    props.onChange({ id, date: new Date().toISOString(), dateCreated: new Date().toISOString(), value: newValue });
  }

  function onCancelChange() {
    setSelectedItemId('');
  }

  const items = [
    {
      id: 'lock',
      title: language.password,
      iconName: 'lock',
      onPress: () => { props.navigation.navigate('Password'); }
    },
    {
      id: 'SetupPIN',
      title: language.pinLock,
      iconName: 'lock',
      onPress: () => { props.navigation.navigate('SetupPIN'); }
    },
    {
      id: 'BackupRestore',
      title: language.importExport,
      iconName: 'retweet',
      onPress: () => { props.navigation.navigate('BackupRestore'); }
    }
  ];

  const userOverrides = props.settings ? props.settings : [];
  const defaultSettings = DefaultSettings(context);
  defaultSettings.forEach((defaultSetting) => {

    const userOverride = userOverrides.find((item) => item.id === defaultSetting.id);
    const value = userOverride ? userOverride.value : defaultSetting.value;
    const showPicker = selectedItemId === defaultSetting.id;

    items.push({
      id: defaultSetting.id,
      title: defaultSetting.title,
      subTitle: defaultSetting.subTitle,
      iconName: defaultSetting.iconName,
      onPress: defaultSetting.readOnly !== true ? () => setSelectedItemId(defaultSetting.id) : undefined,
      itemContent: defaultSetting.itemContent ?
        defaultSetting.itemContent(value, (newValue) => { onChange(defaultSetting.id, newValue); }, () => onCancelChange(), showPicker)
        : null
    });
  });

  return (
    <List data={items} />
  );
};