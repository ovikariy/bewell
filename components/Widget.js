import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { styles } from '../assets/styles/style';
import { WidgetFactory } from '../modules/WidgetFactory';
import { ParagraphText } from './MiscComponents';
import { friendlyTime, LanguageContext } from '../modules/helpers';

const WidgetHeader = (props) => {
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
  const language = React.useContext(LanguageContext);
  const widgetFactory = WidgetFactory(language);
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