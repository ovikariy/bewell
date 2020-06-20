import React, { Component } from 'react';
import { connect } from 'react-redux';
import { stateConstants, storeConstants } from '../modules/Constants';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { WidgetFactory } from '../modules/WidgetFactory';
import { ListWithRefresh } from '../components/MiscComponents';
import { groupBy, LanguageContext } from '../modules/helpers';
import { loadAllWidgetData } from '../redux/mainActionCreators';
import { Widget } from '../components/Widget';


const mapStateToProps = state => {
  return { [stateConstants.STORE]: state[stateConstants.STORE] };
};

const mapDispatchToProps = dispatch => ({
  loadAllWidgetData: () => dispatch(loadAllWidgetData())
});

class InsightsScreen extends Component {
  static contextType = LanguageContext;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.refreshItems();
  }

  refreshItems() {
    this.props.loadAllWidgetData();
  }

  getCountsByItemType() {
    //TODO: check for performance issues with bigger data set
    let groupedByItemType = new Map();
    const items = this.props[stateConstants.STORE].items;

    storeConstants.monthsFromEpochDate.forEach((monthKey) => {
      if (items[monthKey] && items[monthKey].length > 0) {
        groupBy(items[monthKey], item => item.type, groupedByItemType);
      }
    });

    return groupedByItemType;
  }
  render() {
    const language = this.context;

    const listItems = [];
    let groupedByItemType = this.getCountsByItemType();

    const widgetFactory = WidgetFactory(language);

    Object.keys(widgetFactory).forEach(itemType => {
      const widgetConfig = widgetFactory[itemType].config;
      const itemCount = groupedByItemType.get(itemType) ? groupedByItemType.get(itemType).length : '';
      listItems.push({
        id: itemType,
        title: widgetConfig.historyTitle ? widgetConfig.historyTitle : widgetConfig.widgetTitle,
        itemCount: itemCount,
        iconName: widgetConfig.addIcon.name,
        onPress: () => { this.props.navigation.navigate('ItemHistory', { 'itemType': itemType, 'title': (widgetConfig.historyTitle ? widgetConfig.historyTitle : widgetConfig.widgetTitle) }); }
      });
    });

    groupedByItemType = null;

    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} style={{ paddingVertical: 20 }}>
          <ListWithRefresh useFlatList={true} data={listItems} onPulldownRefresh={() => this.refreshItems()} />
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InsightsScreen);