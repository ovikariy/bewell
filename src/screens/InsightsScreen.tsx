import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { EncryptedSettingsEnum, StoreConstants } from '../modules/constants';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { CreateWidgetFactory } from '../modules/widgetFactory';
import { ListWithRefresh } from '../components/MiscComponents';
import { getSettingValueFromStoreItems, groupBy } from '../modules/utils';
import { loadAllWidgetData } from '../redux/mainActionCreators';
import { AppContext } from '../modules/appContext';
import { RootState } from '../redux/store';
import { AppNavigationProp, ItemBaseAssociativeArray, WidgetBase } from '../modules/types';
import { getItemGroupsByItemType, isValidMonthYearPattern } from '../modules/storage';

const mapStateToProps = (state: RootState) => ({
  STORE: state.STORE
});

const mapDispatchToProps = {
  loadAllWidgetData
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;


interface InsightsScreenProps extends PropsFromRedux {
  navigation: AppNavigationProp<'Insights'>
}

class InsightsScreen extends Component<InsightsScreenProps> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  componentDidMount() {
    this.refreshItems();
  }

  refreshItems() {
    this.props.loadAllWidgetData();
  }

  render() {
    const styles = this.context.styles;

    const listItems: any = [];
    const groupedByItemType = getItemGroupsByItemType(this.props.STORE.items);

    const widgetFactory = CreateWidgetFactory(this.context);
    const customOrderedWidgetsTypes = getSettingValueFromStoreItems(this.props.STORE.items[StoreConstants.SETTINGSENCRYPTED], EncryptedSettingsEnum.WidgetOrder) || [];
    Object.values(widgetFactory).forEach((item, index) => {
      /** merge with item types that may not be saved in the settings yet, i.e. when new widget types are added after the user saved the setting */
      if (customOrderedWidgetsTypes.indexOf(item.config.itemTypeName) < 0)
        customOrderedWidgetsTypes.push(item.config.itemTypeName);
    });
    customOrderedWidgetsTypes.forEach((itemType: string) => {
      const widgetConfig = widgetFactory[itemType].config;
      const itemCount = groupedByItemType.get(itemType) ? groupedByItemType.get(itemType).length : '';
      listItems.push({
        id: itemType,
        title: widgetConfig.historyTitle ? widgetConfig.historyTitle : widgetConfig.widgetTitle,
        itemCount,
        iconName: widgetConfig.addIcon.name,
        iconType: widgetConfig.addIcon.type,
        onPress: () => { this.props.navigation.navigate('ItemHistory', { itemType, title: (widgetConfig.historyTitle ? widgetConfig.historyTitle : widgetConfig.widgetTitle) }); }
      });
    });

    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} style={[styles.screenBodyContainerLargeMargin, { paddingHorizontal: 0 }]}>
          <ListWithRefresh useFlatList={true} data={listItems} onPulldownRefresh={() => this.refreshItems()} />
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connector(InsightsScreen);