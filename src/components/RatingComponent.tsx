import React from 'react';
import { AppContext } from '../modules/appContext';
import { WidgetBase, WidgetComponentPropsBase, WidgetConfig } from '../modules/widgetFactory';
import { Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { sizes } from '../assets/styles/style';
import { IconButton } from './MiscComponents';
import { friendlyTime } from '../modules/utils';

export interface RatingComponentWidgetType extends WidgetBase {
  rating?: number;
}

export interface RatingComponentProps extends WidgetComponentPropsBase {
  value: RatingComponentWidgetType;
  onChange?: (newValue: RatingComponentWidgetType) => void;
  iconType?: string;
  iconName?: string;
  config: WidgetConfig & { ratings?: number[] }
}

export const RatingComponent = (props: RatingComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  const ratings = props.config.ratings || [];

  const ratingIcons = ratings.map((rating, index) => {
    return <IconButton key={rating} iconName={props.iconName || 'star'} iconType={props.iconType || 'material-community'} title={rating + ''}
      containerStyle={styles.toolbarButtonContainer}
      iconStyle={{ ...styles.iconPrimary, ...{ color: (props.value && props.value.rating && ratings.indexOf(props.value.rating) >= index) ? styles.bodyText.color : styles.bodyText.color + '30' } }}
      titleStyle={{ ...styles.toolbarButtonText, ...styles.bodyText }}
      onPress={!props.onChange ? undefined : (() => {
        if (props.onChange)
          props.onChange({ ...props.value, rating });
      })}
    />;
  });

  return (
    <Animatable.View animation="fadeIn" duration={500} style={styles.row}>
      {ratingIcons}
    </Animatable.View>
  );
};

interface RatingHistoryComponentProps {
  item: RatingComponentWidgetType;
  isSelectedItem: boolean;
  config: WidgetConfig;
  iconType?: string;
  iconName?: string;
}
export const RatingHistoryComponent = (props: RatingHistoryComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  return (
    <View style={{ marginTop: sizes[10] }}>
      <Text style={[styles.bodyText, {color: styles.titleText.color}]}>
        {friendlyTime(props.item.date)}</Text>
      <RatingComponent value={props.item} {...props} selectedDate={new Date(props.item.date)} />
    </View>
  );
};

export const RatingCalendarComponent = (props: RatingHistoryComponentProps & { hideText?: boolean }) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return <IconButton iconType={props.iconType || 'material-community'} iconName={props.iconName || 'star'} title={props.hideText === true ? '' : props.item.rating + ''}
    containerStyle={styles.toolbarButtonContainer}
    iconStyle={{ ...styles.iconPrimary, color: styles.bodyText.color }}
    titleStyle={{
      ...styles.toolbarButtonText, ...styles.bodyText, fontSize: sizes[16],
      position: 'absolute', paddingTop: sizes[5], color: styles.highlightColor.color
    }}
  />;
};