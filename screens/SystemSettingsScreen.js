import React from 'react';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import { List } from '../components/MiscComponents';
import { DefaultSettings } from '../modules/SettingsFactory';
import { stateConstants, storeConstants } from '../modules/Constants';
import { load, persistRedux, updateRedux } from '../redux/mainActionCreators';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { AppContext } from '../modules/AppContext';

const mapStateToProps = state => {
  return { [stateConstants.STORE]: state[stateConstants.STORE] };
};

const mapDispatchToProps = dispatch => ({
  load: (key) => dispatch(load(key)),
  updateRedux: (key, items) => dispatch(updateRedux(key, items)),
  persistRedux: (items, dirtyKeys) => dispatch(persistRedux(items, dirtyKeys))
});

class SystemSettingsScreen extends React.Component {

  componentDidMount() {
    this.props.load(storeConstants.SETTINGS);
  }

  onChange(updatedSetting) {
    /* settings are stored unencrypted because need theme, language etc before user logs in */
    this.props.updateRedux(storeConstants.SETTINGS, [updatedSetting]);
    this.persistAfterDelay();
  }

  persistAfterDelay = debounce(function () {
    this.persist();
  }, 6000);

  persist = () => {
    const state = this.props[stateConstants.STORE];
    if (!state.dirtyKeys || !(Object.keys(state.dirtyKeys).length > 0))
      return;
    this.props.persistRedux(state.items, state.dirtyKeys);
  }

  render() {
    const settings = this.props[stateConstants.STORE].items ? this.props[stateConstants.STORE].items[storeConstants.SETTINGS] : null;
    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} style={{ paddingVertical: 20 }} >
          <SystemSettings
            settings={settings}
            navigation={this.props.navigation}
            onChange={(updatedSetting) => this.onChange(updatedSetting)}
          />
        </ScreenContent>
      </ScreenBackground>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SystemSettingsScreen)

class SystemSettings extends React.Component {
  static contextType = AppContext;

  onChange(id, newValue) {
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