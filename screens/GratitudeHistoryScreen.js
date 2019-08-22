import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastAndroid, View } from 'react-native';
import { ItemTypes } from '../constants/Constants';
import ItemHistory from '../components/ItemHistory';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';

const mapStateToProps = state => {
  return {
    [ItemTypes.GRATITUDE]: state[ItemTypes.GRATITUDE]
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
    if (this.props[ItemTypes.GRATITUDE].errMess)
      ToastAndroid.show(this.props[ItemTypes.GRATITUDE].errMess, ToastAndroid.LONG);

    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent>
          <ItemHistory itemState={this.props[ItemTypes.GRATITUDE]} items={this.props[ItemTypes.GRATITUDE].items} itemType={ItemTypes.GRATITUDE}></ItemHistory>
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, null)(GratitudeHistoryScreen);


