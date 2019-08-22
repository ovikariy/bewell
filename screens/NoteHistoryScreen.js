import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastAndroid, View } from 'react-native';
import { ItemTypes } from '../constants/Constants';
import ItemHistory from '../components/ItemHistory';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';

const mapStateToProps = state => {
  return {
    [ItemTypes.NOTE]: state[ItemTypes.NOTE]
  }
}

class NoteHistoryScreen extends Component {
  static navigationOptions = {
    title: 'Note History'
  };

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props[ItemTypes.NOTE].errMess)
      ToastAndroid.show(this.props[ItemTypes.NOTE].errMess, ToastAndroid.LONG);

    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent>
          <ItemHistory itemState={this.props[ItemTypes.NOTE]} items={this.props[ItemTypes.NOTE].items} itemType={ItemTypes.NOTE}></ItemHistory>
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, null)(NoteHistoryScreen);


