import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastAndroid, View } from 'react-native';
import * as ItemTypes from '../constants/ItemTypes';
import ItemHistory from '../components/ItemHistory';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';

const mapStateToProps = state => {
  return {
    gratitude: state.gratitude
  }
}

class GratitudeHistoryScreen extends Component {
  static navigationOptions = {
    title: 'Gratitude History'
  };

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.gratitude.errMess)
      ToastAndroid.show(this.props.gratitude.errMess, ToastAndroid.LONG);

    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent>
          <ItemHistory items={this.props.gratitude.gratitudes} itemType={ItemTypes.GRATITUDE}></ItemHistory>
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, null)(GratitudeHistoryScreen);


