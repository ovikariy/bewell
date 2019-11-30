import React, { Component } from 'react';
import { View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { styles, colors } from '../assets/styles/style';
import { ItemTypes, widgetConfig } from '../modules/Constants';
import { ParagraphText } from './MiscComponents';
import { friendlyTime } from '../modules/helpers';
import { MoodComponent } from '../components/MoodComponent';
import { SleepComponent } from '../components/SleepComponent';
import NoteComponent from '../components/NoteComponent';

class Widget extends React.Component {

  constructor(props) {
    super(props);

    this.widgetComponents = {
      [ItemTypes.MOOD]: MoodComponent,
      [ItemTypes.SLEEP]: SleepComponent,
      [ItemTypes.NOTE]: NoteComponent
    };
  }

  onTitlePress() {
    this.props.navigation.navigate(widgetConfig[this.props.value.type].historyScreenName);
  }

  renderWidget() {
    const config = widgetConfig[this.props.value.type];
    const subTitle = friendlyTime(this.props.value.date);
    return (
      <TouchableHighlight onPress={() => this.props.onSelected ? this.props.onSelected() : undefined}>
        <View key={this.props.value.date}
          style={[styles.widgetContainer, config.style]}>
          <WidgetHeader
            title={config.itemTypeName}
            // subTitle={subTitle}
            onPress={() => this.onTitlePress()}
          />
          {
            React.createElement(this.widgetComponents[config.itemTypeName], {
              value: this.props.value,
              selectedDate: this.props.selectedDate,
              onChange: (newValue) => {
                this.props.onChange(newValue);
              }
            })}
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View>
        {this.renderWidget()}
      </View>
    )
  }
}

export const WidgetHeader = (props) => {
  return (
    <View style={[styles.widgetTitleContainer]}>
      <TouchableOpacity onPress={() => props.onPress ? props.onPress() : undefined}>
        <ParagraphText style={[styles.widgetTitle]}>{props.title}</ParagraphText>
      </TouchableOpacity>
      {props.subTitle ?
        <ParagraphText style={[styles.widgetSubTitle]}>{props.subTitle}</ParagraphText> : <View />}
      {props.children}
    </View>
  )
};

export default Widget;