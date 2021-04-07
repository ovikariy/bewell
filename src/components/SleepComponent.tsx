
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { CustomIconRating, CustomIconRatingItem } from './CustomIconRating';
import { IconForButton, Spacer } from './MiscComponents';
import { AppContext } from '../modules/appContext';
import { WidgetBase, WidgetComponentPropsBase, WidgetConfig } from '../modules/widgetFactory';
import { formatDate, addSubtractDays } from '../modules/utils';
import { sizes } from '../assets/styles/style';
import { StyledDatePicker, TimePicker } from './DatetimeComponents';

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
  context!: React.ContextType<typeof AppContext>;

  onPress(rating: number) {
    if (!Number.isInteger(rating))
      return; //nothing to do since rating wasn't selected
    this.props.onChange({ ...this.props.value, rating });
  }

  onStartDateChange(event: any, startDate?: Date) {
    if (!startDate)
      return;
    this.props.onChange({ ...this.props.value, startDate: startDate.toISOString() });
  }

  onEndDateChange(event: any, endDate?: Date) {
    if (!endDate)
      return;
    this.props.onChange({ ...this.props.value, endDate: endDate.toISOString() });
  }

  /**
   * @description if the start date hasn't already been set,
   * will default to one day before the date selected in the header
   */
  onStartTimeChange(event: any, startDate?: Date) {
    if (!startDate || this.props.value.startDate) { /** we are either clearing the field or already have a date, no default needed */
      this.onStartDateChange(event, startDate);
      return;
    }
    const date = this.props.selectedDate ? new Date(this.props.selectedDate) : new Date();
    date.setHours(startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
    this.onStartDateChange(event, addSubtractDays(date, -1));
  }

  /**
 * @description if the end date hasn't already been set,
 * will default to the date selected in the header
 */
  onEndTimeChange(event: any, endDate?: Date) {
    if (!endDate || this.props.value.endDate) { /** we are either clearing the field or already have a date, no default needed */
      this.onEndDateChange(event, endDate);
      return;
    }
    const date = this.props.selectedDate ? new Date(this.props.selectedDate) : new Date();
    date.setHours(endDate.getHours(), endDate.getMinutes(), endDate.getSeconds());
    this.onEndDateChange(event, date);
  }

  render() {
    const ratings = !this.props.config.icons ? <View /> :
      this.props.config.icons.map((item, index) => {
        return (
          <CustomIconRatingItem key={index} id={index} value={item}
            selected={this.props.value && this.props.value.rating === index}
            onPress={(id) => this.onPress(id)} />
        );
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
          <View style={{ flex: 0.8 }}>
            {startTime && /** if no startTime then don't show the date picker, it is only for changing the value after the time has been set */
              <StyledDatePicker
                value={startTime}
                format='MMM D'
                placeholder={' '}
                onChange={(event: any, startDate?: Date) => { this.onStartDateChange(event, startDate); }}
              />}
            {startTime && <Spacer height={sizes[5]} />}
            <TimePicker
              defaultHours={23}
              defaultMinutes={0}
              value={startTime}
              style={{ flex: 0.8 }}
              placeholder={language.bedTime}
              onChange={(event: any, startDate?: Date) => { this.onStartTimeChange(event, startDate); }}
            />
          </View>
          <IconForButton name='wb-sunny' />
          <View style={{ flex: 0.8 }}>
            {endTime && /** if no endTime then don't show the date picker, it is only for changing the value after the time has been set */
              <StyledDatePicker
                value={endTime}
                format='MMM D'
                placeholder={' '}
                onChange={(event: any, endDate?: Date) => { this.onEndDateChange(event, endDate); }}
              />}
            {startTime && <Spacer height={sizes[5]} />}
            <TimePicker
              defaultHours={7}
              defaultMinutes={0}
              value={endTime}
              style={{ flex: 0.8 }}
              placeholder={language.wakeTime}
              onChange={(event: any, endDate?: Date) => { this.onEndTimeChange(event, endDate); }}
            />
          </View>
        </View>
      </View>
    );
  }
}


export interface SleepHistoryComponentProps {
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
        <CustomIconRatingItem id={props.item.rating} value={ratingIcon} textColor={styles.titleText.color} />
      </View>
      <View style={{ flex: 2, justifyContent: 'center' }}>
        <Text style={styles.bodyText}>
          {(props.item.startDate) ? language.bedTime + formatDate(props.item.startDate, 'h:mm A') : undefined}</Text>
        <Text style={styles.bodyText}>
          {(props.item.endDate) ? language.wakeTime + formatDate(props.item.endDate, 'h:mm A') : undefined}</Text>
      </View>
    </View>
  );
};

export const SleepCalendarComponent = (props: SleepHistoryComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  /* config is basically this object i.e config[itemType]  */
  /* custom render item to show small mood icon in the calendar */
  const sleepRatingIcons = props.config.icons;
  if (!sleepRatingIcons || props.item.rating === undefined)
    return <View />;
  const ratingIcon = sleepRatingIcons[props.item.rating];
  return <CustomIconRatingItem id={props.item.rating || -1} value={ratingIcon} hideText={true}
    iconStyle={[styles.ratingIconSmallStyle, { color: styles.brightColor.color }]}
    containerStyle={[styles.ratingIconSmallContainer, { margin: -2 }]} />;
};