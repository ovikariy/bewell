import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastAndroid, View } from 'react-native';
import * as ItemTypes from '../constants/ItemTypes';
import ItemHistory from '../components/ItemHistory';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';

const mapStateToProps = state => {
  return {
    note: state.note
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
    if (this.props.note.errMess)
      ToastAndroid.show(this.props.note.errMess, ToastAndroid.LONG);

    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent>
          <ItemHistory items={this.props.note.notes} itemType={ItemTypes.NOTE}></ItemHistory>
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, null)(NoteHistoryScreen);


