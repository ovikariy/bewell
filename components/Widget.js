import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { WidgetFactory } from '../modules/WidgetFactory';
import { ParagraphText } from './MiscComponents';
import { friendlyTime } from '../modules/helpers';
import { AppContext } from '../modules/AppContext';

const WidgetHeader = (props) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  return (
    <View style={[styles.widgetTitleContainer]}>
      {props.title ?
        <ParagraphText style={[styles.widgetTitle]}>{props.title}</ParagraphText> : <View />}
      {props.subTitle ?
        <ParagraphText style={[styles.widgetSubTitle]}>{props.subTitle}</ParagraphText> : <View />}
      {props.children}
    </View>
  )
};

export const Widget = (props) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  const widgetFactory = WidgetFactory(context);
  const widgetFactoryType = widgetFactory[props.value.type];
  const title = props.value.title || widgetFactoryType.config.widgetTitle;
  const subTitle = friendlyTime(props.value.date);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => props.onSelected ? props.onSelected(props.value.id) : undefined}>
      <View key={props.value.date}
        style={[styles.widgetContainer, props.isSelected ? styles.widgetContainerSelected : '', widgetFactoryType.config.style]}>
        <WidgetHeader title={title} subTitle={subTitle} />
        {widgetFactoryType.renderWidgetItem(props, widgetFactoryType.config)}
      </View>
    </TouchableOpacity>
  )
}