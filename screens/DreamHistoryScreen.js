import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastAndroid, View } from 'react-native';
import * as ItemTypes from '../constants/ItemTypes';
import ItemHistory from '../components/ItemHistory';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';

const mapStateToProps = state => {
  return {
    dream: state.dream
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
    if (this.props.dream.errMess)
      ToastAndroid.show(this.props.dream.errMess, ToastAndroid.LONG);

    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent isKeyboardAvoidingView={true}>
          <ItemHistory items={this.props.dream.dreams} itemType={ItemTypes.DREAM}></ItemHistory>
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, null)(DreamHistoryScreen);


