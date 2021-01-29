import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { stateConstants, StoreConstants } from '../modules/constants';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { CreateWidgetFactory, WidgetBase } from '../modules/widgetFactory';
import { ListWithRefresh } from '../components/MiscComponents';
import { groupBy } from '../modules/utils';
import { loadAllWidgetData } from '../redux/mainActionCreators';
import { AppContext } from '../modules/appContext';
import { RootState } from '../redux/store';
import { AppNavigationProp } from '../modules/types';

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

  getCountsByItemType() {
    //TODO: check for performance issues with bigger data set
    const groupedByItemType = new Map();
    const items = this.props.STORE.items;

    StoreConstants.monthsFromEpochDate.forEach((monthKey) => {
      if (items[monthKey] && items[monthKey].length > 0)
        groupBy(items[monthKey], (item: WidgetBase) => item.type, groupedByItemType);

    });

    return groupedByItemType;
  }
  render() {
    const styles = this.context.styles;

    const listItems: any = [];
    const groupedByItemType = this.getCountsByItemType();

    const widgetFactory = CreateWidgetFactory(this.context);

    Object.keys(widgetFactory).forEach(itemType => {
      const widgetConfig = widgetFactory[itemType].config;
      const itemCount = groupedByItemType.get(itemType) ? groupedByItemType.get(itemType).length : '';
      listItems.push({
        id: itemType,
        title: widgetConfig.historyTitle ? widgetConfig.historyTitle : widgetConfig.widgetTitle,
        itemCount,
        iconName: widgetConfig.addIcon.name,
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