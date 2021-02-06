import React from 'react';
import { AppContext } from '../modules/appContext';
import { WidgetBase, WidgetComponentPropsBase, WidgetConfig } from '../modules/widgetFactory';
import { Text, View } from 'react-native';
import { friendlyTime } from '../modules/utils';
import { CustomIconType, CustomIconRating, CustomIconRatingItem } from './CustomIconRating';
import * as Animatable from 'react-native-animatable';
import { sizes } from '../assets/styles/style';

export interface MoodComponentWidgetType extends WidgetBase {
  rating?: number;
}

export interface MoodComponentProps extends WidgetComponentPropsBase {
  value: MoodComponentWidgetType;
  onChange: (newValue: MoodComponentWidgetType) => void
}

export const MoodComponent = (props: MoodComponentProps) => {
  const ratings = !props.config.icons ? <View /> : props.config.icons.map((icon: CustomIconType, index: number) => {
    return (
      <CustomIconRatingItem key={index} id={index} value={icon}
        selected={props.value && props.value.rating === index}
        onPress={(rating) => {
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

interface MoodHistoryComponentProps {
  item: MoodComponentWidgetType;
  isSelectedItem: boolean;
  config: WidgetConfig;
}
export const MoodHistoryComponent = (props: MoodHistoryComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  /* config is basically this object i.e config[itemType]  */
  /* custom render item to show mood icon in the row */
  const moodRatingIcons = props.config.icons;
  if (!moodRatingIcons || props.item.rating === undefined)
    return <View />;
  const ratingIcon = moodRatingIcons[props.item.rating];
  return (
    <View style={{ margin: sizes[10] }}>
      <Text style={props.isSelectedItem ? [styles.bodyText, styles.highlightColor] : styles.bodyText}>
        {friendlyTime(props.item.date)}</Text>
      <CustomIconRatingItem id={props.item.rating || -1} value={ratingIcon} textColor={props.isSelectedItem ? styles.highlightColor.color : null} />
    </View>
  );
};

export const MoodCalendarComponent = (props: MoodHistoryComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  /* config is basically this object i.e config[itemType]  */
  /* custom render item to show small mood icon in the calendar */
  const moodRatingIcons = props.config.icons;
  if (!moodRatingIcons || props.item.rating === undefined)
    return <View />;
  const ratingIcon = moodRatingIcons[props.item.rating];
  return <CustomIconRatingItem id={props.item.rating || -1} value={ratingIcon} hideText={true}
    iconStyle={styles.ratingIconSmallStyle}
    containerStyle={styles.ratingIconSmallContainer} />;
};