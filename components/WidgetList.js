import React from 'react';
import { ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Widget from '../components/Widget';
import { widgetConfig } from '../constants/Lists';

class WidgetList extends React.Component {

  onChange(itemTypeName, newWidgetDailyData) {
    this.props.onChange({ ...this.props.dailyData, [itemTypeName]: newWidgetDailyData });
  }

  render() {

    const widgets = [];
    let index = 0;
    for (var itemTypeName in widgetConfig) {
      widgets.push(
        <Widget key={index}
          itemTypeName={itemTypeName}
          dailyData={this.props.dailyData[itemTypeName]}
          selectedDate={this.props.selectedDate}
          navigation={this.props.navigation}
          onChange={(itemTypeName, newWidgetDailyData) => this.onChange(itemTypeName, newWidgetDailyData)} />
      )
      index++;
    }

    return (
      <ScrollView>
        <Animatable.View animation="fadeInUp" duration={500}>
          {widgets}
        </Animatable.View>
      </ScrollView >
    );
  }

}
export default WidgetList;