import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastAndroid, View } from 'react-native';
import * as ItemTypes from '../constants/ItemTypes';
import ItemHistory from '../components/ItemHistory';
import { ScreenContainer } from '../components/ScreenContainer';
import { HeaderOptions } from '../constants/Constants';
import { styles } from '../assets/styles/style';

const mapStateToProps = state => {
  return {
    note: state.note
  }
}

class NoteHistoryScreen extends Component {
  static navigationOptions = {
    title: 'Note History',
    ...HeaderOptions
  };

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.note.errMess)
      ToastAndroid.show(this.props.note.errMess, ToastAndroid.LONG);

    return (
      <ScreenContainer imageBackgroundSource={require('../assets/images/home.jpg')}>
        <View style={styles.screenBody}>
          <ItemHistory items={this.props.note.notes} itemType={ItemTypes.NOTE}></ItemHistory>
        </View>
      </ScreenContainer>
    );
  }
}

export default connect(mapStateToProps, null)(NoteHistoryScreen);


