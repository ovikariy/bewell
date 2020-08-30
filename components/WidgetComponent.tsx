import React, { PropsWithChildren } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { WidgetComponentPropsBase, WidgetFactoryType } from '../modules/WidgetFactory';
import { ParagraphText } from './MiscComponents';
import { friendlyTime } from '../modules/helpers';
import { AppContext } from '../modules/AppContext';

interface WidgetHeaderComponentProps {
  title?: string;
  subTitle?: string;
}
const WidgetHeaderComponent = (props: PropsWithChildren<WidgetHeaderComponentProps>) => {
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

export const WidgetComponent = (props: WidgetComponentPropsBase & WidgetFactoryType) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  const title = props.config.widgetTitle;
  const subTitle = friendlyTime(props.value.date);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => props.onSelected ? props.onSelected(props.value.id) : undefined}>
      <View key={props.value.date}
        style={[styles.widgetContainer, props.isSelected ? styles.widgetContainerSelected : '', props.config.style]}>
        <WidgetHeaderComponent title={title} subTitle={subTitle} />
        {props.renderWidgetItem(props, props.config)}
      </View>
    </TouchableOpacity>
  )
}