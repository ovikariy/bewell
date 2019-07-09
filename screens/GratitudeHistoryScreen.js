import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastAndroid, View } from 'react-native';
import { ItemTypes } from '../constants/Constants';
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
          <ItemHistory itemState={this.props.gratitude} items={this.props.gratitude.items} itemType={ItemTypes.GRATITUDE}></ItemHistory>
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, null)(GratitudeHistoryScreen);


