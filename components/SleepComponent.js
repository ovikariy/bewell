
import React, { Component } from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { styles } from '../assets/styles/style';
import { CustomIconRating, CustomIconRatingItem } from '../components/CustomIconRating';
import { IconForButton, TimePicker } from '../components/MiscComponents';
import { text } from '../modules/Constants';

export class SleepComponent extends Component {
  onPress(rating) {
    if (!Number.isInteger(rating))
      return; //nothing to do since rating wasn't selected
    this.props.onChange({ ...this.props.value, rating });
  }

  onStartDateChange(startDate) {
    //TODO: validate
    /* Since we only ask the user to pick the time not the full date, we need to guess if it should be 
    for today or yesterday. If selected time is greater than now, must mean it is yesterday */
    console.log('this.props.selectedDate ' + this.props.selectedDate);
    const selectedDate = new Date(this.props.selectedDate);
    const theDayBefore = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1);

    let startDatePickedByUser = new Date(Date.parse(selectedDate.toLocaleDateString() + ' ' + startDate));
    if (startDatePickedByUser > selectedDate)
      startDatePickedByUser = new Date(Date.parse(theDayBefore.toLocaleDateString() + ' ' + startDate));
    startDate = startDatePickedByUser.toISOString();
    this.props.onChange({ ...this.props.value, startDate });
  }

  onEndDateChange(endDate) {
    //TODO: BUG: this logic doesn't work when editing time in the past days. see June 30th entry where both start and end are on the same day but end is earlier than start
    //TODO: validate
    /* Since we only ask the user to pick the time not the full date, we need to guess if it should be 
    for today or yesterday. If selected time is greater than now, must mean it is yesterday */
    const selectedDate = new Date(this.props.selectedDate);
    const theDayBefore = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1);

    let endDatePickedByUser = new Date(Date.parse(selectedDate.toLocaleDateString() + ' ' + endDate));
    if (endDatePickedByUser > selectedDate)
      endDatePickedByUser = new Date(Date.parse(theDayBefore.toLocaleDateString() + ' ' + endDate));
    endDate = endDatePickedByUser.toISOString();
    this.props.onChange({ ...this.props.value, endDate });
  }

  render() {
    const ratings = this.props.config.icons.map((item, index) => {
      return (
        <CustomIconRatingItem key={index} id={index} value={item}
          selected={this.props.value && this.props.value.rating === index}
          onPress={(id) => this.onPress(id)} />
      )
    });

    const startTime = (this.props.value && this.props.value.startDate) ? new Date(this.props.value.startDate).toLocaleTimeString() : '';
    const endTime = (this.props.value && this.props.value.endDate) ? new Date(this.props.value.endDate).toLocaleTimeString() : '';

    return (
      <View>
        <Animatable.View animation="fadeIn" duration={500}>
          <CustomIconRating>{ratings}</CustomIconRating>
        </Animatable.View>
        <View style={[
          this.props.value && Number.isInteger(this.props.value.rating) ? {} : { display: 'none' },
          styles.rowContainer,
          styles.buttonPrimary,
          styles.dontKnowWhatToNameThis
        ]}>
          <IconForButton name='moon-o' type='font-awesome' />
          <TimePicker
            date={startTime}
            style={{ flex: 0.8 }}
            placeholder={text.sleep.bedTime}
            onDateChange={(startDate) => { this.onStartDateChange(startDate) }}
          />
          <IconForButton name='wb-sunny' />
          <TimePicker
            date={endTime}
            style={{ flex: 0.8 }}
            placeholder={text.sleep.wakeTime}
            onDateChange={(endDate) => { this.onEndDateChange(endDate) }}
          />
        </View>
      </View>
    );
  }
}