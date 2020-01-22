import React, { Component } from 'react';
import { connect } from 'react-redux';
import { text, stateConstants, storeConstants } from '../modules/Constants';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { WidgetFactory } from '../modules/WidgetFactory';
import { List } from '../components/MiscComponents';
import { groupBy } from '../modules/helpers';
import { loadAllWidgetData } from '../redux/mainActionCreators';


const mapStateToProps = state => {
  return { [stateConstants.OPERATION]: state[stateConstants.OPERATION] };
};

const mapDispatchToProps = dispatch => ({
  loadAllWidgetData: () => dispatch(loadAllWidgetData())
});

class InsightsScreen extends Component {
  static navigationOptions = {
    title: text.insightsScreen.title
  };

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
    const store = this.props[stateConstants.OPERATION].store;

    storeConstants.monthsFromEpochDate.forEach((monthKey) => {
      if (store[monthKey] && store[monthKey].length > 0) { 
        groupBy(store[monthKey], item => item.type, groupedByItemType);
      }
    });

    return groupedByItemType;
  }
  render() {
    const listItems = [];
    let groupedByItemType = this.getCountsByItemType();

    Object.keys(WidgetFactory).forEach(itemType => {
      const widgetConfig = WidgetFactory[itemType].config;
      const itemCount = groupedByItemType.get(itemType) ? groupedByItemType.get(itemType).length : '';
      listItems.push({
        id: itemType,
        title: widgetConfig.widgetTitle,
        itemCount: itemCount,
        iconName: widgetConfig.addIcon.name,
        onPress: () => { this.props.navigation.navigate('ItemHistory', { 'itemType': itemType }); }
      })
    });

    groupedByItemType = null;

    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} style={{ paddingVertical: 20 }} onPulldownRefresh={() => this.refreshItems()} >
          <List data={listItems} />
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InsightsScreen);