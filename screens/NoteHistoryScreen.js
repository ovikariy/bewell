import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ItemTypes, stateConstants, text } from '../modules/Constants';
import ItemHistory from '../components/ItemHistory';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION]
  }
}

class NoteHistoryScreen extends Component {
  static navigationOptions = {
    title: text.note.title
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent>
          <ItemHistory
            state={this.props[stateConstants.OPERATION]}
            items={this.props[stateConstants.OPERATION].store[ItemTypes.NOTE]}
            itemType={ItemTypes.NOTE}></ItemHistory>
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, null)(NoteHistoryScreen);


