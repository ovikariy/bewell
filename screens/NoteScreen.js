import React from 'react';
import { View, ScrollView, ToastAndroid } from 'react-native';
import { Input } from 'react-native-elements';
import { styles } from '../assets/styles/style';
import { connect } from 'react-redux';
import * as ItemTypes from '../constants/ItemTypes';
import { postItem } from '../redux/CommonActionCreators';
import { ScreenActions } from '../components/ScreenActions';
import { ScreenContainer } from '../components/ScreenContainer';
import { HeaderOptions } from '../constants/Constants';

const mapStateToProps = state => {
  return {
    note: state.note
  }
}

const mapDispatchToProps = dispatch => ({
  postNote: (note) => dispatch(postItem(ItemTypes.NOTE, note))
});

class NoteScreen extends React.Component {
  static navigationOptions = {
    title: 'Write a note',
    ...HeaderOptions
  };

  constructor(props) {
    super(props);
    this.state = {
      note: ''
    }
  }

  recordNote() {
    const date = new Date();
    const newNote = {
      id: date.getTime(), /* use ticks for ID */
      note: this.state.note,
      date: date.toISOString()
    }

    this.props.postNote(newNote);
    this.setState({ note: '' });
    ToastAndroid.show('Note saved!', ToastAndroid.LONG);
    this.props.navigation.navigate('NoteHistory');
  }

  render() {
    return (
      <ScreenContainer imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScrollView style={styles.screenBody}>
          <View style={{ marginTop: 20 }}>
            <Input
              placeholder='...'
              onChangeText={(note) => this.setState({ note })}
              value={this.state.note}
            />
          </View>
          <ScreenActions itemName='Note' navigation={this.props.navigation}
            canSave={(this.state.note + '').trim() == '' ? false : true}
            onPressSave={() => { this.recordNote() }}
          ></ScreenActions>
        </ScrollView>
      </ScreenContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteScreen);