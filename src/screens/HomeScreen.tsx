import React, { Component } from 'react';
import { AppNavigationProp, AppRouteProp } from '../modules/types';
import DayView from './DayView';

interface HomeScreenProps {
  navigation: AppNavigationProp<'Home'>,
  route: AppRouteProp<'Home'>
}
class HomeScreen extends Component<HomeScreenProps>  {

  componentDidUpdate() {
    //this.props.navigation.navigate('Settings', { screen: 'SystemSettings' });
    //const language = this.context.language;
    // this.props.navigation.navigate('ItemHistory', { title: language.mood, itemType: ItemTypes.MOOD });
  }

  render() {
    return (
      <DayView navigation={this.props.navigation} route={this.props.route} />
    );
  }

}

export default HomeScreen;