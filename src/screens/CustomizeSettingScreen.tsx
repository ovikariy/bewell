import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { load, removeFromReduxAndPersist, updateReduxAndPersist } from '../redux/mainActionCreators';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { AppContext } from '../modules/appContext';
import { RootState } from '../redux/store';
import { AppNavigationProp, AppRouteProp, ItemBase, SettingsAssociativeArray, SettingType, WidgetBaseFields } from '../modules/types';
import { ReorderableList, InputWithButton, Toast, ParagraphText, ButtonPrimary, ButtonSecondary } from '../components/MiscComponents';
import { settingsLists, StoreConstants } from '../modules/constants';
import { sizes } from '../assets/styles/style';

const mapStateToProps = (state: RootState) => ({
  STORE: state.STORE
});

const mapDispatchToProps = {
  load,
  removeFromReduxAndPersist,
  updateReduxAndPersist
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface CustomizeSettingScreenProps extends PropsFromRedux {
  navigation: AppNavigationProp<'CustomizeSetting'>
  route: AppRouteProp<'CustomizeSetting'>
}

class CustomizeSettingScreen extends Component<CustomizeSettingScreenProps, any> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  static getNavigationOptions = ({ route, navigation }: any) => {
    return ({
      title: route.params.title
    });
  };

  id: string;

  constructor(props: CustomizeSettingScreenProps) {
    super(props);
    this.id = props.route.params.id;
    this.state = {
      customItemText: ''
    };
  }

  componentDidMount() {
    this.props.load(StoreConstants.SETTINGSENCRYPTED);
  }

  onListReordered(newData: any[]) {
    this.persist(this.getValueFromListItems(newData));
  }

  addCustomItem() {
    const language = this.context.language;

    if (!this.state.customItemText)
      return;

    const dataWithUserOverrides = this.getSettingValue(); /** user overrides */
    const data: any[] = dataWithUserOverrides ? dataWithUserOverrides : settingsLists[this.id]; /** default list */
    if (data.indexOf(this.state.customItemText) >= 0) {
      Toast.show(language.itemAlreadyInTheList);
      return;
    }

    const newData = [this.state.customItemText].concat(data);
    this.persist(newData);
    this.setState({ ...this.state, customItemText: '' });
  }

  resetToDefaults() {
    this.persist(settingsLists[this.id]);
  }

  persist(value: any[]) {
    const date = new Date().toISOString();
    const updatedSetting = { id: this.id, date, dateCreated: date, value };
    this.props.updateReduxAndPersist(StoreConstants.SETTINGSENCRYPTED, this.props.STORE.items, [updatedSetting]);
  }

  getValueFromListItems(newData: any[]) {
    const data: any[] = [];
    newData.forEach((item) => {
      data.push(item.value);
    });
    return data;
  }

  render() {
    const styles = this.context.styles;
    const language = this.context.language;

    const listItems: any[] = this.getListItems();

    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} style={[styles.screenBodyContainerMediumMargin, { paddingHorizontal: 0 }]}>
          <ParagraphText style={[styles.bodyTextLarge, { margin: sizes[20] }]}>{language.customItemsInstructions}</ParagraphText>
          <InputWithButton containerStyle={{ marginBottom: sizes[30], marginHorizontal: sizes[20], width: 'auto' }}
            placeholder={language.customItemText} value={this.state.customItemText}
            onChangeText={(customItemText) => this.setState({ ...this.state, customItemText })}
            onPress={() => this.addCustomItem()}
          />
          <ReorderableList ListFooterComponent={<ButtonSecondary containerStyle={{ marginTop: sizes[20] }}
            title={language.resetToDefaults}
            containerStyle={{ width: 'auto', margin: sizes[20] }}
            onPress={() => this.resetToDefaults()}
          />} style={{ flex: 1 }} data={listItems} onListReordered={(newData) => this.onListReordered(newData)} />

        </ScreenContent>
      </ScreenBackground>
    );
  }

  private getListItems() {
    const language = this.context.language;

    const dataWithUserOverrides = this.getSettingValue(); /** user overrides */
    const data: any = dataWithUserOverrides ? dataWithUserOverrides : settingsLists[this.id]; /** default list */

    const listItems: any[] = [];
    data.forEach((item: string) => {
      listItems.push({ id: item, title: language[item] || item, value: item });
    });
    return listItems;
  }

  private getSettingValue() {
    if (this.props.STORE && this.props.STORE.items) {
      const encryptedSettings = this.props.STORE.items[StoreConstants.SETTINGSENCRYPTED];
      if (encryptedSettings && encryptedSettings.length > 0) {
        const setting = encryptedSettings.find(setting => setting[WidgetBaseFields.id] === this.id) as SettingType;
        if (setting)
          return setting.value; /** override with user customization */
      }
    }
    return null;
  }
}

export default connector(CustomizeSettingScreen);


