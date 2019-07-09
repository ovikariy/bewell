
import React, { Component } from 'react';
import { View } from 'react-native';
import { styles } from '../assets/styles/style';
import { sleepRatingIcons } from '../constants/Constants';
import { ParagraphText, FormTimePicker } from '../components/FormFields';
import { CustomIconRating, CustomIconRatingItem } from '../components/CustomIconRating';
import * as Animatable from 'react-native-animatable';

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
    /* button group expects buttons as an array of functions that return a component object */
    /* TODO: custom sleep icons */
    const buttons = sleepRatingIcons.map((item, index) => {
      return ({
        element: () =>
          <CustomIconRatingItem key={index} value={item} selected={this.props.value && this.props.value.rating === index} />
      })
    });

    let startTime = '11:00 PM';
    if (this.props.value && this.props.value.startDate)
      startTime = new Date(this.props.value.startDate).toLocaleTimeString();

    let endTime = '8:00 AM';
    if (this.props.value && this.props.value.endDate)
      endTime = new Date(this.props.value.endDate).toLocaleTimeString();

    return (
      <View>
        <Animatable.View animation="fadeIn" duration={500}>
          <CustomIconRating buttons={buttons}
            onPress={(rating) => { this.onPress(rating) }} />
        </Animatable.View>
        <View style={styles.formRow}>
          <ParagraphText style={[styles.formLabel, { flex: 2 }]}>Bed time:</ParagraphText>
          <FormTimePicker
            date={startTime}
            disabled={this.props.value ? !Number.isInteger(this.props.value.rating) : true}
            onDateChange={(startDate) => { this.onStartDateChange(startDate) }}
          />
        </View>
        <View style={styles.formRow}>
          <ParagraphText style={[styles.formLabel, { flex: 2 }]}>Wake up time:</ParagraphText>
          <FormTimePicker
            date={endTime}
            disabled={this.props.value ? !Number.isInteger(this.props.value.rating) : true}
            onDateChange={(endDate) => { this.onEndDateChange(endDate) }}
          />
        </View>
      </View>
    );
  }
}