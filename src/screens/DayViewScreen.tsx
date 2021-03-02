import React, { Component } from 'react';
import { AppNavigationProp, AppRouteProp } from '../modules/types';
import DayView from './DayView';

interface DayViewScreenProps {
  navigation: AppNavigationProp<'DayView'>
  route: AppRouteProp<'DayView'>
}

class DayViewScreen extends Component<DayViewScreenProps>  {
  render() {
    return (
      <DayView navigation={this.props.navigation} route={this.props.route} />
    );
  }
}

export default DayViewScreen;