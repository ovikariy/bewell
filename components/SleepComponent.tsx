
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { CustomIconRating, CustomIconRatingItem } from './CustomIconRating';
import { IconForButton, TimePicker } from './MiscComponents';
import { AppContext } from '../modules/AppContext';
import { WidgetBase, WidgetComponentPropsBase, WidgetConfig } from '../modules/WidgetFactory';
import { formatDate } from '../modules/helpers';

export interface SleepComponentWidgetType extends WidgetBase {
  rating?: number;
  startDate?: string;
  endDate?: string;
}

export interface SleepComponentProps extends WidgetComponentPropsBase {
  value: SleepComponentWidgetType;
  onChange: (newValue: SleepComponentWidgetType) => void
}

export class SleepComponent extends Component<SleepComponentProps> {
  static contextType = AppContext;
  declare context: React.ContextType<typeof AppContext>;
  
  onPress(rating: number) {
    if (!Number.isInteger(rating))
      return; //nothing to do since rating wasn't selected
    this.props.onChange({ ...this.props.value, rating });
  }

  onStartDateChange(event: any, startDate?: Date) {
    if (!startDate) {
      this.props.onChange({ ...this.props.value, startDate: undefined });
      return;
    }
    //TODO: validate
    /* Since we only ask the user to pick the time not the full date, we need to guess if it should be 
    for today or yesterday. If selected time is greater than now, must mean it is yesterday */
    const selectedDate = new Date(this.props.selectedDate);
    const theDayBefore = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1);

    let startDatePickedByUser = new Date(selectedDate.toLocaleDateString() + ' ' + startDate.toLocaleTimeString());
    if (startDatePickedByUser > selectedDate)
      startDatePickedByUser = new Date(theDayBefore.toLocaleDateString() + ' ' + startDate.toLocaleTimeString());

    const startDateISOString = startDatePickedByUser.toISOString();

    this.props.onChange({ ...this.props.value, startDate: startDateISOString });
  }

  onEndDateChange(event: any, endDate?: Date) {
    if (!endDate) {
      this.props.onChange({ ...this.props.value, endDate: undefined });
      return;
    }
    //TODO: BUG: this logic doesn't work when editing time in the past days. see June 30th entry where both start and end are on the same day but end is earlier than start
    //TODO: validate
    /* Since we only ask the user to pick the time not the full date, we need to guess if it should be 
    for today or yesterday. If selected time is greater than now, must mean it is yesterday */
    const selectedDate = new Date(this.props.selectedDate);
    const theDayBefore = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1);

    let endDatePickedByUser = new Date(Date.parse(selectedDate.toLocaleDateString() + ' ' + endDate.toLocaleTimeString()));
    if (endDatePickedByUser > selectedDate)
      endDatePickedByUser = new Date(Date.parse(theDayBefore.toLocaleDateString() + ' ' + endDate.toLocaleTimeString()));
    const endDateISOString = endDatePickedByUser.toISOString();
    this.props.onChange({ ...this.props.value, endDate: endDateISOString });
  }

  render() {
    const ratings = !this.props.config.icons ? <View /> :
      this.props.config.icons.map((item, index) => {
        return (
          <CustomIconRatingItem key={index} id={index} value={item}
            selected={this.props.value && this.props.value.rating === index}
            onPress={(id) => this.onPress(id)} />
        )
      });

    const startTime = (this.props.value && this.props.value.startDate) ? new Date(this.props.value.startDate) : undefined;
    const endTime = (this.props.value && this.props.value.endDate) ? new Date(this.props.value.endDate) : undefined;

    const language = this.context.language;
    const styles = this.context.styles;
    return (
      <View>
        <Animatable.View animation="fadeIn" duration={500}>
          <CustomIconRating>{ratings}</CustomIconRating>
        </Animatable.View>
        <View style={[
          this.props.value && Number.isInteger(this.props.value.rating) ? {} : { display: 'none' },
          styles.rowContainer,
          styles.buttonPrimary,
          styles.sleepComponentTimeFieldContainer
        ]}>
          <IconForButton name='moon-o' type='font-awesome' />
          <TimePicker
            value={startTime}
            style={{ flex: 0.8 }}
            placeholder={language.bedTime}
            onChange={(event: any, startDate?: Date) => { this.onStartDateChange(event, startDate) }}
          />
          <IconForButton name='wb-sunny' />
          <TimePicker
            value={endTime}
            style={{ flex: 0.8 }}
            placeholder={language.wakeTime}
            onChange={(event: any, endDate?: Date) => { this.onEndDateChange(event, endDate) }}
          />
        </View>
      </View>
    );
  }
}


interface SleepHistoryComponentProps {
  item: SleepComponentWidgetType;
  isSelectedItem: boolean;
  config: WidgetConfig;
}
export const SleepHistoryComponent = (props: SleepHistoryComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  const language = context.language;

  const sleepRatingIcons = props.config.icons;
  if (!sleepRatingIcons || props.item.rating === undefined)
    return <View />;
  const ratingIcon = sleepRatingIcons[props.item.rating];
  if (!ratingIcon)
    return <View />;

  return (
    <View style={styles.row}>
      <View style={[styles.flex, styles.centered]}>
        <CustomIconRatingItem id={props.item.rating} value={ratingIcon} textColor={props.isSelectedItem ? styles.highlightColor.color : null} />
      </View>
      <View style={{ flex: 2 }}>
        <Text style={props.isSelectedItem ? [styles.subTitleText, styles.highlightColor] : styles.subTitleText}>
          {(props.item.startDate) ? language.bedTime + formatDate(props.item.startDate, 'h:mm A') : undefined}</Text>
        <Text style={props.isSelectedItem ? [styles.subTitleText, styles.highlightColor] : styles.subTitleText}>
          {(props.item.endDate) ? language.wakeTime + formatDate(props.item.endDate, 'h:mm A') : undefined}</Text>
      </View>
    </View>
  );
}