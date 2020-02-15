import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import { text, stateConstants, storeConstants } from '../modules/Constants';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { WidgetFactory } from '../modules/WidgetFactory';
import { ListWithRefresh } from '../components/MiscComponents';
import { groupBy } from '../modules/helpers';
import { loadAllWidgetData } from '../redux/mainActionCreators';


const mapStateToProps = state => {
  return { [stateConstants.OPERATION]: state[stateConstants.OPERATION] };
};

const mapDispatchToProps = dispatch => ({
  loadAllWidgetData: () => dispatch(loadAllWidgetData())
});
 
class InsightsScreen extends Component {
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