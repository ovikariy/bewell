import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styles, Colors, Size } from '../assets/styles/style';
import { WidgetHeader } from '../components/FormFields';
import { widgetConfig } from '../constants/Lists';
import { ItemTypes } from '../constants/Constants';
import { MoodComponent } from '../components/MoodComponent';
import { SleepComponent } from '../components/SleepComponent';
import { GratitudeComponent } from '../components/GratitudeComponent';
import { NoteComponent } from '../components/NoteComponent';
import { DreamComponent } from '../components/DreamComponent';
import { WidgetButtons } from '../components/FormFields';
import * as Animatable from 'react-native-animatable';

class Widget extends React.Component {

  constructor(props) {
    super(props);

    this.widgetComponents = {
      [ItemTypes.MOOD]: MoodComponent,
      [ItemTypes.SLEEP]: SleepComponent,
      [ItemTypes.GRATITUDE]: GratitudeComponent,
      [ItemTypes.DREAM]: DreamComponent,
      [ItemTypes.NOTE]: NoteComponent
    };
  }

  onTitlePress() {
    this.props.navigation.navigate(widgetConfig[this.props.itemTypeName].historyScreenName);
  }

  render() {
    const config = widgetConfig[this.props.itemTypeName];
    const canAddNewItem = config.multiItem; /* TODO: hide button when cannot use */
    const childWidgets = this.renderChildWidgets();

    return (
      <View>
        <WidgetButtons
          onAddPress={() => { this.addEmptyRecord() }}
          canAddNewItem={canAddNewItem} />
        <Animatable.View animation="zoomInUp">
          <ScrollView horizontal
            pagingEnabled
            showsHorizontalScrollIndicator
            style={{ width: Size.width }}
            ref={ref => this.scrollView = ref}
            onContentSizeChange={(contentWidth, contentHeight) => {
              /* scroll to end as new items are added */
              this.scrollView.scrollToEnd({ animated: true, duration: 1000 });
            }}>
            {childWidgets}
          </ScrollView>
        </Animatable.View>
      </View>
    )
  }


  renderChildWidgets() {
    const childWidgets = [];

    const config = widgetConfig[this.props.itemTypeName];
    const dailyData = this.props.dailyData;

    if (dailyData && dailyData.length > 0) {
      dailyData.map((data, index) => {
        childWidgets.push(this.renderChildWidget(index, config, data));
      })
    }
    else {
      childWidgets.push(this.renderChildWidget(0, config, this.getEmptyRecord()));
    }

    return childWidgets;
  }

  renderChildWidget(index, widgetConfig, dailyData) {
    const subTitle = (this.props.dailyData.length > 1) ? ' (' + (index + 1) + ' of ' + this.props.dailyData.length + ') ' : '';
    return (
      <View key={index}
        style={[styles.widgetContainer, { backgroundColor: widgetConfig.color + '10', borderColor: widgetConfig.color }]}>
        <WidgetHeader
          title={widgetConfig.itemTypeName}
          subTitle={subTitle}
          onPress={() => this.onTitlePress()}
        />
        {
          React.createElement(this.widgetComponents[widgetConfig.itemTypeName], {
            value: dailyData,
            selectedDate: this.props.selectedDate,
            onChange: (newValue) => {
              this.itemChanged(widgetConfig.itemTypeName, newValue);
            }
          })}
      </View>
    );
  }

  addEmptyRecord() {
    /* a blank record will append an empty child widget during rerender */
    this.itemChanged(this.props.itemTypeName, this.getEmptyRecord());
  }

  getEmptyRecord() {
    /* blank record should at least have an ID, TODO: maybe use GUID instead of ticks */
    return { id: new Date().getTime() };
  }

  itemChanged(itemTypeName, newValue) {
    /* if editing existing item, keep the existing date but use current time */
    const dateString = newValue.date ? newValue.date : this.props.selectedDate;
    const date = new Date(dateString);
    const now = new Date();
    date.setHours(now.getHours());
    date.setMinutes(now.getMinutes());
    date.setMilliseconds(now.getMilliseconds());

    newValue.date = date.toISOString();

    const newDailyData = this.updateDataImmutable(this.props.dailyData, newValue);
    this.props.onChange(itemTypeName, newDailyData);
  }

  updateDataImmutable(array, newValue) {
    if (!array)
      return [newValue];
    /* without mutating the array, update an item in it if found by id or add */
    const index = array.findIndex(item => item.id === newValue.id);
    if (index < 0)
      return [...array, newValue];

    array = [...array];
    array[index] = newValue;
    return array;
  }

}

export default Widget;