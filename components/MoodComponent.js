
import React, { Component } from 'react';
import { widgetConfig, ItemTypes } from '../modules/Constants';
import { CustomIconRating, CustomIconRatingItem } from '../components/CustomIconRating';
import * as Animatable from 'react-native-animatable';

export class MoodComponent extends Component {

  onPress(rating) {
    if (!Number.isInteger(rating))
      return; //nothing to do since rating wasn't selected
    this.props.onChange({ ...this.props.value, rating });
  } 

  render() {
    /* button group expects buttons as an array of functions that return a component object */
    const buttons = widgetConfig[ItemTypes.MOOD].icons.map((item, index) => {
      return ({
        element: () =>
        <CustomIconRatingItem key={index} value={item} selected={this.props.value && this.props.value.rating === index} />
      })
    });

    return (
      <Animatable.View animation="fadeIn" duration={500}>
        <CustomIconRating buttons={buttons}
          onPress={(rating) => { this.onPress(rating) }} />
      </Animatable.View>
    );
  }
} 