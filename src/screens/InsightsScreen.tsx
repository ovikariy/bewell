import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { stateConstants, StoreConstants } from '../modules/Constants';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { CreateWidgetFactory, WidgetBase } from '../modules/WidgetFactory';
import { ListWithRefresh } from '../components/MiscComponents';
import { groupBy } from '../modules/helpers';
import { loadAllWidgetData } from '../redux/mainActionCreators';
import { AppContext } from '../modules/AppContext';
import { RootState } from '../redux/configureStore';

const mapStateToProps = (state: RootState) => ({
  STORE: state.STORE
});

const mapDispatchToProps = {
  loadAllWidgetData
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;


interface InsightsScreenProps {
  navigation: any;
}

class InsightsScreen extends Component<PropsFromRedux & InsightsScreenProps> {
  static contextType = AppContext;
  declare context: React.ContextType<typeof AppContext>;

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
        <ScreenContent isKeyboardAvoidingView={true} style={{ paddingVertical: 20 }}>
          <ListWithRefresh useFlatList={true} data={listItems} onPulldownRefresh={() => this.refreshItems()} />
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connector(InsightsScreen);