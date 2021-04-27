import React from 'react';
import { AppContext } from '../modules/appContext';
import { WidgetComponentPropsBase, WidgetConfig } from '../modules/widgetFactory';
import { WidgetBase } from '../modules/types';
import { Text, View } from 'react-native';
import { friendlyTime } from '../modules/utils';
import { CustomIconType, CustomIconRating, CustomIconRatingItem } from './CustomIconRating';
import * as Animatable from 'react-native-animatable';
import { sizes } from '../assets/styles/style';

export interface CustomIconRatingComponentWidgetType extends WidgetBase {
  rating?: number;
}

export interface CustomIconRatingComponentProps extends WidgetComponentPropsBase {
  value: CustomIconRatingComponentWidgetType;
  onChange: (newValue: CustomIconRatingComponentWidgetType) => void
}

export const CustomIconRatingComponent = (props: CustomIconRatingComponentProps) => {
  const ratings = !props.config.icons ? <View /> : props.config.icons.map((icon: CustomIconType, index: number) => {
    return (
      <CustomIconRatingItem key={index} id={index} value={icon}
        iconStyle={{ fontSize: sizes[30] }}
        containerStyle={{ height: sizes[50], width: sizes[50] }}
        selected = { props.value && props.value.rating === index }
    onPress = {(rating) => {
  if (!Number.isInteger(rating))
    return; //nothing to do since rating wasn't selected
  if (props.onChange)
    props.onChange({ ...props.value, rating });
}} />
    );
  });
return (
  <Animatable.View animation="fadeIn" duration={500}>
    <CustomIconRating>{ratings}</CustomIconRating>
  </Animatable.View>
);
};

export interface CustomIconRatingHistoryComponentProps {
  item: CustomIconRatingComponentWidgetType;
  isSelectedItem: boolean;
  config: WidgetConfig;
}
export const CustomIconRatingHistoryComponent = (props: CustomIconRatingHistoryComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  /* config is basically this object i.e config[itemType]  */
  /* custom render item to show mood icon in the row */
  const ratingIcons = props.config.icons;
  if (!ratingIcons || props.item.rating === undefined)
    return <View />;
  const ratingIcon = ratingIcons[props.item.rating];
  return (
    <View style={{ margin: sizes[10], alignContent: 'center' }}>
      <Text style={styles.bodyText}>
        {friendlyTime(props.item.date)}</Text>
      <CustomIconRatingItem id={props.item.rating || -1} value={ratingIcon} textColor={styles.titleText.color}
        iconStyle={{ fontSize: sizes[26] }}
        containerStyle={{ height: sizes[40], width: sizes[40] }} />
    </View>
  );
};

export const CustomIconRatingCalendarComponent = (props: CustomIconRatingHistoryComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  /* config is basically this object i.e config[itemType]  */
  /* custom render item to show small mood icon in the calendar */
  const ratingIcons = props.config.icons;
  if (!ratingIcons || props.item.rating === undefined)
    return <View />;
  const ratingIcon = ratingIcons[props.item.rating];
  return <CustomIconRatingItem id={props.item.rating || -1} value={ratingIcon} hideText={true}
    iconStyle={[styles.ratingIconSmallStyle, { color: styles.brightColor.color }]}
    containerStyle={[styles.ratingIconSmallContainer, { margin: -2 }]} />;
};