import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { load, removeFromReduxAndPersist, updateReduxAndPersist } from '../redux/mainActionCreators';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { AppContext } from '../modules/appContext';
import { RootState } from '../redux/store';
import { AppNavigationProp, AppRouteProp, ItemBase, ItemBaseAssociativeArray, SettingsAssociativeArray, SettingType, WidgetBaseFields } from '../modules/types';
import { ReorderableList, InputWithButton, Toast, ParagraphText, ButtonPrimary, ButtonSecondary } from '../components/MiscComponents';
import { EncryptedSettingsEnum, settingsLists, StoreConstants } from '../modules/constants';
import { sizes } from '../assets/styles/style';
import { CreateWidgetFactory, WidgetFactory } from '../modules/widgetFactory';
import { getSettingValueFromStoreItems } from '../modules/utils';

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

interface CustomizeWidgetsScreenProps extends PropsFromRedux {
  navigation: AppNavigationProp<'CustomizeWidgets'>
  route: AppRouteProp<'CustomizeWidgets'>
}

class CustomizeWidgetsScreen extends Component<CustomizeWidgetsScreenProps, any> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  componentDidMount() {
    this.props.load(StoreConstants.SETTINGSENCRYPTED);
  }

  onListReordered(newData: any[]) {
    this.persist(this.getValueFromListItems(newData));
  }

  resetToDefaults() {
    const widgetFactory = CreateWidgetFactory(this.context);
    const defaultWidgetOrder = this.getDefaultWidgetOrder(widgetFactory);
    this.persist(defaultWidgetOrder);
  }

  persist(value: any[]) {
    const date = new Date().toISOString();
    const updatedSetting = { id: EncryptedSettingsEnum.WidgetOrder, date, dateCreated: date, value };
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
          <ParagraphText style={[styles.bodyTextLarge, { margin: sizes[20] }]}>{language.widgetOrderInstructions}</ParagraphText>
          <ReorderableList style={{ flex: 1 }} data={listItems}
            onListReordered={(newData) => this.onListReordered(newData)}
            ListFooterComponent={<ButtonSecondary containerStyle={{ marginTop: sizes[20] }}
              title={language.resetToDefaults}
              containerStyle={{ width: 'auto', margin: sizes[20] }}
              onPress={() => this.resetToDefaults()}
            />} />
        </ScreenContent>
      </ScreenBackground>
    );
  }

  private getListItems() {
    const widgetFactory = CreateWidgetFactory(this.context);
    const defaultWidgetOrder = this.getDefaultWidgetOrder(widgetFactory);
    const dataWithUserOverrides = this.getSettingValue(); /** user overrides */
    const data: any = dataWithUserOverrides ? dataWithUserOverrides : defaultWidgetOrder;

    const listItems: any[] = [];
    data.forEach((item: string) => {
      listItems.push({
        id: item, title: widgetFactory[item].config.widgetTitle, value: item,
        iconName: widgetFactory[item].config.addIcon.name, iconType: widgetFactory[item].config.addIcon.type
      });
    });
    return listItems;
  }

  private getDefaultWidgetOrder(widgetFactory: WidgetFactory) {
    return Object.keys(widgetFactory).map((item, index) => {
      return item;
    });
  }

  private getSettingValue() {
    if (this.props.STORE && this.props.STORE.items)
      return getSettingValueFromStoreItems(this.props.STORE.items[StoreConstants.SETTINGSENCRYPTED], EncryptedSettingsEnum.WidgetOrder);
    return null;
  }
}

export default connector(CustomizeWidgetsScreen);


