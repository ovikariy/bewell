import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastAndroid, View } from 'react-native';
import { ItemTypes } from '../constants/Constants';
import ItemHistory from '../components/ItemHistory';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';

const mapStateToProps = state => {
  return {
    [ItemTypes.DREAM]: state[ItemTypes.DREAM]
  }
}

class DreamHistoryScreen extends Component {
  static navigationOptions = {
    title: 'Dream History'
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent isKeyboardAvoidingView={true}>
          <ItemHistory itemState={this.props[ItemTypes.DREAM]} items={this.props[ItemTypes.DREAM].items} itemType={ItemTypes.DREAM}></ItemHistory>
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, null)(DreamHistoryScreen);


